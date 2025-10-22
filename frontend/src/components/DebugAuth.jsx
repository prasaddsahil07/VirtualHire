import React from 'react';
import { useAuthStore } from '../context/authStore';
import { clearAuthStorage, debugStorage } from '../utils/storage';

const DebugAuth = () => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">Debug Auth State</h3>
      <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User: {user ? user.name : 'None'}</p>
        <p>Role: {user?.role || 'None'}</p>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={clearAuth}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
        >
          Clear Auth
        </button>
        <button
          onClick={() => {
            clearAuthStorage();
            window.location.reload();
          }}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Clear Storage
        </button>
        <button
          onClick={debugStorage}
          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          Debug Storage
        </button>
      </div>
    </div>
  );
};

export default DebugAuth;
