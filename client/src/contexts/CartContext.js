import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
  isLoading: true,
  error: null,
  notification: null
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
      };
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const items = existingItem
        ? state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        : [...state.items, action.payload];
      return { ...state, items };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload
      };
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          // Validate cart data
          if (Array.isArray(parsedCart) && parsedCart.every(item => 
            item.id && typeof item.quantity === 'number' && item.quantity > 0
          )) {
            dispatch({ type: 'SET_ITEMS', payload: parsedCart });
          } else {
            throw new Error('Invalid cart data');
          }
        } else {
          dispatch({ type: 'SET_ITEMS', payload: [] });
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
        dispatch({ type: 'SET_ITEMS', payload: [] });
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save cart' });
      }
    }
  }, [state.items, state.isLoading]);

  const addItem = useCallback((product, quantityToAdd) => {
    if (!product?.id || !product?.quantity || quantityToAdd <= 0) {
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: { type: 'error', message: 'Invalid product data' }
      });
      return false;
    }

    const currentItem = state.items.find(item => item.id === product.id);
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    
    if (currentQuantity + quantityToAdd > product.quantity) {
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: { type: 'error', message: 'Not enough stock available' }
      });
      return false;
    }
  
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...product, quantity: quantityToAdd }
    });

    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { type: 'success', message: 'Item added to cart' }
    });
    return true;
  }, [state.items]);

  const removeItem = useCallback((productId) => {
    if (!productId) return;
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { type: 'success', message: 'Item removed from cart' }
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (!productId || quantity < 0) return;
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity },
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { type: 'success', message: 'Cart cleared' }
    });
  }, []);

  const clearNotification = useCallback(() => {
    dispatch({ type: 'SET_NOTIFICATION', payload: null });
  }, []);

  const getItem = useCallback(
    (productId) => state.items.find(item => item.id === productId),
    [state.items]
  );

  const getTotalItems = useCallback(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items]
  );

  const getTotalPrice = useCallback(
    () => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isLoading: state.isLoading,
        error: state.error,
        notification: state.notification,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearNotification,
        getItem,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { CartProvider, useCart };