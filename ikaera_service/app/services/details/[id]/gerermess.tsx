import React from 'react';

interface NotificationProps {
  error?: string;
  success?: string;
}

const Notification: React.FC<NotificationProps> = ({ error, success }) => {
  return (
    <>
      {error && (
        <div
          className="fixed left-13 bottom-13 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
          style={{
            animationDuration: '4s',
            animationTimingFunction: 'ease-out',
            zIndex: '3',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="fixed left-2 bottom-2 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
          style={{
            animationDuration: '4s',
            animationTimingFunction: 'ease-out',
            zIndex: '3',
          }}
        >
          {success}
        </div>
      )}
    </>
  );
};

export default Notification;
