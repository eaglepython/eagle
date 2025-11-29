import { useState, useEffect } from 'react';

export default function LauncherScreen({ onAuthenticate }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isAttempting, setIsAttempting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const CORRECT_PASSCODE = '1234'; // Change this to your desired passcode

  const handlePasscodeChange = (e) => {
    const value = e.target.value.slice(0, 4); // Limit to 4 digits
    setPasscode(value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAttempting(true);

    // Simulate verification delay
    setTimeout(() => {
      if (passcode === CORRECT_PASSCODE) {
        setError('');
        onAuthenticate();
      } else {
        setError('❌ Incorrect passcode. Try again.');
        setPasscode('');
        setIsAttempting(false);
      }
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && passcode.length === 4) {
      handleSubmit(e);
    }
  };

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 w-full max-w-md px-6 transform transition-all duration-1000 ${fadeIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
            ⚡
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            7TH SENSE
          </h1>
          <p className="text-slate-400 text-lg font-light">Life Excellence Launcher</p>
          <p className="text-red-400/80 text-sm mt-2 font-semibold">Version 1.0 | Discipline = Freedom</p>
        </div>

        {/* Time Display */}
        <div className="text-center mb-8 bg-slate-800/50 rounded-xl p-4 border border-red-900/30 backdrop-blur">
          <div className="text-5xl font-bold text-white font-mono mb-1">
            {timeStr}
          </div>
          <div className="text-slate-300 text-sm">{dateStr}</div>
        </div>

        {/* Passcode Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-semibold mb-3 text-center">
              Enter Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={handlePasscodeChange}
              onKeyPress={handleKeyPress}
              placeholder="••••"
              maxLength="4"
              className={`w-full text-center text-4xl font-bold tracking-widest px-4 py-4 rounded-lg bg-slate-800 border-2 transition-all ${
                error
                  ? 'border-red-500 bg-red-900/20'
                  : 'border-red-900/50 focus:border-red-500 hover:border-red-700'
              } text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              disabled={isAttempting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center text-red-400 text-sm font-semibold animate-pulse">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={passcode.length !== 4 || isAttempting}
            className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
              passcode.length === 4 && !isAttempting
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 cursor-pointer shadow-lg hover:shadow-red-500/50'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            {isAttempting ? 'Verifying...' : 'UNLOCK'}
          </button>
        </form>

        {/* Helper Text */}
        <div className="text-center mt-8 text-slate-500 text-xs">
          <p>🔐 Protected Access</p>
          <p className="mt-1">Enter your 4-digit passcode to access the dashboard</p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 text-center text-slate-500 text-xs">
          <p>Secure Life Tracking System</p>
          <p className="mt-1">© 2025 Life Excellence Initiative</p>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-orange-500"></div>
    </div>
  );
}
