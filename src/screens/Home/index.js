import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  // SafeAreaView,
  Platform,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { navigate } from '../../services/navigationServices'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const Home = ({ navigation }) => {
  // Beauty & Makeup categories data
  const categories = [
    // Makeup
    {
      id: '1',
      name: 'Foundation',
      icon: 'brush-outline',
      color: '#F59E0B'
    },
    {
      id: '2',
      name: 'Lipstick',
      icon: 'color-palette-outline',
      color: '#EC4899'
    },
    {
      id: '3',
      name: 'Eyeshadow',
      icon: 'eye-outline',
      color: '#8B5CF6'
    },
    {
      id: '4',
      name: 'Mascara',
      icon: 'eye-off-outline',
      color: '#1F2937'
    },
    {
      id: '5',
      name: 'Blush',
      icon: 'flower-outline',
      color: '#F472B6'
    },
    {
      id: '6',
      name: 'Concealer',
      icon: 'color-filter-outline',
      color: '#FBBF24'
    },
    {
      id: '7',
      name: 'Primer',
      icon: 'water-outline',
      color: '#60A5FA'
    },
    {
      id: '8',
      name: 'Setting Spray',
      icon: 'cloudy-outline',
      color: '#34D399'
    },
    {
      id: '9',
      name: 'Brow Products',
      icon: 'pencil-outline',
      color: '#D97706'
    },
    {
      id: '10',
      name: 'Lip Gloss',
      icon: 'sparkles-outline',
      color: '#FB7185'
    },
    // Skincare
    {
      id: '11',
      name: 'Skincare',
      icon: 'leaf-outline',
      color: '#10B981'
    },
    {
      id: '12',
      name: 'Moisturizers',
      icon: 'water-outline',
      color: '#3B82F6'
    },
    {
      id: '13',
      name: 'Serums',
      icon: 'beaker-outline',
      color: '#8B5CF6'
    },
    {
      id: '14',
      name: 'Face Wash',
      icon: 'bubbles-outline',
      color: '#06B6D4'
    },
    // Hair Care
    {
      id: '15',
      name: 'Hair Care',
      icon: 'cut-outline',
      color: '#F59E0B'
    },
    {
      id: '16',
      name: 'Shampoo',
      icon: 'water-outline',
      color: '#8B5CF6'
    },
    {
      id: '17',
      name: 'Hair Oil',
      icon: 'leaf-outline',
      color: '#10B981'
    },
    // Tools & Accessories
    {
      id: '18',
      name: 'Brushes',
      icon: 'brush-outline',
      color: '#EC4899'
    },
    {
      id: '19',
      name: 'Mirrors',
      icon: 'copy-outline',
      color: '#6B7280'
    },
    {
      id: '20',
      name: 'Makeup Remover',
      icon: 'trash-outline',
      color: '#EF4444'
    },
  ]

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      activeOpacity={0.7}
      // onPress={() => console.log('Selected:', item.name)}
      onPress={() => navigate('Products')}
    >
      <View style={[styles.iconWrapper, { backgroundColor: item.color + '20' }]}>
        <Icon name={item.icon} size={32} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome To</Text>
          <Text style={styles.headerTitle}>AstolaMart</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigate("Cart")}>
          <Icon name="cart-outline" size={24} color="#111827" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>✨ New Arrivals</Text>
            <Text style={styles.bannerSubtitle}>Discover the latest beauty collection</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  greeting: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    marginTop: 2,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#da1884',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    padding: 16,
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  banner: {
    backgroundColor: '#FFF0F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCE4EC',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#da1884',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  categoryCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
})