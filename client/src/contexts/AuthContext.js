// src/contexts/AuthContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api'

// Action Types
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  RESET_ERROR: 'RESET_ERROR'
};

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true
      };
    
    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      };
    
    case AUTH_ACTIONS.RESET_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      // const response = await axios.get('http://localhost:3000/auth/me');
      const response = await api.get('/auth/me');
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_SUCCESS, 
        payload: response.data 
      });
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE, 
        payload: error.response?.data?.error || 'Authentication failed' 
      });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      // const response = await axios.post('http://localhost:3000/auth/login', { 
      //   email, 
      //   password 
      // });
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_SUCCESS, 
        payload: response.data.user 
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: errorMessage
      });
      throw error.response?.data;
    }
  };

  const register = async (username, email, password) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      // const response = await axios.post(
      //   'http://localhost:3000/auth/register', 
      //   { username, email, password },
      //   {
      //     withCredentials: true,
      //     headers: { 'Content-Type': 'application/json' }
      //   }
      // );
      const response = await api.post(
        '/auth/register', 
        { username, email, password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: response.data.user });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: errorMessage });
      throw error.response?.data;
    }
  };

  const logout = async () => {
    try {
      // await axios.post('http://localhost:3000/auth/logout');
      await api.post('/auth/logout');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: 'Logout failed'
      });
    }
  };

  const resetError = () => {
    dispatch({ type: AUTH_ACTIONS.RESET_ERROR });
  };

  const getUserName = () => {
    return state.user;
  };


  const value = {
    ...state,
    login,
    logout,
    register,
    resetError,
    getUserName
  };

  return (
    <AuthContext.Provider value={value}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useProtectedRoute = (requireAdmin = false) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return true;
  if (!isAuthenticated) return false;
  if (requireAdmin && !user?.isAdmin) return false;
  
  return true;
};