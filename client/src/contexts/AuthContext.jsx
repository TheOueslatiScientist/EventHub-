import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Sauvegarde automatique dans le localStorage
  useEffect(() => {
    if (token != null) localStorage.setItem('access_token', token);
  }, [token]);

  useEffect(() => {
    if (user != null) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

