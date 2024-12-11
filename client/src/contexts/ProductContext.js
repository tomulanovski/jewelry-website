import { createContext, useContext, useReducer, useEffect } from 'react';

const ProductContext = createContext(null);

const initialState = {
    products: [],
    isLoading: true,
    error: null
  };

  function productReducer(state, action) {
    switch (action.type) {
      case 'SET_PRODUCTS':
        return {
          ...state,
          products: action.payload,
          isLoading: false
        };
      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload,
          isLoading: false
        };
      default:
        return state;
    }
  }

  function ProductProvider({ children }) {
    const [state, dispatch] = useReducer(productReducer, initialState);
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:3000/shop');
          dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
        }
      };
  
      fetchProducts();
    }, []);
  
    return (
      <ProductContext.Provider value={{ ...state, dispatch }}>
        {children}
      </ProductContext.Provider>
    );
  }

  function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
      throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
  }
  
  export { ProductProvider, useProducts };