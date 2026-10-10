import { StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { navigate } from '../../services/navigationServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const Products = ({ navigation, route }) => {
    const initialCategory = route?.params?.selectedCategory || null;
    const initialBrand = route?.params?.selectedBrand || route?.params?.selectedSubcategory || null;

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedBrand, setSelectedBrand] = useState(initialBrand);

    const { products = [], categories = [] } = useSelector(state => state.shopState);

    useEffect(() => {
        if (route?.params?.selectedCategory !== undefined) {
            setSelectedCategory(route.params.selectedCategory);
        }
        if (route?.params?.selectedBrand !== undefined) {
            setSelectedBrand(route.params.selectedBrand);
        } else if (route?.params?.selectedSubcategory !== undefined) {
            setSelectedBrand(route.params.selectedSubcategory);
        }
    }, [route?.params]);

    // Available products for current category
    const categoryProducts = selectedCategory
        ? products.filter(p => {
            if (p.categoryId && selectedCategory.id) {
                return p.categoryId === selectedCategory.id || p.categoryName?.toLowerCase() === selectedCategory.name?.toLowerCase();
            }
            return p.categoryName?.toLowerCase() === selectedCategory.name?.toLowerCase();
        })
        : products;

    // Available subcategories / brands for current category
    const availableBrands = React.useMemo(() => {
        if (!selectedCategory) return [];
        const explicit = selectedCategory.subcategories || selectedCategory.brands || [];
        const explicitNames = explicit.map(s => typeof s === 'string' ? s : s.name);
        const prodBrands = Array.from(new Set(categoryProducts.map(p => p.brand).filter(Boolean)));
        return Array.from(new Set([...explicitNames, ...prodBrands]));
    }, [selectedCategory, categoryProducts]);

    // Final filtered products
    const filteredProducts = selectedBrand
        ? categoryProducts.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase())
        : categoryProducts;

    const renderImage = (img) => {
        if (!img) return <Text style={styles.productEmoji}>🛍️</Text>;
        const imageUri = typeof img === 'string' ? img : img?.uri;
        if (!imageUri) return <Text style={styles.productEmoji}>🛍️</Text>;

        const isUri = typeof imageUri === 'string' && (
            imageUri.startsWith('http://') ||
            imageUri.startsWith('https://') ||
            imageUri.startsWith('data:') ||
            imageUri.startsWith('file:') ||
            imageUri.startsWith('content:') ||
            imageUri.startsWith('ph:')
        );

        if (isUri) {
            return <Image source={{ uri: imageUri }} style={styles.productImage} resizeMode="cover" />;
        }
        return <Text style={styles.productEmoji}>{imageUri}</Text>;
    };

    const renderProductItem = ({ item }) => {
        const hasDiscount = item.discountPrice !== null && item.discountPrice !== undefined;
        const displayPrice = hasDiscount ? item.discountPrice : item.price;
        const savePct = hasDiscount
            ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
            : null;

        return (
            <TouchableOpacity
                style={styles.productCard}
                activeOpacity={0.8}
                onPress={() => navigate('ProductDetail', { product: item })}
            >
                {/* Image area */}
                <View style={styles.imageWrapper}>
                    {renderImage(item.images?.[0])}

                    {/* Featured badge */}
                    {item.isFeatured && (
                        <View style={styles.featuredBadge}>
                            <Icon name="star" size={10} color="#FFFFFF" />
                            <Text style={styles.featuredText}>FEATURED</Text>
                        </View>
                    )}

                    {/* Discount badge */}
                    {hasDiscount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>-{savePct}%</Text>
                        </View>
                    )}

                    {/* Wishlist button */}
                    <TouchableOpacity style={styles.wishlistBtn}>
                        <Icon name="heart-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Info area */}
                <View style={styles.infoArea}>
                    {/* Category chip */}
                    <View style={styles.categoryChip}>
                        <Text style={styles.categoryChipText} numberOfLines={1}>
                            {item.categoryName}
                        </Text>
                    </View>

                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.productBrand} numberOfLines={1}>{item.brand}</Text>

                    {/* Price row */}
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>Rs. {displayPrice.toFixed(2)}</Text>
                        {hasDiscount && (
                            <Text style={styles.originalPrice}>Rs. {item.price.toFixed(2)}</Text>
                        )}
                    </View>

                    {/* Stock indicator */}
                    <View style={styles.stockRow}>
                        <View style={[
                            styles.stockDot,
                            { backgroundColor: item.stock > 10 ? '#10B981' : item.stock > 0 ? '#F59E0B' : '#EF4444' }
                        ]} />
                        <Text style={styles.stockText}>
                            {item.stock > 10 ? 'In Stock' : item.stock > 0 ? `Only ${item.stock} left` : 'Out of Stock'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const FilterBar = () => {
        if (selectedCategory && availableBrands.length > 0) {
            return (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryBar}
                >
                    <TouchableOpacity
                        style={[
                            styles.categoryTab,
                            !selectedBrand && styles.categoryTabActive,
                        ]}
                        onPress={() => setSelectedBrand(null)}
                    >
                        <Text style={[
                            styles.categoryTabText,
                            !selectedBrand && styles.categoryTabTextActive,
                        ]}>All {selectedCategory.name} Brands</Text>
                    </TouchableOpacity>

                    {availableBrands.map((bName, idx) => {
                        const isActive = selectedBrand?.toLowerCase() === bName.toLowerCase();
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.categoryTab,
                                    isActive && styles.categoryTabActive,
                                ]}
                                onPress={() => setSelectedBrand(bName)}
                            >
                                <Text style={[
                                    styles.categoryTabText,
                                    isActive && styles.categoryTabTextActive,
                                ]}>
                                    {bName}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            );
        }

        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryBar}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryTab,
                        !selectedCategory && styles.categoryTabActive,
                    ]}
                    onPress={() => {
                        setSelectedCategory(null);
                        setSelectedBrand(null);
                    }}
                >
                    <Text style={[
                        styles.categoryTabText,
                        !selectedCategory && styles.categoryTabTextActive,
                    ]}>All</Text>
                </TouchableOpacity>

                {categories.map(cat => {
                    const isActive = selectedCategory?.id === cat.id || selectedCategory?.name === cat.name;
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryTab,
                                isActive && styles.categoryTabActive,
                            ]}
                            onPress={() => {
                                setSelectedCategory(cat);
                                setSelectedBrand(null);
                            }}
                        >
                            <Text style={[
                                styles.categoryTabText,
                                isActive && styles.categoryTabTextActive,
                            ]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    const ListHeader = () => (
        <View style={styles.listHeader}>
            <Text style={styles.productCount}>
                {filteredProducts.length} Products {selectedBrand ? `(${selectedBrand})` : ''}
            </Text>
            {(selectedCategory || selectedBrand) && (
                <TouchableOpacity
                    style={styles.clearFilterBtn}
                    onPress={() => {
                        setSelectedCategory(null);
                        setSelectedBrand(null);
                    }}
                >
                    <Icon name="close-circle-outline" size={16} color="#da1884" />
                    <Text style={styles.clearFilterText}>Show All</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const EmptyProducts = () => (
        <View style={styles.emptyContainer}>
            <Icon name="basket-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptySub}>
                {selectedBrand
                    ? `No products available for brand "${selectedBrand}".`
                    : selectedCategory
                    ? `No products added yet under "${selectedCategory.name}".`
                    : 'No products available.'}
            </Text>
        </View>
    );

    const getHeaderTitle = () => {
        if (selectedCategory && selectedBrand) {
            return `${selectedCategory.name} • ${selectedBrand}`;
        }
        if (selectedCategory) {
            return selectedCategory.name;
        }
        return 'All Products';
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
                    <Icon name="arrow-back-outline" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {getHeaderTitle()}
                </Text>
                <View style={{ width: 36 }} />
            </View>

            {/* Category / Subcategory Filter Bar */}
            <View style={styles.categoryBarContainer}>
                <FilterBar />
            </View>

            {/* Products Grid */}
            <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.productGrid}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<ListHeader />}
                ListEmptyComponent={<EmptyProducts />}
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: -0.3,
    },

    /* ── Category Bar ── */
    categoryBarContainer: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 10,
    },
    categoryBar: {
        paddingHorizontal: 16,
        gap: 8,
        alignItems: 'center',
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 4,
    },
    categoryTabActive: {
        backgroundColor: '#da1884',
    },
    categoryTabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    categoryTabTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    /* ── List header ── */
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    productCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    clearFilterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF0F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    clearFilterText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#da1884',
    },

    /* ── Grid ── */
    productGrid: {
        paddingHorizontal: 12,
        paddingTop: 14,
        paddingBottom: 40,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    /* ── Product Card ── */
    productCard: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    /* Image area */
    imageWrapper: {
        height: 140,
        backgroundColor: '#FFF0F6',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    productEmoji: {
        fontSize: 56,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    featuredBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 10,
    },
    featuredText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    discountBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: '#EF4444',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 10,
    },
    discountText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    wishlistBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    /* Info area */
    infoArea: {
        padding: 12,
    },
    categoryChip: {
        alignSelf: 'flex-start',
        backgroundColor: '#F0F4FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        marginBottom: 6,
    },
    categoryChipText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6366F1',
    },
    productName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 18,
        marginBottom: 3,
    },
    productBrand: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
        color: '#da1884',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        fontWeight: '500',
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    stockDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    stockText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },

    /* ── Empty State ── */
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
        marginTop: 12,
        marginBottom: 4,
    },
    emptySub: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});