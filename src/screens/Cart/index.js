import { StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartQuantityAction, removeFromCartAction, placeOrderAction } from '../../store/Shop/actions';

const Cart = ({ navigation }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.shopState.cart || []);

    const updateQuantity = (id, newQuantity) => {
        dispatch(updateCartQuantityAction(id, newQuantity));
    };

    const removeItem = (id) => {
        dispatch(removeFromCartAction(id));
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        const orderId = dispatch(placeOrderAction({
            customerName: 'Guest Customer',
            customerPhone: '+1 234 567 8900',
            shippingAddress: '123 Fashion Street, Suite 100',
            paymentMethod: 'Cash on Delivery',
        }));
        Alert.alert(
            'Order Placed! 🎉',
            `Your order #${orderId ? orderId.slice(-6).toUpperCase() : ''} has been successfully created.`,
            [
                { text: 'View Orders', onPress: () => navigation?.navigate('Orders') },
                { text: 'OK', style: 'cancel' }
            ]
        );
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharges = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + deliveryCharges;

    const renderImage = (img) => {
        if (!img) return <Text style={styles.itemEmoji}>🛍️</Text>;
        const imageUri = typeof img === 'string' ? img : img?.uri;
        if (!imageUri) return <Text style={styles.itemEmoji}>🛍️</Text>;

        const isUri = typeof imageUri === 'string' && (
            imageUri.startsWith('http://') ||
            imageUri.startsWith('https://') ||
            imageUri.startsWith('data:') ||
            imageUri.startsWith('file:') ||
            imageUri.startsWith('content:') ||
            imageUri.startsWith('ph:')
        );

        if (isUri) {
            return <Image source={{ uri: imageUri }} style={styles.itemImage} resizeMode="cover" />;
        }
        return <Text style={styles.itemEmoji}>{imageUri}</Text>;
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            {/* Thumbnail */}
            <View style={styles.imageBox}>
                {renderImage(item.image)}
            </View>

            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                {item.color && item.color !== 'N/A' && (
                    <View style={styles.colorRow}>
                        <View style={styles.colorDot} />
                        <Text style={styles.colorLabel}>{item.color}</Text>
                    </View>
                )}
                <Text style={styles.itemPrice}>Rs. {item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.itemActions}>
                {/* Qty stepper */}
                <View style={styles.stepper}>
                    <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                        <Icon name="remove" size={14} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.stepQty}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                        <Icon name="add" size={14} color="#374151" />
                    </TouchableOpacity>
                </View>
                {/* Row total */}
                <Text style={styles.rowTotal}>Rs. {(item.price * item.quantity).toFixed(2)}</Text>
                {/* Remove */}
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                    <Icon name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const EmptyCart = () => (
        <View style={styles.emptyContainer}>
            <LinearGradient
                colors={['#FFF0F6', '#FAFAFA']}
                style={styles.emptyGradient}
            >
                <View style={styles.emptyIconWrap}>
                    <Icon name="cart-outline" size={48} color="#da1884" />
                </View>
                <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                <Text style={styles.emptySub}>Add some beautiful products to get started</Text>
                <TouchableOpacity
                    style={styles.shopBtn}
                    onPress={() => navigation?.navigate('Products')}
                >
                    <Text style={styles.shopBtnText}>Browse Products</Text>
                    <Icon name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
                    <Icon name="arrow-back-outline" size={22} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>My Cart</Text>
                    {cartItems.length > 0 && (
                        <View style={styles.itemCountBadge}>
                            <Text style={styles.itemCountText}>{cartItems.length}</Text>
                        </View>
                    )}
                </View>
                <View style={{ width: 36 }} />
            </View>

            {cartItems.length === 0 ? (
                <EmptyCart />
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={item => String(item.id)}
                        contentContainerStyle={styles.cartList}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Order Summary */}
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</Text>
                            <Text style={styles.summaryValue}>Rs. {subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Delivery Charges</Text>
                            <Text style={styles.summaryValue}>
                                {deliveryCharges > 0 ? `Rs. ${deliveryCharges.toFixed(2)}` : 'Free'}
                            </Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>Rs. {total.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85} onPress={handleCheckout}>
                            <LinearGradient
                                colors={['#da1884', '#f06292']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.checkoutGradient}
                            >
                                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                                <Icon name="arrow-forward-outline" size={18} color="#FFFFFF" />
                            </LinearGradient>
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

    /* ── Header ── */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    itemCountBadge: {
        backgroundColor: '#da1884',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    itemCountText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
    },

    /* ── Cart list ── */
    cartList: {
        padding: 16,
        paddingBottom: 8,
    },

    /* ── Cart Item ── */
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        gap: 12,
    },
    imageBox: {
        width: 72,
        height: 72,
        borderRadius: 12,
        backgroundColor: '#FFF0F6',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    itemEmoji: {
        fontSize: 34,
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
        lineHeight: 19,
    },
    itemBrand: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    colorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 5,
    },
    colorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#da1884',
    },
    colorLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: '#da1884',
    },
    itemActions: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },

    /* Stepper */
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    stepBtn: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    stepQty: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        minWidth: 26,
        textAlign: 'center',
    },
    rowTotal: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
    },
    removeBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* ── Order Summary ── */
    summaryContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 8,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#da1884',
    },
    checkoutBtn: {
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 14,
    },
    checkoutGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 16,
    },
    checkoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    /* ── Empty ── */
    emptyContainer: {
        flex: 1,
        padding: 20,
    },
    emptyGradient: {
        flex: 1,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyIconWrap: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#da1884',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 20,
    },
    shopBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#da1884',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 14,
    },
    shopBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});