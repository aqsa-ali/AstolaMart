import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TextInput,
  Dimensions,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { navigate } from '../../services/navigationServices'
import { useSelector } from 'react-redux'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

const Subcategories = ({ route, navigation }) => {
  const selectedCategory = route?.params?.selectedCategory || route?.params?.category || null
  const [searchQuery, setSearchQuery] = useState('')

  const { products = [], categories = [], subcategories = [] } = useSelector(state => state.shopState)

  // Find active category object if only id/name passed
  const category = selectedCategory
    ? categories.find(c => c.id === selectedCategory.id || c.name?.toLowerCase() === selectedCategory.name?.toLowerCase()) || selectedCategory
    : categories[0]

  // Filter products belonging to this category
  const categoryProducts = category
    ? products.filter(p => {
        if (p.categoryId && category.id) {
          return p.categoryId === category.id || p.categoryName?.toLowerCase() === category.name?.toLowerCase()
        }
        return p.categoryName?.toLowerCase() === category.name?.toLowerCase()
      })
    : products

  // Get subcategories for this category (from Redux/Firestore subcategories + category embedded subcategories)
  const categorySubcatsFromStore = subcategories.filter(s => s.categoryId === category?.id)
  const explicitSubcats = categorySubcatsFromStore.length > 0 
    ? categorySubcatsFromStore 
    : (category?.subcategories || category?.brands || [])

  // Collect all unique brand names from category products
  const productBrands = Array.from(new Set(categoryProducts.map(p => p.brand).filter(Boolean)))

  // Build unified subcategories list
  const subcategoryList = []
  
  // First add explicit subcategories
  explicitSubcats.forEach(sub => {
    const subName = typeof sub === 'string' ? sub : sub.name
    const subDesc = typeof sub === 'object' ? sub.description : `Explore ${subName} products`
    const subImage = typeof sub === 'object' ? sub.image : 'pricetag-outline'
    
    const count = categoryProducts.filter(p => p.brand?.toLowerCase() === subName.toLowerCase()).length
    subcategoryList.push({
      id: typeof sub === 'object' ? sub.id : `sub-${subName}`,
      name: subName,
      description: subDesc,
      image: subImage,
      productCount: count,
    })
  })

  // Add any product brands that weren't in explicit subcategories
  productBrands.forEach(brandName => {
    if (!subcategoryList.some(s => s.name.toLowerCase() === brandName.toLowerCase())) {
      const count = categoryProducts.filter(p => p.brand?.toLowerCase() === brandName.toLowerCase()).length
      subcategoryList.push({
        id: `brand-${brandName}`,
        name: brandName,
        description: `Official products from ${brandName}`,
        image: 'pricetag-outline',
        productCount: count,
      })
    }
  })

  // Filter subcategories based on search query
  const filteredSubcategories = searchQuery.trim()
    ? subcategoryList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : subcategoryList

  const renderIcon = (img, color = '#da1884') => {
    if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:') || img.startsWith('file:'))) {
      return <Image source={{ uri: img }} style={styles.brandImg} resizeMode="cover" />
    }
    if (img && img.length <= 4 && !img.includes('-')) {
      return <Text style={styles.emojiIcon}>{img}</Text>
    }
    return <Icon name={img || 'pricetag-outline'} size={26} color={color} />
  }

  const renderSubcategoryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.subCard}
      activeOpacity={0.8}
      onPress={() => navigate('Products', { selectedCategory: category, selectedBrand: item.name })}
    >
      <View style={[styles.iconWrap, { backgroundColor: (category?.color || '#da1884') + '15' }]}>
        {renderIcon(item.image, category?.color || '#da1884')}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{item.productCount} Items</Text>
        </View>
        <Text style={styles.subName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.subDesc} numberOfLines={2}>{item.description}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.shopNowText}>View Products</Text>
        <Icon name="arrow-forward-outline" size={14} color="#da1884" />
      </View>
    </TouchableOpacity>
  )

  const ListHeader = () => (
    <View style={styles.headerSection}>
      {/* Category Info Banner */}
      <LinearGradient
        colors={[category?.color || '#da1884', '#f06292']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerCard}
      >
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>CATEGORY BRANDS</Text>
        </View>
        <Text style={styles.bannerTitle}>{category?.name || 'Category'}</Text>
        <Text style={styles.bannerSub}>
          Select a brand or subcategory below to explore available products
        </Text>
        
        {/* All Products Quick Button */}
        <TouchableOpacity
          style={styles.allProductsBtn}
          activeOpacity={0.85}
          onPress={() => navigate('Products', { selectedCategory: category })}
        >
          <Icon name="grid-outline" size={16} color="#da1884" />
          <Text style={styles.allProductsBtnText}>Browse All {category?.name} Products ({categoryProducts.length})</Text>
        </TouchableOpacity>

        <View style={styles.decCircle} />
      </LinearGradient>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${category?.name || ''} brands...`}
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Brands & Subcategories</Text>
        <Text style={styles.sectionCount}>{filteredSubcategories.length} found</Text>
      </View>
    </View>
  )

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="pricetags-outline" size={48} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Brands Found</Text>
      <Text style={styles.emptySub}>
        {searchQuery
          ? `No brands matching "${searchQuery}" under ${category?.name}.`
          : `No subcategories or brands added yet for ${category?.name}.`}
      </Text>
      <TouchableOpacity
        style={styles.viewAllBtn}
        onPress={() => navigate('Products', { selectedCategory: category })}
      >
        <Text style={styles.viewAllBtnText}>View All Category Products</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Icon name="arrow-back-outline" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category?.name || 'Subcategories'}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Brands Grid */}
      <FlatList
        data={filteredSubcategories}
        renderItem={renderSubcategoryCard}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  )
}

export default Subcategories

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
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
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 16,
  },
  bannerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    marginBottom: 16,
  },
  allProductsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  allProductsBtnText: {
    color: '#da1884',
    fontSize: 13,
    fontWeight: '700',
  },
  decCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -20,
    right: -20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  subCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  brandImg: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  emojiIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
    marginBottom: 12,
  },
  countBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#da1884',
  },
  subName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subDesc: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  shopNowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#da1884',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
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
    marginBottom: 20,
  },
  viewAllBtn: {
    backgroundColor: '#da1884',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  viewAllBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
})
