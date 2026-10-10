import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  Image,
  Switch,
  Modal,
  FlatList,
  Alert,
  Keyboard,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import { navigate } from '../../services/navigationServices'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import { addProductAction } from '../../store/Shop/actions'

const AddProduct = ({ navigation }) => {
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [productImages, setProductImages] = useState([])

  const dispatch = useDispatch()
  // Live categories, subcategories & products from Redux
  const { categories: reduxCategories = [], subcategories = [], products = [] } = useSelector(state => state.shopState)
  
  const categories = reduxCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.image,
    color: cat.color,
    subcategories: cat.subcategories || cat.brands || [],
  }))

  // Available brands for the currently selected category
  const availableBrandsForCategory = React.useMemo(() => {
    if (!selectedCategory) return []
    
    // 1. From subcategories store matching categoryId
    const subsFromStore = subcategories
      .filter(s => s.categoryId === selectedCategory.id)
      .map(s => s.name)

    // 2. From category object if embedded
    const catObj = reduxCategories.find(c => c.id === selectedCategory.id)
    const subsFromCat = (catObj?.subcategories || catObj?.brands || []).map(s => typeof s === 'string' ? s : s.name)

    // 3. From products store matching categoryId
    const prodBrands = products
      .filter(p => p.categoryId === selectedCategory.id || p.categoryName?.toLowerCase() === selectedCategory.name?.toLowerCase())
      .map(p => p.brand)
      .filter(Boolean)

    return Array.from(new Set([...subsFromStore, ...subsFromCat, ...prodBrands]))
  }, [selectedCategory, subcategories, reduxCategories, products])

  const openBrandSelector = () => {
    Keyboard.dismiss()
    if (!selectedCategory) {
      Alert.alert('Category Required', 'Please select a product category first before choosing a brand.')
      return
    }
    setShowBrandModal(true)
  }

  const handleAddProduct = () => {
    Keyboard.dismiss()
    if (!productName.trim()) {
      Alert.alert('Validation Error', 'Product Name is required.')
      return
    }
    if (!selectedCategory) {
      Alert.alert('Validation Error', 'Please select a category.')
      return
    }
    if (!brand.trim()) {
      Alert.alert('Validation Error', 'Please select a brand from the brand list.')
      return
    }
    if (!price || isNaN(parseFloat(price))) {
      Alert.alert('Validation Error', 'Please enter a valid price.')
      return
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      description: description.trim(),
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      price: parseFloat(price),
      discountPrice: null,
      images: productImages.length > 0
        ? productImages.map(img => img.uri)
        : ['🛍️'],
      stock: 99,
      sku: `SKU-${Date.now()}`,
      brand: brand.trim() || 'Unknown',
      size: '',
      isActive: isAvailable,
      isFeatured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch(addProductAction(newProduct))

    Alert.alert('Success', 'Product published successfully!', [
      { text: 'View Products', onPress: () => navigate('Products') },
      { text: 'Add Another', onPress: () => {
        setProductName('')
        setPrice('')
        setDescription('')
        setCategory('')
        setBrand('')
        setSelectedCategory(null)
        setProductImages([])
        setIsAvailable(true)
        setIsFeatured(false)
      }},
    ])
  }

  const openImagePicker = () => {
    Keyboard.dismiss()
    Alert.alert(
      'Upload Images',
      'Choose a source for your product images',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    )
  }

  const openCamera = () => {
    const options = { mediaType: 'photo', quality: 0.8 }
    launchCamera(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        handleAddImages(response.assets)
      }
    })
  }

  const openGallery = () => {
    const options = { mediaType: 'photo', quality: 0.8, selectionLimit: 5 }
    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        handleAddImages(response.assets)
      }
    })
  }

  const handleAddImages = (assets) => {
    const newImages = assets.map((asset) => ({
      uri: asset.uri,
      type: asset.type,
      name: asset.fileName || `product_image_${Date.now()}.jpg`,
    }))
    if (productImages.length + newImages.length > 6) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 6 images.')
      return
    }
    setProductImages([...productImages, ...newImages])
  }

  const removeImage = (index) => {
    const updatedImages = [...productImages]
    updatedImages.splice(index, 1)
    setProductImages(updatedImages)
  }

  const renderCategoryIcon = (img, isSelected) => {
    if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:') || img.startsWith('file:') || img.startsWith('content:'))) {
      return <Image source={{ uri: img }} style={styles.catOptionImg} resizeMode="cover" />;
    }
    return <Icon name={img || 'folder-outline'} size={22} color={isSelected ? '#FFFFFF' : '#6B7280'} />;
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategory?.id === item.id
    return (
      <TouchableOpacity
        style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
        activeOpacity={0.7}
        onPress={() => {
          setSelectedCategory(item)
          setCategory(item.name)
          setBrand('') // Reset brand when category changes
          setShowCategoryModal(false)
        }}
      >
        <View style={styles.catOptionLeft}>
          <View style={[styles.catIconWrap, isSelected && styles.catIconWrapSelected]}>
            {renderCategoryIcon(item.icon, isSelected)}
          </View>
          <Text style={[styles.catOptionText, isSelected && styles.catOptionTextSelected]}>
            {item.name}
          </Text>
        </View>
        {isSelected && (
          <Icon name="checkmark-circle" size={24} color="#da1884" />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { Keyboard.dismiss(); navigation?.goBack(); }}>
          <Icon name="arrow-back-outline" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Image Uploader */}
          <Text style={styles.sectionTitle}>Product Images</Text>
          <Text style={styles.sectionSub}>Add up to 6 images for the product gallery</Text>
          <View style={styles.imageSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScroll} keyboardShouldPersistTaps="handled">
              <TouchableOpacity style={styles.uploadBtn} onPress={openImagePicker} activeOpacity={0.7}>
                <LinearGradient
                  colors={['#FFF0F6', '#FAFAFA']}
                  style={styles.uploadBtnGradient}
                >
                  <Icon name="cloud-upload-outline" size={28} color="#da1884" />
                  <Text style={styles.uploadBtnText}>Upload</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {productImages.map((img, index) => (
                <View key={index} style={styles.imagePreviewWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImgBtn} onPress={() => removeImage(index)}>
                    <Icon name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Product Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Product Name *</Text>
              <View style={styles.inputWrapper}>
                <Icon name="cube-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Velvet Matte Lipstick"
                  placeholderTextColor="#9CA3AF"
                  value={productName}
                  onChangeText={setProductName}
                />
              </View>
            </View>

            {/* Step 1: Category Select */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category *</Text>
              <TouchableOpacity
                style={styles.categorySelectBtn}
                onPress={() => { Keyboard.dismiss(); setShowCategoryModal(true); }}
              >
                <Icon name="grid-outline" size={20} color={category ? '#da1884' : '#9CA3AF'} style={styles.inputIcon} />
                <Text style={[styles.categorySelectText, !category && { color: '#9CA3AF' }]}>
                  {category || 'Select Category'}
                </Text>
                <Icon name="chevron-down-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Step 2: Brand Select (displays existing brands for selected category) */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Brand / Subcategory *</Text>
              <TouchableOpacity
                style={[
                  styles.categorySelectBtn,
                  !selectedCategory && { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }
                ]}
                onPress={openBrandSelector}
              >
                <Icon
                  name="pricetag-outline"
                  size={20}
                  color={brand ? '#da1884' : '#9CA3AF'}
                  style={styles.inputIcon}
                />
                <Text style={[styles.categorySelectText, !brand && { color: '#9CA3AF' }]}>
                  {brand
                    ? brand
                    : selectedCategory
                    ? `Select Brand for ${selectedCategory.name}`
                    : 'Select Category First'}
                </Text>
                <Icon name="chevron-down-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {selectedCategory && availableBrandsForCategory.length > 0 && (
                <Text style={styles.brandCountHelper}>
                  {availableBrandsForCategory.length} brand{availableBrandsForCategory.length > 1 ? 's' : ''} available for {selectedCategory.name}
                </Text>
              )}
            </View>

            {/* Price */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price (Rs.) *</Text>
              <View style={styles.inputWrapper}>
                <Icon name="cash-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter detailed product description..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>
          </View>

          {/* Toggles */}
          <View style={styles.togglesSection}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <Icon name="checkmark-circle-outline" size={22} color="#10B981" />
                <View>
                  <Text style={styles.toggleLabel}>Available in Stock</Text>
                  <Text style={styles.toggleSub}>Product is ready for purchase</Text>
                </View>
              </View>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: '#E5E7EB', true: '#da1884' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.toggleDivider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <Icon name="star-outline" size={22} color="#F59E0B" />
                <View>
                  <Text style={styles.toggleLabel}>Featured Product</Text>
                  <Text style={styles.toggleSub}>Show on the home screen banner</Text>
                </View>
              </View>
              <Switch
                value={isFeatured}
                onValueChange={setIsFeatured}
                trackColor={{ false: '#E5E7EB', true: '#da1884' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleAddProduct} activeOpacity={0.85}>
          <LinearGradient
            colors={['#da1884', '#f06292']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitBtnGradient}
          >
            <Text style={styles.submitBtnText}>Publish Product</Text>
            <Icon name="cloud-upload" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowCategoryModal(false)}
              >
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.categoryList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </Modal>

      {/* Brand Modal */}
      <Modal visible={showBrandModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Brand</Text>
                <Text style={styles.modalSubtitle}>Brands for {selectedCategory?.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowBrandModal(false)}
              >
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.brandModalList} keyboardShouldPersistTaps="handled">
              {availableBrandsForCategory.length > 0 ? (
                <>
                  <Text style={styles.brandSectionHeader}>Available Brands for {selectedCategory?.name}</Text>
                  {availableBrandsForCategory.map((bName, index) => {
                    const isSelected = brand?.toLowerCase() === bName.toLowerCase()
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.brandOptionItem, isSelected && styles.brandOptionSelected]}
                        onPress={() => {
                          setBrand(bName)
                          setShowBrandModal(false)
                        }}
                      >
                        <View style={styles.brandLeft}>
                          <View style={[styles.brandIconCircle, isSelected && styles.brandIconCircleSelected]}>
                            <Icon name="pricetag" size={16} color={isSelected ? '#FFFFFF' : '#da1884'} />
                          </View>
                          <Text style={[styles.brandOptionText, isSelected && styles.brandOptionTextSelected]}>
                            {bName}
                          </Text>
                        </View>
                        {isSelected && <Icon name="checkmark-circle" size={22} color="#da1884" />}
                      </TouchableOpacity>
                    )
                  })}
                </>
              ) : (
                <View style={styles.noBrandsBanner}>
                  <Icon name="alert-circle-outline" size={32} color="#F59E0B" />
                  <Text style={styles.noBrandsTitle}>No Brands Found</Text>
                  <Text style={styles.noBrandsText}>
                    No subcategories/brands have been created for "{selectedCategory?.name}" yet. Brands can only be added when adding or editing a category.
                  </Text>
                  <TouchableOpacity
                    style={styles.addCategoryBrandBtn}
                    onPress={() => {
                      setShowBrandModal(false)
                      navigate('AddCategory')
                    }}
                  >
                    <Icon name="add-circle-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.addCategoryBrandBtnText}>Add Brands in Category</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}

export default AddProduct

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 40,
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
  },

  /* ── Sections ── */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionSub: {
    fontSize: 13,
    color: '#6B7280',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },

  /* ── Image Upload ── */
  imageSection: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  imageScroll: {
    paddingRight: 20,
    alignItems: 'center',
    gap: 12,
  },
  uploadBtn: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FCE4EC',
    borderStyle: 'dashed',
  },
  uploadBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#da1884',
  },
  imagePreviewWrapper: {
    width: 90,
    height: 90,
    borderRadius: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  removeImgBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  /* ── Form ── */
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flexHalf: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
  },
  textAreaWrapper: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    flex: 1,
    width: '100%',
    fontSize: 15,
    color: '#111827',
    paddingTop: 0,
    paddingBottom: 0,
  },
  categorySelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  categorySelectText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },

  /* ── Toggles ── */
  togglesSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  toggleDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 54,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  toggleSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  /* ── Bottom Action ── */
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeModalBtn: {
    padding: 4,
  },
  categoryList: {
    padding: 16,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  categoryOptionSelected: {
    backgroundColor: '#FFF0F6',
    borderColor: '#da1884',
  },
  catOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  catIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  catOptionImg: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  catIconWrapSelected: {
    backgroundColor: '#da1884',
    borderColor: '#da1884',
  },
  catOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  catOptionTextSelected: {
    color: '#da1884',
  },
  brandCountHelper: {
    fontSize: 12,
    color: '#da1884',
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  brandModalList: {
    padding: 20,
    paddingBottom: 40,
  },
  brandSectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  brandOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  brandOptionSelected: {
    backgroundColor: '#FFF0F6',
    borderColor: '#da1884',
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF0F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconCircleSelected: {
    backgroundColor: '#da1884',
  },
  brandOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  brandOptionTextSelected: {
    color: '#da1884',
    fontWeight: '700',
  },
  noBrandsBanner: {
    alignItems: 'center',
    backgroundColor: '#FFFDF5',
    borderRadius: 18,
    padding: 24,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noBrandsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B45309',
    marginTop: 6,
  },
  noBrandsText: {
    fontSize: 13,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 19,
    marginVertical: 8,
  },
  addCategoryBrandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#da1884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  addCategoryBrandBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
})