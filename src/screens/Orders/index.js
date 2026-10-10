import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  TextInput,
  Modal,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

const STATUS_CONFIG = {
  Delivered:  { color: '#10B981', bg: '#ECFDF5', icon: 'checkmark-circle' },
  Shipped:    { color: '#3B82F6', bg: '#EFF6FF', icon: 'airplane' },
  Processing: { color: '#F59E0B', bg: '#FFFBEB', icon: 'time' },
  Pending:    { color: '#8B5CF6', bg: '#F5F3FF', icon: 'hourglass' },
  Cancelled:  { color: '#EF4444', bg: '#FEF2F2', icon: 'close-circle' },
}

const Orders = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { orders = [] } = useSelector(state => state.shopState)

  const getStatus = (status) =>
    STATUS_CONFIG[status] || { color: '#6B7280', bg: '#F3F4F6', icon: 'help-circle' }

  const statusList = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'All' || order.orderStatus === selectedStatus
    if (!searchQuery.trim()) return matchesStatus

    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.orderStatus.toLowerCase().includes(q)

    return matchesStatus && matchesQuery
  })

  const renderOrderItem = ({ item }) => {
    const cfg = getStatus(item.orderStatus)
    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    return (
      <TouchableOpacity
        style={styles.orderCard}
        activeOpacity={0.8}
        onPress={() => { setSelectedOrder(item); setShowDetailModal(true); }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.orderIdWrap}>
            <Text style={styles.orderId}>#{item.id.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusTag, { backgroundColor: cfg.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{item.orderStatus}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.itemsCount}>{item.items.length} {item.items.length === 1 ? 'item' : 'items'} • {formattedDate}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
          <Text style={styles.orderTotal}>Rs. {item.total.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Icon name="arrow-back-outline" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Minimal Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {statusList.map(st => {
            const active = selectedStatus === st
            const count = st === 'All' ? orders.length : orders.filter(o => o.orderStatus === st).length
            return (
              <TouchableOpacity
                key={st}
                style={[styles.tabChip, active && styles.tabChipActive]}
                onPress={() => setSelectedStatus(st)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{st}</Text>
                {count > 0 && (
                  <View style={[styles.countBadge, active && styles.countBadgeActive]}>
                    <Text style={[styles.countBadgeText, active && styles.countBadgeTextActive]}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Icon name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID or customer..."
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

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="receipt-outline" size={44} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Orders</Text>
            <Text style={styles.emptySub}>No orders matching the selected filter</Text>
          </View>
        }
      />

      {/* Order Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Order Details</Text>
                {selectedOrder && (
                  <Text style={styles.modalSubId}>#{selectedOrder.id.toUpperCase()}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowDetailModal(false)}
              >
                <Icon name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                {/* Status Row */}
                {(() => {
                  const cfg = getStatus(selectedOrder.orderStatus)
                  return (
                    <View style={[styles.modalStatusRow, { backgroundColor: cfg.bg }]}>
                      <Icon name={cfg.icon} size={20} color={cfg.color} />
                      <Text style={[styles.modalStatusText, { color: cfg.color }]}>
                        {selectedOrder.orderStatus}
                      </Text>
                      <Text style={styles.modalPaymentBadge}>
                        {selectedOrder.paymentStatus}
                      </Text>
                    </View>
                  )
                })()}

                {/* Customer Details */}
                <View style={styles.infoGroup}>
                  <Text style={styles.groupHeader}>CUSTOMER</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoVal}>{selectedOrder.customerName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoVal}>{selectedOrder.customerPhone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date</Text>
                    <Text style={styles.infoVal}>
                      {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                  </View>
                </View>

                {/* Items */}
                <View style={styles.infoGroup}>
                  <Text style={styles.groupHeader}>ITEMS</Text>
                  {selectedOrder.items.map((prod, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        <Text style={styles.itemQty}>{prod.quantity}×</Text> {prod.name}
                      </Text>
                      <Text style={styles.itemPrice}>Rs. {prod.price.toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                {/* Total Summary */}
                <View style={styles.summaryBox}>
                  <View style={styles.sumRow}>
                    <Text style={styles.sumLabel}>Subtotal</Text>
                    <Text style={styles.sumVal}>Rs. {selectedOrder.subtotal.toFixed(2)}</Text>
                  </View>
                  {selectedOrder.deliveryCharges > 0 && (
                    <View style={styles.sumRow}>
                      <Text style={styles.sumLabel}>Delivery</Text>
                      <Text style={styles.sumVal}>Rs. {selectedOrder.deliveryCharges.toFixed(2)}</Text>
                    </View>
                  )}
                  <View style={[styles.sumRow, styles.sumTotalRow]}>
                    <Text style={styles.totalTitle}>Total</Text>
                    <Text style={styles.totalPrice}>Rs. {selectedOrder.total.toFixed(2)}</Text>
                  </View>
                </View>

                {/* Address */}
                {!!selectedOrder.shippingAddress && (
                  <View style={styles.infoGroup}>
                    <Text style={styles.groupHeader}>SHIPPING ADDRESS</Text>
                    <Text style={styles.addressText}>{selectedOrder.shippingAddress}</Text>
                  </View>
                )}

                <View style={{ height: 30 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Orders

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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

  /* Tabs */
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 10,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 4,
    gap: 6,
  },
  tabChipActive: {
    backgroundColor: '#da1884',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  countBadgeTextActive: {
    color: '#FFFFFF',
  },

  /* Search */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  /* List */
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Order Card */
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderIdWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.3,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  cardContent: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  itemsCount: {
    fontSize: 12,
    color: '#6B7280',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#da1884',
  },

  /* Empty */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 10,
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
  modalSubId: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalPaymentBadge: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  infoGroup: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    marginRight: 10,
  },
  itemQty: {
    fontWeight: '700',
    color: '#da1884',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  summaryBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sumLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  sumVal: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  sumTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    marginTop: 6,
    marginBottom: 0,
  },
  totalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#da1884',
  },

  addressText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
})