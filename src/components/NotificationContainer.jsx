export function NotificationContainer({ notifications }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`notification glass rounded-lg p-4 max-w-sm border-l-4 ${
            notif.type === 'success' ? 'border-green-500 bg-green-900/30' :
            notif.type === 'warning' ? 'border-yellow-500 bg-yellow-900/30' :
            'border-blue-500 bg-blue-900/30'
          }`}
        >
          <p className="text-white font-medium">{notif.message}</p>
        </div>
      ))}
    </div>
  );
}

export default NotificationContainer;
