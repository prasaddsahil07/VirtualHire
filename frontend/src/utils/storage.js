// Utility functions for localStorage management

export const clearAuthStorage = () => {
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('theme-storage');
};

export const clearAllStorage = () => {
  localStorage.clear();
};

// Debug function to check storage
export const debugStorage = () => {
  console.log('Auth Storage:', localStorage.getItem('auth-storage'));
  console.log('Theme Storage:', localStorage.getItem('theme-storage'));
};
