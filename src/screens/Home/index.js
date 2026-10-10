import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Image,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import { navigate } from '../../services/navigationServices'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 52) / 2

const Home = ({ navigation }) => {
  const { categories, cart = [] } = useSelector(state => state.shopState)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const renderCategoryIcon = (img, color) => {
    if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:') || img.startsWith('file:') || img.startsWith('content:'))) {
      return <Image source={{ uri: img }} style={styles.catImg} resizeMode="cover" />;
    }
    return <Icon name={img || 'folder-outline'} size={28} color={color} />;
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      activeOpacity={0.75}
      onPress={() => navigate('Subcategories', { selectedCategory: item })}
    >
      {/* Soft colour-tinted background */}
      <View style={[styles.cardBg, { backgroundColor: item.color + '12' }]} />

      {/* Icon bubble */}
      <View style={[styles.iconBubble, { backgroundColor: item.color + '22' }]}>
        {renderCategoryIcon(item.image, item.color)}
      </View>

      <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.categoryDesc} numberOfLines={2}>{item.description}</Text>

      {/* Bottom accent line */}
      <View style={[styles.accentLine, { backgroundColor: item.color }]} />
    </TouchableOpacity>
  )

  const ListHeader = () => (
    <>
      {/* Hero Banner */}
      <LinearGradient
        colors={['#da1884', '#f06292', '#ff80ab']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>✨ NEW ARRIVALS</Text>
          </View>
          <Text style={styles.heroTitle}>Beauty Collection</Text>
          <Text style={styles.heroSub}>Discover the latest must-haves{'\n'}for your beauty routine</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => navigate('Products')}
            activeOpacity={0.85}
          >
            <Text style={styles.heroBtnText}>Shop Now</Text>
            <Icon name="arrow-forward-outline" size={16} color="#da1884" />
          </TouchableOpacity>
        </View>
        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
        <Text style={styles.heroEmoji}>💄</Text>
      </LinearGradient>

      {/* Admin shortcut */}
      <TouchableOpacity
        style={styles.adminCard}
        onPress={() => navigate('AdminDashboard')}
        activeOpacity={0.8}
      >
        <View style={styles.adminLeft}>
          <View style={styles.adminIconWrap}>
            <Icon name="shield-checkmark-outline" size={22} color="#da1884" />
          </View>
          <View>
            <Text style={styles.adminTitle}>Admin Panel</Text>
            <Text style={styles.adminSub}>Manage products, orders & more</Text>
          </View>
        </View>
        <Icon name="chevron-forward-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Section heading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <Text style={styles.sectionCount}>{categories.length} available</Text>
      </View>
    </>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.headerTitle}>AstolaMart</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigate('Cart')}
          >
            <Icon name="cart-outline" size={22} color="#111827" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader />}
      />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  greeting: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#da1884',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  /* ── Hero Banner ── */
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
    minHeight: 170,
  },
  heroContent: {
    flex: 1,
    zIndex: 2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 19,
    marginBottom: 16,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  heroBtnText: {
    color: '#da1884',
    fontSize: 13,
    fontWeight: '700',
  },
  decCircle1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -30,
    right: -30,
  },
  decCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.12)',
    bottom: -20,
    right: 60,
  },
  heroEmoji: {
    position: 'absolute',
    fontSize: 64,
    right: 20,
    bottom: 16,
    opacity: 0.9,
  },

  /* ── Admin shortcut ── */
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  adminLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  adminSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },

  /* ── Section Header ── */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCount: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  /* ── Grid ── */
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  /* ── Category Card ── */
  categoryCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardBg: {
    ...StyleSheet.absoluteFillObject,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  catImg: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 15,
    marginBottom: 10,
  },
  accentLine: {
    height: 3,
    borderRadius: 2,
    width: 28,
  },
})