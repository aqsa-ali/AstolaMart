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
  StatusBar,
  Switch,
  Alert,
  Keyboard,
  Image,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { addCategoryAction, addSubcategoryAction } from '../../store/Shop/actions'

const AddCategory = ({ navigation }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [subcategoriesInput, setSubcategoriesInput] = useState('')
  const [categoryImage, setCategoryImage] = useState(null)
  const [isActive, setIsActive] = useState(true)

  const dispatch = useDispatch()

  const openImagePicker = () => {
    Keyboard.dismiss()
    Alert.alert(
      'Category Image',
      'Choose a source for the category image',
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
        setCategoryImage(response.assets[0].uri)
      }
    })
  }

  const openGallery = () => {
    const options = { mediaType: 'photo', quality: 0.8 }
    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        setCategoryImage(response.assets[0].uri)
      }
    })
  }

  const handleAddCategory = () => {
    Keyboard.dismiss()

    const trimmedName = name.trim()
    if (!trimmedName) {
      Alert.alert('Validation Error', 'Category name is required.')
      return
    }

    const categoryId = `cat-${Date.now()}`

    const subcats = subcategoriesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map((brandName, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        categoryId,
        name: brandName,
        description: `Official ${brandName} collection`,
        image: 'pricetag-outline',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

    const newCategory = {
      id: categoryId,
      name: trimmedName,
      description: description.trim(),
      image: categoryImage || 'folder-outline',
      color: '#da1884',
      subcategories: subcats,
      isActive,
      sortOrder: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch(addCategoryAction(newCategory))
    subcats.forEach(sub => dispatch(addSubcategoryAction(sub)))

    Alert.alert('Success', 'Category added successfully!', [
      { text: 'OK', onPress: () => navigation?.goBack() }
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            Keyboard.dismiss()
            navigation?.goBack()
          }}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back-outline" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Category</Text>

        <View style={styles.headerRightSpace} />
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
          {/* Section Header */}
          <Text style={styles.sectionTitle}>Category Image</Text>
          <Text style={styles.sectionSub}>Upload an image for the category tile</Text>

          {/* Image Upload Box */}
          <View style={styles.imageSection}>
            {categoryImage ? (
              <View style={styles.imagePreviewWrapper}>
                <Image source={{ uri: categoryImage }} style={styles.categoryImagePreview} resizeMode="cover" />
                <TouchableOpacity style={styles.removeImgBtn} onPress={() => setCategoryImage(null)}>
                  <Icon name="close" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBtn} onPress={openImagePicker} activeOpacity={0.7}>
                <LinearGradient colors={['#FFF0F6', '#FAFAFA']} style={styles.uploadBtnGradient}>
                  <Icon name="cloud-upload-outline" size={32} color="#da1884" />
                  <Text style={styles.uploadBtnText}>Upload Category Image</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Category Details</Text>
          <Text style={styles.sectionSub}>Provide information for the new category</Text>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Category Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="grid-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Skin Care"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Subcategories / Brands */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Subcategories / Brands (comma-separated)</Text>
              <View style={styles.inputWrapper}>
                <Icon name="pricetags-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rose Cosmetics, Luxé Beauty"
                  placeholderTextColor="#9CA3AF"
                  value={subcategoriesInput}
                  onChangeText={setSubcategoriesInput}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter category description..."
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

          {/* Active Toggle */}
          <View style={styles.togglesSection}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={styles.toggleIconContainer}>
                  <Icon name="eye-outline" size={21} color="#10B981" />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleLabel}>Is Active</Text>
                  <Text style={styles.toggleSub}>Category will be visible to users</Text>
                </View>
              </View>

              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#E5E7EB', true: '#da1884' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleAddCategory}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#da1884', '#f06292']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitBtnGradient}
          >
            <Text style={styles.submitBtnText}>Create Category</Text>
            <Icon name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default AddCategory

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
  headerRightSpace: {
    width: 36,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionSub: {
    fontSize: 13,
    color: '#6B7280',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 14,
  },

  /* ── Image Upload ── */
  imageSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  uploadBtn: {
    height: 110,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#da1884',
  },
  imagePreviewWrapper: {
    height: 120,
    borderRadius: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  categoryImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  removeImgBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  formSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
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
})
