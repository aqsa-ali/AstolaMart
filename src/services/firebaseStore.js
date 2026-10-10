/**
 * Firebase Firestore Service Module
 * 
 * Provides a simple, scalable interface for Cloud Firestore database operations.
 * Designed to seamlessly connect with Firebase Firestore while providing 
 * zero-friction fallback to Redux/local data.
 * 
 * Firestore collections schema:
 *  - categories/{categoryId}
 *  - subcategories/{subcategoryId} (with categoryId field)
 *  - products/{productId} (with categoryId and subcategoryId fields)
 *  - orders/{orderId}
 *  - users/{userId}
 */

import { mockCategories, mockSubcategories, mockProducts, mockOrders } from '../data'

// Flag to switch between Firestore and local/Redux fallback mode
let isFirebaseConnected = false

try {
  // Check if firebase firestore SDK is installed and configured
  const firestoreModule = require('@react-native-firebase/firestore')
  if (firestoreModule && firestoreModule.default) {
    // Firestore is available
    isFirebaseConnected = true
  }
} catch (e) {
  // Firebase SDK not linked yet — operating in scalable fallback mode
  isFirebaseConnected = false
}

/**
 * Fetch all active categories from Cloud Firestore or fallback data
 */
export const getCategoriesFromStore = async () => {
  if (isFirebaseConnected) {
    try {
      const firestore = require('@react-native-firebase/firestore').default
      const snapshot = await firestore()
        .collection('categories')
        .where('isActive', '==', true)
        .orderBy('sortOrder', 'asc')
        .get()
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.warn('Firestore fetch categories failed, using fallback:', err.message)
    }
  }
  return mockCategories
}

/**
 * Fetch subcategories for a specific category from Cloud Firestore
 * @param {string} categoryId 
 */
export const getSubcategoriesFromStore = async (categoryId) => {
  if (isFirebaseConnected && categoryId) {
    try {
      const firestore = require('@react-native-firebase/firestore').default
      const snapshot = await firestore()
        .collection('subcategories')
        .where('categoryId', '==', categoryId)
        .where('isActive', '==', true)
        .get()
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.warn('Firestore fetch subcategories failed, using fallback:', err.message)
    }
  }
  return mockSubcategories.filter(sub => !categoryId || sub.categoryId === categoryId)
}

/**
 * Fetch products with scalable compound filtering (Category ID & Subcategory ID)
 * @param {string} categoryId 
 * @param {string} subcategoryId 
 */
export const getProductsFromStore = async (categoryId = null, subcategoryId = null) => {
  if (isFirebaseConnected) {
    try {
      const firestore = require('@react-native-firebase/firestore').default
      let query = firestore().collection('products').where('isActive', '==', true)

      if (categoryId) {
        query = query.where('categoryId', '==', categoryId)
      }
      if (subcategoryId) {
        query = query.where('subcategoryId', '==', subcategoryId)
      }

      const snapshot = await query.get()
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.warn('Firestore fetch products failed, using fallback:', err.message)
    }
  }

  return mockProducts.filter(p => {
    if (categoryId && p.categoryId !== categoryId) return false
    if (subcategoryId && p.subcategoryId !== subcategoryId) return false
    return true
  })
}

/**
 * Add a new category document to Firestore
 * @param {object} categoryData 
 */
export const addCategoryToStore = async (categoryData) => {
  if (isFirebaseConnected) {
    try {
      const firestore = require('@react-native-firebase/firestore').default
      const docRef = await firestore().collection('categories').add(categoryData)
      return { id: docRef.id, ...categoryData }
    } catch (err) {
      console.warn('Firestore add category error:', err.message)
    }
  }
  return categoryData
}

/**
 * Add a new subcategory document to Firestore
 * @param {object} subcategoryData 
 */
export const addSubcategoryToStore = async (subcategoryData) => {
  if (isFirebaseConnected) {
    try {
      const firestore = require('@react-native-firebase/firestore').default
      const docRef = await firestore().collection('subcategories').add(subcategoryData)
      return { id: docRef.id, ...subcategoryData }
    } catch (err) {
      console.warn('Firestore add subcategory error:', err.message)
    }
  }
  return subcategoryData
}

/**
 * Add a new product document to Firestore
 * @param {object} productData 
 */
export const addProductToStore = async (productData) => {
  if (isFirebaseConnected) {
    try {
      const firestore = require('@react-native-firebase/firestore').default
      const docRef = await firestore().collection('products').add(productData)
      return { id: docRef.id, ...productData }
    } catch (err) {
      console.warn('Firestore add product error:', err.message)
    }
  }
  return productData
}
