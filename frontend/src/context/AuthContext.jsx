import { createContext, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  /*
    Restore logged-in user from localStorage.
  */

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);

    } catch (error) {
      console.error(
        'Failed to restore user:',
        error
      );

      localStorage.removeItem('user');
      localStorage.removeItem('token');

      return null;
    }
  });


  /* =====================================================
     SAVE AUTHENTICATION DATA
     ===================================================== */

  const persistAuth = (data) => {

    /*
      Save JWT token.
    */

    localStorage.setItem(
      'token',
      data.token
    );


    /*
      Create frontend user object.
    */

    const userInfo = {
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };


    /*
      Save user.
    */

    localStorage.setItem(
      'user',
      JSON.stringify(userInfo)
    );


    /*
      Update React authentication state.
    */

    setUser(userInfo);
  };


  /* =====================================================
     LOGIN
     ===================================================== */

  const login = async (email, password) => {

    const { data } = await api.post(
      '/auth/login',
      {
        email,
        password,
      }
    );


    /*
      Store token + user.
    */

    persistAuth(data);

    return data;
  };


  /* =====================================================
     REGISTER
     ===================================================== */

  const register = async (payload) => {

    const { data } = await api.post(
      '/auth/register',
      payload
    );

    /*
      Registration does NOT automatically
      authenticate the user.
    */

    return data;
  };


  /* =====================================================
     LOGOUT
     ===================================================== */

  const logout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  };


  /* =====================================================
     AUTH CONTEXT
     ===================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,

        isAdmin:
          user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export { AuthContext };