"use client"

import React from 'react';
import Head from 'next/head';
import QrAuthComponent from '../QrAuth';

const QrAuthPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Authentification QR Code - Fare Calculator</title>
        <meta name="description" content="Authentifiez-vous avec un QR Code" />
      </Head>
      
      <div className="page-container">
        <header className="header">
          <h1>Fare Calculator</h1>
          <p>Authentification par QR Code</p>
        </header>
        
        <main className="main-content">
          <div className="instructions">
            <h2>Comment utiliser :</h2>
            <ol>
              <li>Ouvrez l'application mobile Fare Calculator</li>
              <li>Accédez à la section "Scanner QR Code"</li>
              <li>Scannez le QR Code ci-dessous</li>
              <li>Confirmez l'authentification sur votre téléphone</li>
              <li>Vous serez automatiquement connecté</li>
            </ol>
          </div>
          
          <QrAuthComponent />
          
          <div className="troubleshooting">
            <h3>Problèmes courants :</h3>
            <ul>
              <li>Assurez-vous que l'application mobile est à jour</li>
              <li>Vérifiez votre connexion internet</li>
              <li>Le QR Code expire après 5 minutes</li>
              <li>Autorisez l'accès à la caméra sur votre téléphone</li>
            </ul>
          </div>
        </main>
        
        <footer className="footer">
          <p>Fare Calculator © {new Date().getFullYear()}</p>
        </footer>
        
        <style jsx>{`
          .page-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .header {
            text-align: center;
            padding: 2rem;
          }
          
          .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }
          
          .main-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
          
          .instructions, .troubleshooting {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
          
          .instructions h2, .troubleshooting h3 {
            margin-top: 0;
            color: #fff;
          }
          
          .instructions ol, .troubleshooting ul {
            text-align: left;
            line-height: 1.6;
          }
          
          .instructions li, .troubleshooting li {
            margin-bottom: 0.5rem;
          }
          
          .footer {
            text-align: center;
            padding: 2rem;
            opacity: 0.8;
          }
          
          @media (max-width: 768px) {
            .main-content {
              padding: 1rem;
            }
            
            .header h1 {
              font-size: 2rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default QrAuthPage;