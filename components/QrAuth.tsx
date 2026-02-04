import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import apiClient from '@/app/services/api';

export default function QrAuth() {
    const [sessionCode, setSessionCode] = useState<string>('');
    const [qrUrl, setQrUrl] = useState<string>('');
    const [status, setStatus] = useState<'pending' | 'scanned' | 'authenticated' | 'expired'>('pending');
    const [deviceInfo, setDeviceInfo] = useState<string>('');
    const [ws, setWs] = useState<WebSocket | null>(null);

    const generateQr = async () => {
        try {
            const response = await apiClient.post('/api/qr-auth/generate');
            setSessionCode(response.data.sessionCode);
            setQrUrl(response.data.qrUrl);
            connectWebSocket(response.data.sessionCode);
        } catch (error) {
            console.error('Erreur génération QR:', error);
        }
    };

    const connectWebSocket = (code: string) => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
        const socket = new WebSocket(`${wsUrl}/ws/qr`);
        
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'SUBSCRIBE',
                sessionCode: code
            }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'STATUS_UPDATE') {
                setStatus(data.status.toLowerCase());
                if (data.deviceInfo) {
                    setDeviceInfo(data.deviceInfo);
                }
                if (data.status === 'AUTHENTICATED') {
                    // L'utilisateur est authentifié, connectez-le
                    handleAuthentication();
                }
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setWs(socket);
    };

    const handleAuthentication = () => {
        // Récupérer l'utilisateur et le connecter
        window.location.href = '/accueil'; // Rediriger vers la page d'accueil
    };

    const checkStatus = async () => {
        if (!sessionCode) return;
        try {
            const response = await apiClient.get(`/api/qr-auth/status/${sessionCode}`);
            setStatus(response.data.status.toLowerCase());
            setDeviceInfo(response.data.deviceInfo || '');
        } catch (error) {
            console.error('Erreur vérification status:', error);
        }
    };

    useEffect(() => {
        generateQr();
        
        // Nettoyer la WebSocket
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    return (
        <div className="qr-auth-container">
            <h2>Authentification QR Code</h2>
            
            {sessionCode && (
                <>
                    <div className="qr-code">
                        <QRCodeCanvas 
                            value={qrUrl}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    
                    <div className="qr-info">
                        <p>Code: {sessionCode}</p>
                        <p>Statut: <strong>{status.toUpperCase()}</strong></p>
                        
                        {status === 'scanned' && deviceInfo && (
                            <div className="device-info">
                                <p>Appareil détecté: {deviceInfo}</p>
                                <p>Veuillez confirmer sur votre téléphone</p>
                            </div>
                        )}
                        
                        {status === 'authenticated' && (
                            <div className="success">
                                <p>✅ Authentification réussie!</p>
                                <p>Redirection en cours...</p>
                            </div>
                        )}
                    </div>
                </>
            )}
            
            <button onClick={generateQr} className="refresh-btn">
                Générer un nouveau QR Code
            </button>
        </div>
    );
}