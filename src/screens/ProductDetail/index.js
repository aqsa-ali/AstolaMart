import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Dimensions, FlatList, Alert, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../services/navigationServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { addToCartAction } from '../../store/Shop/actions';

const { width } = Dimensions.get('window');

const ProductDetail = ({ navigation, route }) => {
    const product = route?.params?.product || {
        id: 'prod-demo',
        name: 'Velvet Matte Lipstick',
        brand: 'Luxé Beauty',
        price: 18.50,
        discountPrice: null,
        images: ['💄', '💋', '✨'],
        categoryName: 'Beauty',
        description: 'A luxurious velvet matte lipstick that glides on smoothly and delivers intense color payoff. The long-wearing formula keeps your lips hydrated and comfortable all day long without fading or smudging.',
        stock: 50,
        isFeatured: true,
    };

    const [quantity, setQuantity] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const dispatch = useDispatch();

    const productImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : ['🛍️'];

    const displayPrice = product.discountPrice || product.price;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

    const handleAddToCart = () => {
        dispatch(addToCartAction(product, quantity));
        Alert.alert(
            'Added to Cart! 🛒',
            `${product.name} × ${quantity} has been added to your cart.`,
            [
                { text: 'Continue Shopping', style: 'cancel' },
                { text: 'View Cart', onPress: () => navigate('Cart') },
            ]
        );
    };

    const renderImageItem = ({ item }) => {
        if (!item) return <View style={styles.imageSlide}><Text style={styles.productEmoji}>🛍️</Text></View>;
        const imageUri = typeof item === 'string' ? item : item?.uri;
        const isUri = typeof imageUri === 'string' && (
            imageUri.startsWith('http://') ||
            imageUri.startsWith('https://') ||
            imageUri.startsWith('data:') ||
            imageUri.startsWith('file:') ||
            imageUri.startsWith('content:') ||
            imageUri.startsWith('ph:')
        );

        return (
            <View style={styles.imageSlide}>
                {isUri ? (
                    <Image source={{ uri: imageUri }} style={styles.detailProductImage} resizeMode="contain" />
                ) : (
                    <Text style={styles.productEmoji}>{imageUri || '🛍️'}</Text>
                )}
            </View>
        );
    };

    const onScroll = (event) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(slideIndex);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Image Carousel & Header Layer */}
                <View style={styles.carouselContainer}>
                    <View style={styles.headerAbsolute}>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.goBack()}>
                            <Icon name="arrow-back-outline" size={22} color="#111827" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Icon name="heart-outline" size={22} color="#111827" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={productImages}
                        renderItem={renderImageItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        style={styles.carousel}
                    />

                    {/* Dot Indicators */}
                    <View style={styles.dotsContainer}>
                        {productImages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.brandRow}>
                        <View style={styles.categoryChip}>
                            <Text style={styles.categoryChipText}>{product.categoryName || 'Beauty'}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={14} color="#F59E0B" />
                            <Text style={styles.ratingText}>4.8</Text>
                            <Text style={styles.reviewText}>(1.2k)</Text>
                        </View>
                    </View>

                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.brand}>{product.brand}</Text>

                    <View style={styles.priceQuantityRow}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={styles.productPrice}>Rs. {displayPrice.toFixed(2)}</Text>
                                {hasDiscount && (
                                    <Text style={styles.originalPrice}>Rs. {product.price.toFixed(2)}</Text>
                                )}
                            </View>
                            <Text style={[styles.stockText, { color: product.stock > 0 ? '#10B981' : '#EF4444' }]}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </Text>
                        </View>

                        <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                                <Icon name="remove-outline" size={16} color="#374151" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                                <Icon name="add-outline" size={16} color="#374151" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <Text style={styles.description}>
                        {product.description || 'No description available.'}
                    </Text>

                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomPrice}>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalValue}>Rs. {(displayPrice * quantity).toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.85} onPress={handleAddToCart}>
                    <LinearGradient
                        colors={['#da1884', '#f06292']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.addToCartGradient}
                    >
                        <Icon name="cart-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProductDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 20,
    },

    /* ── Image Carousel & Header ── */
    carouselContainer: {
        width: width,
        height: 380,
        backgroundColor: '#FFF0F6',
        position: 'relative',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    headerAbsolute: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    carousel: {
        flex: 1,
    },
    imageSlide: {
        width: width,
        height: 380,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailProductImage: {
        width: '100%',
        height: '100%',
    },
    productEmoji: {
        fontSize: 140,
        shadowColor: '#da1884',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(218, 24, 132, 0.2)',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: '#da1884',
    },

    /* ── Product Info ── */
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    brandRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryChip: {
        backgroundColor: '#F0F4FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6366F1',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginLeft: 4,
    },
    reviewText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 4,
    },
    productName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
        lineHeight: 30,
    },
    brand: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 20,
    },
    priceQuantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    productPrice: {
        fontSize: 28,
        fontWeight: '800',
        color: '#da1884',
    },
    stockText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    originalPrice: {
        fontSize: 16,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        fontWeight: '500',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 4,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        minWidth: 36,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: '#6B7280',
        marginBottom: 24,
    },
    featuresList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    featureItem: {
        alignItems: 'center',
        gap: 6,
    },
    featureText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4B5563',
    },

    /* ── Bottom Action Bar ── */
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 10,
    },
    bottomPrice: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    addToCartBtn: {
        flex: 1.5,
        borderRadius: 16,
        overflow: 'hidden',
    },
    addToCartGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});