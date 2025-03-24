import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../context/ThemeContext';

// Mock data for rewards
const mockRewards = [
  { id: '1', name: 'Fitness Gear Discount', points: 500, claimed: false, icon: 'shirt' },
  { id: '2', name: 'Premium Membership', points: 1000, claimed: false, icon: 'star' },
  { id: '3', name: 'Nutrition Consultation', points: 750, claimed: false, icon: 'nutrition' },
  { id: '4', name: 'Personal Training Session', points: 1200, claimed: false, icon: 'fitness' },
  { id: '5', name: 'Recovery Day Badge', points: 100, claimed: true, icon: 'medal' },
];

// Date range options
const dateRangeOptions = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'Last 12 Months', days: 365 }
];

// Activity point values
const activityPoints = [
  { name: 'Morning Run', points: 10, icon: 'run' },
  { name: 'Gym Workout', points: 15, icon: 'barbell' },
  { name: 'Yoga Session', points: 8, icon: 'body' },
  { name: 'Swimming', points: 12, icon: 'water' },
  { name: 'Cycling', points: 10, icon: 'bicycle' },
  { name: 'Walking', points: 5, icon: 'walk' },
];

const RewardsScreen = () => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [selectedRange, setSelectedRange] = useState(dateRangeOptions[0]);
  const [rewards, setRewards] = useState(mockRewards);
  const [userPoints, setUserPoints] = useState(350); // Mock user points
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Calculate points based on selected date range
  useEffect(() => {
    // In a real app, this would calculate points based on completed activities within date range
    // For this mock-up, we'll just simulate different point values for different ranges
    const pointsByRange = {
      'Last 7 Days': 350,
      'Last 30 Days': 720,
      'Last 90 Days': 1450,
      'Last 12 Months': 3200
    };
    
    setUserPoints(pointsByRange[selectedRange.label]);
  }, [selectedRange]);
  
  // Claim a reward
  const claimReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    
    if (reward && !reward.claimed && userPoints >= reward.points) {
      // Update reward status
      setRewards(rewards.map(r => 
        r.id === rewardId ? { ...r, claimed: true } : r
      ));
      
      // Deduct points
      setUserPoints(userPoints - reward.points);
    }
  };
  
  // Render reward item
  const renderRewardItem = ({ item }) => (
    <View style={[styles.rewardItem, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={[styles.rewardIconContainer, { backgroundColor: isDarkMode ? '#444' : '#f1f3f5' }]}>
        <Ionicons name={item.icon} size={24} color={theme.primary} />
      </View>
      <View style={styles.rewardInfo}>
        <Text style={[styles.rewardName, { color: isDarkMode ? '#eee' : '#333' }]}>{item.name}</Text>
        <Text style={[styles.rewardPoints, { color: isDarkMode ? '#aaa' : '#666' }]}>{item.points} points</Text>
      </View>
      {item.claimed ? (
        <View style={[styles.claimedBadge, { backgroundColor: isDarkMode ? '#444' : '#f1f3f5' }]}>
          <Text style={[styles.claimedText, { color: isDarkMode ? '#aaa' : '#666' }]}>Claimed</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={[
            styles.claimButton, 
            { backgroundColor: isDarkMode ? theme.primary : '#5E60CE' },
            userPoints < item.points && [styles.disabledButton, { backgroundColor: isDarkMode ? '#444' : '#ccc' }]
          ]}
          onPress={() => claimReward(item.id)}
          disabled={userPoints < item.points}
        >
          <Text style={styles.claimButtonText}>Claim</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  // Render activity point item
  const renderActivityPointItem = ({ item }) => (
    <View style={[styles.activityPointItem, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={[styles.activityIconContainer, { backgroundColor: isDarkMode ? '#444' : '#f1f3f5' }]}>
        <Ionicons name={item.icon} size={20} color={theme.primary} />
      </View>
      <Text style={[styles.activityPointName, { color: isDarkMode ? '#eee' : '#333' }]}>{item.name}</Text>
      <Text style={[styles.activityPointValue, { color: isDarkMode ? '#aaa' : '#666' }]}>+{item.points} pts</Text>
    </View>
  );

  // Render date range picker modal
  const renderDateRangePicker = () => {
    return (
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContainer}>
            <Text style={[styles.datePickerTitle, { color: isDarkMode ? '#eee' : '#333' }]}>Select Date Range</Text>
            {dateRangeOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateRangeOption,
                  { backgroundColor: isDarkMode ? '#333' : '#f1f3f5' },
                  selectedRange.label === option.label && styles.selectedDateRange
                ]}
                onPress={() => {
                  setSelectedRange(option);
                  setShowDatePicker(false);
                }}
              >
                <Text style={[
                  styles.dateRangeText,
                  { color: isDarkMode ? '#eee' : '#333' },
                  selectedRange.label === option.label && styles.selectedDateRangeText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: isDarkMode ? '#444' : '#f1f3f5' }]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={[styles.closeButtonText, { color: isDarkMode ? '#eee' : '#666' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8f9fa' }]}>
      {renderDateRangePicker()}
      
      <LinearGradient
        colors={['#5E60CE', '#4CAF50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.pointsSummaryContainer}
      >
        <Text style={styles.pointsTitle}>Your Points</Text>
        <Text style={styles.pointsValue}>{userPoints}</Text>
        <Text style={styles.pointsSubtitle}>Keep going to earn more rewards!</Text>
        
        <TouchableOpacity
          style={styles.dateRangeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={16} color="#fff" />
          <Text style={styles.dateRangeButtonText}>{selectedRange.label}</Text>
          <Ionicons name="chevron-down" size={14} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      
      <View style={[styles.section, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#eee' : '#333' }]}>Available Rewards</Text>
        <FlatList
          data={rewards}
          renderItem={renderRewardItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} // Disable scrolling as we're inside a ScrollView
        />
      </View>
      
      <View style={[styles.section, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#eee' : '#333' }]}>Activity Point Values</Text>
        <FlatList
          data={activityPoints}
          renderItem={renderActivityPointItem}
          keyExtractor={item => item.name}
          scrollEnabled={false} // Disable scrolling as we're inside a ScrollView
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  pointsSummaryContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pointsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  dateRangeButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateRangeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedDateRange: {
    backgroundColor: '#5E60CE',
  },
  dateRangeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDateRangeText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#f1f3f5',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#5E60CE',
    paddingLeft: 10,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  rewardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  rewardPoints: {
    fontSize: 14,
    color: '#666',
  },
  claimButton: {
    backgroundColor: '#5E60CE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  claimButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  claimedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  claimedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  activityPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    borderRadius: 8,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityPointName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  activityPointValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5E60CE',
  },
});

export default RewardsScreen;
