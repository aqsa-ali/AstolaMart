import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import { navigate } from '../../services/navigationServices'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 52) / 2

const AdminDashboard = ({ navigation }) => {
  const menuItems = [
    {
      id: '1',
      title: 'Orders',
      icon: 'receipt-outline',
      color: '#da1884',
      bgStart: '#FFF0F6',
      bgEnd: '#FCE4EC',
      screen: 'Orders',
    },
    {
      id: '2',
      title: 'Products',
      icon: 'cube-outline',
      color: '#3B82F6',
      bgStart: '#EFF6FF',
      bgEnd: '#DBEAFE',
      screen: 'Products',
    },
    {
      id: '3',
      title: 'Add Product',
      icon: 'add-circle-outline',
      color: '#10B981',
      bgStart: '#ECFDF5',
      bgEnd: '#D1FAE5',
      screen: 'AddProduct',
    },
    {
      id: '4',
      title: 'Categories',
      icon: 'grid-outline',
      color: '#8B5CF6',
      bgStart: '#F5F3FF',
      bgEnd: '#EDE9FE',
      screen: 'Categories',
    },
  ]

  const stats = [
    { label: 'Total Revenue', value: 'Rs. 12,450', trend: '+14%', up: true },
    { label: 'Active Orders', value: '45', trend: '+5%', up: true },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Icon name="arrow-back-outline" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage your Shop</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* Menu Grid */}
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => navigate(item.screen)}
            >
              <LinearGradient
                colors={[item.bgStart, item.bgEnd]}
                style={styles.menuCard}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
                  <Icon name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <View style={styles.arrowContainer}>
                  <Icon name="arrow-forward-outline" size={16} color={item.color} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AdminDashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  scrollContent: {
    paddingBottom: 40,
  },
  


  /* ── Stats Card ── */
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#da1884',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  statCol: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 15,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },

  /* ── Grid ── */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  arrowContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 6,
    borderRadius: 12,
  },
})