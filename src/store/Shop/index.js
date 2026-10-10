import { createSlice } from '@reduxjs/toolkit';
import { mockCartItems, mockCategories, mockSubcategories, mockOrders, mockProducts } from '../../data';

const initialState = {
    categories: mockCategories,
    subcategories: mockSubcategories,
    products: mockProducts,
    orders: mockOrders,
    cart: mockCartItems
};

const apiSlice = createSlice({
    name: 'Shop',
    initialState,
    reducers: {
        updateCategories: (state, action) => {
            state.categories = action.payload;
        },
        updateSubcategories: (state, action) => {
            state.subcategories = action.payload;
        },
        updateProducts: (state, action) => {
            state.products = action.payload;
        },
        updateOrders: (state, action) => {
            state.orders = action.payload;
        },
        updateCartItems: (state, action) => {
            state.cart = action.payload;
        },
        clearStore: (state) => {
            return initialState;
        }
    },
});
export const {
    updateCategories,
    updateSubcategories,
    updateProducts,
    updateOrders,
    updateCartItems,
    clearStore,
} = apiSlice.actions;
export default apiSlice.reducer;
