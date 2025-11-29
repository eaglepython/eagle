export function NotificationContainer({ notifications }) {
  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .notification {
          animation: slide-in 0.3s ease-out;
        }

        .notification-warning {
          animation: pulse-ring 2s infinite;
        }
      `}</style>

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`notification glass rounded-lg p-4 max-w-sm border-l-4 transition-all ${
              notif.type === 'success' ? 'border-green-500 bg-green-900/30' :
              notif.type === 'warning' ? 'border-red-500 bg-red-900/40 notification-warning' :
              'border-blue-500 bg-blue-900/30'
            }`}
          >
            <p className={`font-medium ${
              notif.type === 'warning' ? 'text-red-200 font-bold text-lg' : 'text-white'
            }`}>
              {notif.message}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default NotificationContainer;
