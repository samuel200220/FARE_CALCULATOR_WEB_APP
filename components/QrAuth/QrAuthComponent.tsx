"use client"

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import apiClient from '@/app/services/api';

interface QrAuthResponse {
  tokenId: string;
}

interface QrCheckResponse {
  validated: boolean;
  userId?: string;
  error?: string;
}

const QrAuthComponent: React.FC = () => {
  const [tokenId, setTokenId] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [status, setStatus] = useState<'initializing' | 'waiting' | 'scanned' | 'authenticated' | 'expired'>('initializing');
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Générer un nouveau QR Code
  const generateQrCode = async () => {
    try {
      setStatus('initializing');
      setError('');
      
      const response = await apiClient.post<QrAuthResponse>('/auth/qr/create');
      const newTokenId = response.data.tokenId;
      setTokenId(newTokenId);
      
      // Créer l'URL pour le QR Code
      const qrData = JSON.stringify({
        type: 'farcal_auth',
        tokenId: newTokenId,
        timestamp: Date.now()
      });
      
      // URL encodée pour l'app mobile
      const encodedData = encodeURIComponent(qrData);
      setQrUrl(`farcal://auth?data=${encodedData}`);
      
      setStatus('waiting');
      
      // Démarrer la vérification périodique
      startChecking(newTokenId);
      
    } catch (err: any) {
      console.error('Erreur génération QR:', err);
      setError(err.message || 'Erreur lors de la génération du QR Code');
    }
  };

  // Vérifier périodiquement le statut
  const startChecking = (checkTokenId: string) => {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    
    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get<QrCheckResponse>(`/auth/qr/check/${checkTokenId}`);
        
        if (response.data.validated) {
          setStatus('authenticated');
          setUserId(response.data.userId || '');
          clearInterval(interval);
          
          // Rediriger après 2 secondes
          setTimeout(() => {
            window.location.href = '/accueil';
          }, 2000);
          
        } else if (response.data.error === 'TOKEN_EXPIRED') {
          setStatus('expired');
          clearInterval(interval);
        }
        
      } catch (err: any) {
        if (err.response?.status === 410) {
          setStatus('expired');
          clearInterval(interval);
        }
        console.error('Erreur vérification:', err);
      }
    }, 2000); // Vérifier toutes les 2 secondes
    
    setCheckInterval(interval);
  };

  // Initialiser
  useEffect(() => {
    generateQrCode();
    
    // Nettoyer l'intervalle à la destruction
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, []);

  // Rendu selon le statut
  const renderStatus = () => {
    switch (status) {
      case 'initializing':
        return (
          <div className="status initializing">
            <div className="spinner"></div>
            <p>Initialisation en cours...</p>
          </div>
        );
        
      case 'waiting':
        return (
          <div className="status waiting">
            <p>Scannez le QR Code avec l'application mobile</p>
            <p className="hint">Le code expirera dans 5 minutes</p>
          </div>
        );
        
      case 'scanned':
        return (
          <div className="status scanned">
            <p>✓ QR Code scanné</p>
            <p>Confirmez sur votre téléphone</p>
          </div>
        );
        
      case 'authenticated':
        return (
          <div className="status authenticated">
            <p>✅ Authentification réussie !</p>
            <p>Redirection en cours...</p>
            {userId && <p className="userId">ID utilisateur : {userId.substring(0, 8)}...</p>}
          </div>
        );
        
      case 'expired':
        return (
          <div className="status expired">
            <p>⏰ QR Code expiré</p>
            <p>Générez un nouveau code</p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="qr-auth-container">
      <h2>Authentification QR Code</h2>
      
      {error && (
        <div className="error-alert">
          <p>Erreur : {error}</p>
          <button onClick={generateQrCode}>Réessayer</button>
        </div>
      )}
      
      <div className="qr-display">
        {tokenId && status !== 'expired' && (
          <>
            <div className="qr-code-wrapper">
              <QRCodeSVG
                value={qrUrl}
                size={256}
                level="H"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>
            
            <div className="qr-info">
              <div className="token-info">
                <p>Token : <code>{tokenId.substring(0, 12)}...</code></p>
              </div>
            </div>
          </>
        )}
        
        {status === 'expired' && (
          <div className="expired-placeholder">
            <div className="expired-icon">⌛</div>
            <p>Code expiré</p>
          </div>
        )}
      </div>
      
      <div className="status-container">
        {renderStatus()}
      </div>
      
      <div className="actions">
        <button 
          onClick={generateQrCode}
          className="refresh-btn"
        >
          {status === 'expired' ? 'Générer un nouveau code' : 'Rafraîchir le code'}
        </button>
        
        <button 
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(tokenId);
              alert('Token copié !');
            }
          }}
          className="copy-btn"
          disabled={!tokenId}
        >
          Copier le token
        </button>
      </div>
      
      <style jsx>{`
        .qr-auth-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          margin-bottom: 2rem;
          color: #333;
        }
        
        .qr-display {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .qr-code-wrapper {
          display: inline-block;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        
        .token-info {
          margin-top: 1rem;
          font-family: monospace;
          color: #666;
        }
        
        .expired-placeholder {
          padding: 2rem;
        }
        
        .expired-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .status-container {
          margin: 1.5rem 0;
          padding: 1rem;
          border-radius: 8px;
        }
        
        .status {
          font-size: 1.1rem;
        }
        
        .status.waiting {
          color: #0066cc;
        }
        
        .status.scanned {
          color: #28a745;
        }
        
        .status.authenticated {
          color: #28a745;
          font-weight: bold;
        }
        
        .status.expired {
          color: #dc3545;
        }
        
        .status.initializing .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0066cc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }
        
        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .refresh-btn {
          background-color: #0066cc;
          color: white;
        }
        
        .refresh-btn:hover {
          background-color: #0052a3;
        }
        
        .copy-btn {
          background-color: #6c757d;
          color: white;
        }
        
        .copy-btn:hover {
          background-color: #545b62;
        }
        
        .copy-btn:disabled {
          background-color: #adb5bd;
          cursor: not-allowed;
        }
        
        .error-alert {
          background-color: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        
        .userId {
          font-size: 0.9rem;
          color: #666;
          margin-top: 0.5rem;
        }
        
        .hint {
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default QrAuthComponent;