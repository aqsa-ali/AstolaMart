import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { navigate } from '../../services/navigationServices';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ProductDetail = ({ navigation }) => {
    const [quantity, setQuantity] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const productImages = ['💄', '💋', '✨'];

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const renderImageItem = ({ item }) => (
        <View style={styles.imageSlide}>
            <Text style={styles.productEmoji}>{item}</Text>
        </View>
    );

    const onScroll = (event) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(slideIndex);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()}>
                    <Icon name="arrow-back-outline" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Detail</Text>
                <TouchableOpacity>
                    <Icon name="heart-outline" size={24} color="#111827" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Image Carousel */}
                <View style={styles.carouselContainer}>
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
                    <Text style={styles.brand}>Luxé Beauty</Text>

                    {/* Product Name and Quantity Row */}
                    <View style={styles.nameQuantityRow}>
                        <Text style={styles.productName}>Velvet Matte Lipstick</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                                <Icon name="remove-outline" size={18} color="#6B7280" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                                <Icon name="add-outline" size={18} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Rating & Reviews */}
                    <View style={styles.ratingRow}>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={16} color="#F59E0B" />
                            <Icon name="star" size={16} color="#F59E0B" />
                            <Icon name="star" size={16} color="#F59E0B" />
                            <Icon name="star" size={16} color="#F59E0B" />
                            <Icon name="star-half" size={16} color="#F59E0B" />
                            <Text style={styles.ratingText}>4.5</Text>
                        </View>
                        <Text style={styles.reviewText}>(1,234 Reviews)</Text>
                    </View>

                    {/* Price */}
                    <Text style={styles.productPrice}>$18.50</Text>

                    <View style={styles.divider} />

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        A luxurious velvet matte lipstick that glides on smoothly and delivers intense color payoff.
                        The long-wearing formula keeps your lips hydrated and comfortable all day long.
                    </Text>
                </View>
            </ScrollView>

            {/* Add to Cart Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.addToCartButton} onPress={()=> navigate('Cart')}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                    <Text style={styles.totalPrice}>${(18.50 * quantity).toFixed(2)}</Text>
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
    scrollContent: {
        paddingBottom: 20,
    },
    carouselContainer: {
        width: width,
        height: 300,
        backgroundColor: '#FFF0F6',
        position: 'relative',
    },
    carousel: {
        flex: 1,
    },
    imageSlide: {
        width: width,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productEmoji: {
        fontSize: 100,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: '#da1884',
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    brand: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    nameQuantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
        marginRight: 12,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        minWidth: 28,
        textAlign: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 4,
    },
    reviewText: {
        fontSize: 14,
        color: '#6B7280',
    },
    productPrice: {
        fontSize: 24,
        fontWeight: '700',
        color: '#da1884',
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#6B7280',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    addToCartButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#da1884',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});