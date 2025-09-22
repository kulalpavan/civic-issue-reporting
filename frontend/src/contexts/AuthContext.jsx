import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) return null;
      
      const parsedUser = JSON.parse(user);
      
      // Validate token format (basic check)
      if (!token.includes('.') || token.split('.').length !== 3) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
      
      return { token, user: parsedUser };
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((token, user) => {
    try {
      if (!token || !user) {
        throw new Error('Token and user are required');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuth({ token, user });
      
      console.log('✅ User logged in:', user.username, user.role);
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuth(null);
      
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }, []);

  // Check if token is expired (basic check without decoding)
  const isTokenExpired = useCallback(() => {
    if (!auth?.token) return true;
    
    try {
      const tokenPayload = JSON.parse(atob(auth.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        console.log('⚠️ Token expired');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return true;
    }
  }, [auth?.token]);

  // Auto-logout if token is expired
  useEffect(() => {
    if (auth && isTokenExpired()) {
      console.log('🔄 Auto-logout due to expired token');
      logout();
    }
  }, [auth, isTokenExpired, logout]);

  const value = {
    auth,
    login,
    logout,
    isLoading,
    setIsLoading,
    isAuthenticated: !!auth && !isTokenExpired(),
    isTokenExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}