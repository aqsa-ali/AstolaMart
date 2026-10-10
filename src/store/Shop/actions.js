import { updateCategories, updateSubcategories, updateProducts, updateCartItems, updateOrders } from './index';

// ─── Category Actions ─────────────────────────────────────────────────────────

/**
 * Appends a new category to the categories list.
 */
export const addCategoryAction = (newCategory) => (dispatch, getState) => {
    const { categories } = getState().shopState;
    dispatch(updateCategories([...categories, newCategory]));
};

/**
 * Appends a new subcategory to the subcategories list.
 */
export const addSubcategoryAction = (newSubcategory) => (dispatch, getState) => {
    const { subcategories = [] } = getState().shopState;
    dispatch(updateSubcategories([...subcategories, newSubcategory]));
};

// ─── Product Actions ──────────────────────────────────────────────────────────

/**
 * Appends a new product to the products list.
 */
export const addProductAction = (newProduct) => (dispatch, getState) => {
    const { products } = getState().shopState;
    dispatch(updateProducts([...products, newProduct]));
};

// ─── Cart Actions ─────────────────────────────────────────────────────────────

/**
 * Adds a product to the cart. If it already exists, increments quantity.
 * @param {object} product  - product object (id, name, brand, price, images, etc.)
 * @param {number} quantity - quantity to add (default 1)
 */
export const addToCartAction = (product, quantity = 1) => (dispatch, getState) => {
    const { cart } = getState().shopState;
    const existing = cart.find(item => item.id === product.id);
    let updatedCart;
    if (existing) {
        updatedCart = cart.map(item =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
        );
    } else {
        const cartItem = {
            id: product.id,
            name: product.name,
            brand: product.brand || 'Unknown',
            price: product.discountPrice || product.price,
            quantity,
            image: Array.isArray(product.images) ? product.images[0] : product.images,
            color: 'N/A',
        };
        updatedCart = [...cart, cartItem];
    }
    dispatch(updateCartItems(updatedCart));
};

/**
 * Removes a cart item by product id.
 */
export const removeFromCartAction = (productId) => (dispatch, getState) => {
    const { cart } = getState().shopState;
    dispatch(updateCartItems(cart.filter(item => item.id !== productId)));
};

/**
 * Updates quantity for an existing cart item.
 * If newQuantity < 1, the item is removed.
 */
export const updateCartQuantityAction = (productId, newQuantity) => (dispatch, getState) => {
    const { cart } = getState().shopState;
    if (newQuantity < 1) {
        dispatch(updateCartItems(cart.filter(item => item.id !== productId)));
    } else {
        dispatch(updateCartItems(
            cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
        ));
    }
};

/**
 * Clears the cart.
 */
export const clearCartAction = () => (dispatch) => {
    dispatch(updateCartItems([]));
};

// ─── Order Actions ────────────────────────────────────────────────────────────

/**
 * Places an order from the current cart contents.
 * Builds an order object, adds it to orders, then clears the cart.
 * @param {object} extraInfo  - { shippingAddress, paymentMethod, customerName, customerPhone }
 * @returns {string} the new order id
 */
export const placeOrderAction = (extraInfo = {}) => (dispatch, getState) => {
    const { cart, orders } = getState().shopState;
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharges = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + deliveryCharges;
    const orderId = `ord-${Date.now()}`;

    const newOrder = {
        id: orderId,
        userId: 'usr-local',
        customerName: extraInfo.customerName || 'Guest User',
        customerPhone: extraInfo.customerPhone || 'N/A',
        items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price * item.quantity,
        })),
        subtotal,
        discount: 0,
        deliveryCharges,
        total,
        paymentMethod: extraInfo.paymentMethod || 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        shippingAddress: extraInfo.shippingAddress || '—',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    dispatch(updateOrders([newOrder, ...orders]));
    dispatch(updateCartItems([]));
    return orderId;
};
