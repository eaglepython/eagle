import React, { useState, useEffect } from 'react';
import { AudioNotifications } from '../utils/AudioNotifications';

function AudioNotificationManager({ addNotification }) {
  const [audioManager] = useState(() => new AudioNotifications());
  const [isEnabled, setIsEnabled] = useState(audioManager.enabled);
  const [volume, setVolume] = useState(audioManager.getVolume());
  const [selectedSound, setSelectedSound] = useState(audioManager.selectedSound);
  const [availableSounds, setAvailableSounds] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setAvailableSounds(audioManager.getAvailableSounds());
  }, [audioManager]);

  const handleToggleAudio = () => {
    if (isEnabled) {
      audioManager.disableAudio();
      setIsEnabled(false);
      addNotification('Sound notifications disabled', 'info');
    } else {
      audioManager.enableAudio();
      setIsEnabled(true);
      addNotification('Sound notifications enabled!', 'success');
      // Play test sound
      audioManager.testSound();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  const handleSoundChange = (e) => {
    const newSound = e.target.value;
    setSelectedSound(newSound);
    audioManager.setNotificationSound(newSound);
    // Play preview
    audioManager.playCustomSound(newSound);
  };

  const handleTestSound = () => {
    audioManager.testSound();
  };

  const status = audioManager.getStatus();

  return (
    <div className="space-y-4">
      {/* Audio Status Bar */}
      <div className={`rounded-lg p-4 border transition-all ${
        isEnabled 
          ? 'bg-green-500/10 border-green-500/50' 
          : 'bg-slate-700/20 border-slate-600/50'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isEnabled ? '🔊' : '🔇'}</span>
            <div>
              <div className="font-semibold text-white">Sound Notifications</div>
              <div className="text-xs text-slate-300">
                {isEnabled ? `Playing: ${status.soundName}` : 'Disabled'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              showSettings
                ? 'bg-red-600/20 border border-red-500/50 text-red-300'
                : 'bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            {showSettings ? '✕ Close' : '⚙️ Settings'}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
            <div>
              <div className="font-semibold text-white text-sm">Enable Audio</div>
              <div className="text-xs text-slate-400">Receive sound notifications</div>
            </div>
            <button
              onClick={handleToggleAudio}
              className={`px-4 py-2 rounded-lg font-bold transition-all text-sm ${
                isEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-600 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Volume Control */}
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-white text-sm">🔊 Volume</label>
              <span className="text-xs bg-red-600/20 border border-red-500/50 text-red-300 px-2 py-1 rounded">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              disabled={!isEnabled}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Quiet</span>
              <span>Loud</span>
            </div>
          </div>

          {/* Sound Selection */}
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
            <label className="font-semibold text-white text-sm mb-2 block">
              🎵 Notification Sound
            </label>
            <select
              value={selectedSound}
              onChange={handleSoundChange}
              disabled={!isEnabled}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            >
              {availableSounds.map(sound => (
                <option key={sound.id} value={sound.id}>
                  {sound.name}
                </option>
              ))}
            </select>
          </div>

          {/* Test Button */}
          <button
            onClick={handleTestSound}
            disabled={!isEnabled}
            className={`w-full py-2.5 rounded-lg font-semibold transition-all text-sm ${
              isEnabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            ▶️ Test Sound
          </button>

          {/* Info */}
          <div className="text-xs text-slate-400 p-2 bg-slate-900/30 rounded border border-slate-700/30">
            💡 Sounds play for reminders, live updates, goals achieved, and important alerts. Browser must have audio enabled.
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => audioManager.playReminderSound()}
          disabled={!isEnabled}
          className={`p-2 rounded-lg border transition-all text-xs font-semibold ${
            isEnabled
              ? 'bg-red-600/10 border-red-500/50 text-red-300 hover:bg-red-600/20'
              : 'bg-slate-700/30 border-slate-600/30 text-slate-500 cursor-not-allowed'
          }`}
        >
          ⏰ Reminder
        </button>
        <button
          onClick={() => audioManager.playUpdateSound()}
          disabled={!isEnabled}
          className={`p-2 rounded-lg border transition-all text-xs font-semibold ${
            isEnabled
              ? 'bg-blue-600/10 border-blue-500/50 text-blue-300 hover:bg-blue-600/20'
              : 'bg-slate-700/30 border-slate-600/30 text-slate-500 cursor-not-allowed'
          }`}
        >
          📡 Update
        </button>
        <button
          onClick={() => audioManager.playSuccessSound()}
          disabled={!isEnabled}
          className={`p-2 rounded-lg border transition-all text-xs font-semibold ${
            isEnabled
              ? 'bg-green-600/10 border-green-500/50 text-green-300 hover:bg-green-600/20'
              : 'bg-slate-700/30 border-slate-600/30 text-slate-500 cursor-not-allowed'
          }`}
        >
          ✅ Success
        </button>
        <button
          onClick={() => audioManager.playAlertSound()}
          disabled={!isEnabled}
          className={`p-2 rounded-lg border transition-all text-xs font-semibold ${
            isEnabled
              ? 'bg-orange-600/10 border-orange-500/50 text-orange-300 hover:bg-orange-600/20'
              : 'bg-slate-700/30 border-slate-600/30 text-slate-500 cursor-not-allowed'
          }`}
        >
          ⚠️ Alert
        </button>
      </div>
    </div>
  );
}

export default AudioNotificationManager;
