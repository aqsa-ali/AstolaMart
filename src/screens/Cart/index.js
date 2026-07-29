import { StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Cart = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            name: 'Velvet Matte Lipstick',
            brand: 'Luxé Beauty',
            price: 18.50,
            quantity: 2,
            image: '💄',
            color: 'Pink',
        },
        {
            id: '2',
            name: 'Hydrating Serum',
            brand: 'Glow Lab',
            price: 32.00,
            quantity: 1,
            image: '🧪',
            color: 'N/A',
        },
        {
            id: '3',
            name: 'Volumizing Mascara',
            brand: 'Lash Pro',
            price: 15.75,
            quantity: 3,
            image: '👁️',
            color: 'Black',
        },
    ]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(id);
            return;
        }
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = subtotal > 0 ? 5.99 : 0;
        const tax = subtotal * 0.08;
        return subtotal + shipping + tax;
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemImageContainer}>
                <Text style={styles.itemEmoji}>{item.image}</Text>
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemColor}>Color: {item.color}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.itemActions}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                        <Icon name="remove-outline" size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                        <Icon name="add-outline" size={16} color="#6B7280" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                >
                    <Icon name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.08;
    const total = calculateTotal();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()}>
                    <Icon name="arrow-back-outline" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <Text style={styles.itemCount}>{cartItems.length} items</Text>
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="cart-outline" size={80} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Start shopping to add items to your cart
                    </Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation?.navigate('Products')}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* Cart Items */}
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.cartList}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Order Summary */}
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping</Text>
                            <Text style={styles.summaryValue}>
                                {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Tax (8%)</Text>
                            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity style={styles.checkoutButton}>
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                            <Icon name="arrow-forward-outline" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    itemCount: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    cartList: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    itemImageContainer: {
        width: 70,
        height: 70,
        backgroundColor: '#FFF0F6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemEmoji: {
        fontSize: 32,
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    itemBrand: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 2,
    },
    itemColor: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#da1884',
    },
    itemActions: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingLeft: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 8,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        minWidth: 24,
        textAlign: 'center',
    },
    removeButton: {
        padding: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: '#da1884',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
    },
    shopButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    summaryContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#da1884',
    },
    checkoutButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#da1884',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginTop: 12,
    },
    checkoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});