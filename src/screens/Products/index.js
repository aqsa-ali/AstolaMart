import { StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { navigate } from '../../services/navigationServices';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const Products = ({ navigation }) => {
    // Sample product data
    const products = [
        { id: '1', name: 'Matte Foundation', brand: 'Luxé Beauty', price: '$24.99', rating: 4.5, image: '🎨', category: 'Makeup' },
        { id: '2', name: 'Velvet Lipstick', brand: 'Rose Cosmetics', price: '$18.50', rating: 4.8, image: '💄', category: 'Makeup' },
        { id: '3', name: 'Hydrating Serum', brand: 'Glow Lab', price: '$32.00', rating: 4.6, image: '🧪', category: 'Skincare' },
        { id: '4', name: 'Volumizing Mascara', brand: 'Lash Pro', price: '$15.75', rating: 4.3, image: '👁️', category: 'Makeup' },
        { id: '5', name: 'Rose Water Toner', brand: 'Natural Essence', price: '$12.99', rating: 4.7, image: '🌹', category: 'Skincare' },
        { id: '6', name: 'Argan Hair Oil', brand: 'Pure Care', price: '$21.50', rating: 4.4, image: '💧', category: 'Hair' },
        { id: '7', name: 'Brow Pencil', brand: 'Define Beauty', price: '$14.25', rating: 4.2, image: '✏️', category: 'Makeup' },
        { id: '8', name: 'Vitamin C Cream', brand: 'Radiance Co.', price: '$28.00', rating: 4.9, image: '🌟', category: 'Skincare' },
        { id: '9', name: 'Setting Spray', brand: 'Stay Perfect', price: '$16.99', rating: 4.1, image: '🌫️', category: 'Makeup' },
        { id: '10', name: 'Face Wash', brand: 'Clean Beauty', price: '$11.50', rating: 4.6, image: '🧼', category: 'Skincare' },
        { id: '11', name: 'Blush Stick', brand: 'Flush Cosmetics', price: '$19.99', rating: 4.4, image: '🌸', category: 'Makeup' },
        { id: '12', name: 'Eye Cream', brand: 'Youthful Glow', price: '$34.00', rating: 4.8, image: '👀', category: 'Skincare' },
    ];

    const renderProductItem = ({ item }) => (
        <TouchableOpacity style={styles.productCard} activeOpacity={0.8} onPress={()=> navigate('ProductDetail')}>
            <View style={styles.productImageWrapper}>
                <Text style={styles.productEmoji}>{item.image}</Text>
                <TouchableOpacity style={styles.wishlistButton}>
                    <Icon name="heart-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productBrand}>{item.brand}</Text>
                <View style={styles.ratingContainer}>
                    <Icon name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <Text style={styles.productPrice}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
                    <Icon name="arrow-back-outline" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Products</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="options-outline" size={24} color="#111827" />
                </TouchableOpacity>
            </View>

            {/* Products Grid */}
            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.productGrid}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default Products;

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
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#F9FAFB',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: -0.3,
    },
    filterButton: {
        padding: 4,
    },
    productGrid: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 30,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    productCard: {
        width: (width - 48) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    productImageWrapper: {
        height: 130,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    productEmoji: {
        fontSize: 48,
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 6,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    productBrand: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
        fontWeight: '500',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#da1884',
    },
});