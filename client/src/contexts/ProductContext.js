// src/contexts/ProductContext.js
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../services/api'

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
                isLoading: false,
                error: null
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case 'ADD_PRODUCT':
            return {
                ...state,
                products: [...state.products, action.payload],
                error: null
            };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products: state.products.map(product => 
                    product.id === action.payload.id ? action.payload : product
                ),
                error: null
            };
        case 'DELETE_PRODUCT':
            return {
                ...state,
                products: state.products.filter(product => product.id !== action.payload),
                error: null
            };
        default:
            return state;
    }
}

function ProductProvider({ children }) {
    const [state, dispatch] = useReducer(productReducer, initialState);

    const fetchProducts = async () => {
        try {
            // const response = await axios.get('http://localhost:3000/shop');
            const response = await api.get('/shop'); 
            dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const getProduct = useCallback((productId) => {
        return state.products.find(product => product.id === productId);
    }, [state.products]);

    const addProduct = async (productData) => {
        console.log('ProductContext: Starting addProduct with data:', productData);
        try {
            const dataToSend = {
                title: productData.title,
                description: productData.description,
                price: productData.price,
                quantity: productData.quantity,
                materials: productData.materials,
                type: productData.type,
                imgs: productData.imgs.filter(url => url !== '')
            };
            console.log('ProductContext: Sending POST request with data:', dataToSend);
            
            // const response = await axios.post('http://localhost:3000/product', dataToSend);
            const response = await api.post('/product', dataToSend);
            console.log('ProductContext: Received response:', response.data);
            
            dispatch({ type: 'ADD_PRODUCT', payload: response.data });
            return response.data;
        } catch (error) {
            console.error('ProductContext: Error in addProduct:', error.response?.data || error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add product' });
            throw error;
        }
    };

    const updateProduct = async (productId, productData) => {
        try {
            const dataToSend = {
                title: productData.title,
                description: productData.description,
                price: productData.price,
                quantity: productData.quantity,
                materials: productData.materials,
                type: productData.type,
                imgs: Array.isArray(productData.imgs) ? productData.imgs : [productData.imgs]
            };

            // const response = await axios.put(`http://localhost:3000/product/${productId}`, dataToSend);
            const response = await api.put(`/product/${productId}`, dataToSend);
            dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update product' });
            throw error;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            // await axios.delete(`http://localhost:3000/product/${productId}`);
            await api.delete(`/product/${productId}`);
            dispatch({ type: 'DELETE_PRODUCT', payload: productId });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to delete product' });
            throw error;
        }
    };

    return (
        <ProductContext.Provider 
            value={{
                ...state,
                getProduct,
                addProduct,
                updateProduct,
                deleteProduct,
                refreshProducts: fetchProducts
            }}>
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