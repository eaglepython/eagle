import React, { useEffect, useState } from 'react';
import { GoogleCalendarIntegration } from '../utils/GoogleCalendarIntegration';

/**
 * Google OAuth Callback Handler
 * Handles redirect from Google after user authorization
 */
function GoogleAuthCallback() {
  const [status, setStatus] = useState('Processing authorization...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setError(`Authorization failed: ${error}`);
          setStatus('Authorization failed');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('Error: No code');
          return;
        }

        setStatus('Exchanging authorization code for token...');

        const calendar = new GoogleCalendarIntegration();
        const success = await calendar.exchangeCodeForToken(code);

        if (success) {
          setIsSuccess(true);
          setStatus('✓ Successfully connected to Google Calendar!');
          
          // Redirect back to app after 2 seconds
          setTimeout(() => {
            window.location.href = '/eagle/';
          }, 2000);
        } else {
          setError('Failed to exchange authorization code for token');
          setStatus('Token exchange failed');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError(err.message);
        setStatus('Error processing callback');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="text-center space-y-6 p-8 bg-slate-800/50 rounded-2xl border border-red-900/30 max-w-md">
        <div className="text-6xl mb-4">
          {isSuccess ? '✓' : error ? '✗' : '⏳'}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Google Calendar
        </h1>

        <div className={`text-lg md:text-xl font-semibold ${
          isSuccess ? 'text-green-400' : error ? 'text-red-400' : 'text-blue-400'
        }`}>
          {status}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {!isSuccess && !error && (
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        )}

        {isSuccess && (
          <p className="text-slate-300 text-sm">Redirecting to app...</p>
        )}

        {error && (
          <a
            href="/eagle/"
            className="inline-block mt-4 px-6 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg font-semibold transition"
          >
            Return to App
          </a>
        )}
      </div>
    </div>
  );
}

export default GoogleAuthCallback;
