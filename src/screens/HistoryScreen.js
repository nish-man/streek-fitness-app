import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../context/ThemeContext';

// Mock data for activity history
const mockActivities = [
  { id: '1', name: 'Morning Run', date: '2025-03-23', completed: true, points: 10 },
  { id: '2', name: 'Gym Workout', date: '2025-03-22', completed: true, points: 15 },
  { id: '3', name: 'Yoga Session', date: '2025-03-21', completed: true, points: 8 },
  { id: '4', name: 'Morning Run', date: '2025-03-20', completed: true, points: 10 },
  { id: '5', name: 'Gym Workout', date: '2025-03-19', completed: true, points: 15 },
  { id: '6', name: 'Yoga Session', date: '2025-03-18', completed: false, points: 0 },
  { id: '7', name: 'Morning Run', date: '2025-03-17', completed: true, points: 10 },
  { id: '8', name: 'Gym Workout', date: '2025-03-16', completed: true, points: 15 },
  { id: '9', name: 'Yoga Session', date: '2025-03-15', completed: false, points: 0 },
  { id: '10', name: 'Morning Run', date: '2025-03-14', completed: true, points: 10 },
];

// Date range options
const dateRangeOptions = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'Last 12 Months', days: 365 }
];

// Activity colors for color coding
const activityColors = {
  'Morning Run': '#FF6B6B',
  'Gym Workout': '#5E60CE',
  'Yoga Session': '#4CAF50',
  'Swimming': '#00BCD4',
  'Cycling': '#FF9800',
  'Walking': '#9C27B0',
};

const HistoryScreen = () => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [selectedRange, setSelectedRange] = useState(dateRangeOptions[0]);
  const [activities, setActivities] = useState(mockActivities);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showActivityFilter, setShowActivityFilter] = useState(false);
  const [selectedActivityFilter, setSelectedActivityFilter] = useState(null);
  
  // Filter activities based on selected date range and activity type
  useEffect(() => {
    const filterActivities = () => {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - selectedRange.days);
      
      let filtered = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= today;
      });
      
      // Apply activity type filter if selected
      if (selectedActivityFilter) {
        filtered = filtered.filter(activity => activity.name === selectedActivityFilter);
      }
      
      // Sort by date (newest first)
      filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setFilteredActivities(filtered);
    };
    
    filterActivities();
  }, [selectedRange, activities, selectedActivityFilter]);
  
  // Open activity filter modal
  const openActivityFilterModal = () => {
    setShowActivityFilter(true);
  };
  
  // Get unique activity names for filter
  const getUniqueActivityTypes = () => {
    const activityNames = activities.map(activity => activity.name);
    return [...new Set(activityNames)];
  };
  
  // Clear activity filter
  const clearActivityFilter = () => {
    setSelectedActivityFilter(null);
    setShowActivityFilter(false);
  };
  
  // Calculate statistics
  const totalActivities = activities.filter(activity => activity.completed).length;
  const completionRate = Math.round((totalActivities / activities.length) * 100);
  const longestStreak = 5; // This would be calculated from actual data
  
  // Render activity item
  const renderActivityItem = ({ item }) => (
    <View style={[styles.activityItem, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={[styles.activityColorDot, { backgroundColor: activityColors[item.name] || '#999' }]} />
      <View style={styles.activityInfo}>
        <Text style={[styles.activityName, { color: isDarkMode ? '#eee' : '#333' }]}>{item.name}</Text>
        <Text style={[styles.activityDate, { color: isDarkMode ? '#aaa' : '#666' }]}>{formatDate(item.date)}</Text>
      </View>
      {item.completed ? (
        <View style={styles.completedContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.pointsText}>+{item.points} pts</Text>
        </View>
      ) : (
        <View style={styles.missedContainer}>
          <Ionicons name="close-circle" size={20} color="#FF6B6B" />
          <Text style={styles.missedText}>Missed</Text>
        </View>
      )}
    </View>
  );
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Generate weekly streak visualization with improved UI
  const renderWeeklyStreak = () => {
    // This would use actual data in a real app
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const streakData = [true, true, true, false, true, false, true]; // Mock data for completed days
    
    return (
      <View style={styles.weeklyStreakContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            {streakData[index] ? (
              <LinearGradient
                colors={['#5E60CE', '#4CAF50']}
                style={styles.dayDotGradient}
              >
                <Ionicons name="flame" size={14} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={[styles.dayDotEmpty, { backgroundColor: isDarkMode ? '#333' : '#f1f3f5' }]}>
                <Ionicons name="flame-outline" size={14} color={isDarkMode ? '#777' : '#999'} />
              </View>
            )}
            <Text style={[
              styles.dayText, 
              streakData[index] && styles.activeDayText,
              { color: isDarkMode ? (streakData[index] ? theme.primary : '#777') : (streakData[index] ? '#5E60CE' : '#999') }
            ]}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };
  
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
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
            <LinearGradient
              colors={['#5E60CE', '#4CAF50']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <Text style={styles.modalHeaderTitle}>Select Date Range</Text>
            </LinearGradient>
            
            <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
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
                  <Ionicons
                    name="calendar"
                    size={18}
                    color={selectedRange.label === option.label ? '#fff' : '#5E60CE'}
                  />
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
        </View>
      </Modal>
    );
  };
  
  // Render activity filter modal
  const renderActivityFilterModal = () => {
    const uniqueActivities = getUniqueActivityTypes();
    
    return (
      <Modal
        visible={showActivityFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActivityFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
            <LinearGradient
              colors={['#5E60CE', '#4CAF50']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <Text style={styles.modalHeaderTitle}>Filter by Activity</Text>
            </LinearGradient>
            
            <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
              {uniqueActivities.map((activity, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.activityFilterOption,
                    { backgroundColor: isDarkMode ? '#333' : '#f1f3f5' },
                    selectedActivityFilter === activity && [styles.selectedActivityFilter, { borderColor: theme.primary }]
                  ]}
                  onPress={() => {
                    setSelectedActivityFilter(activity);
                    setShowActivityFilter(false);
                  }}
                >
                  <View style={[styles.activityColorDot, { backgroundColor: activityColors[activity] || '#999' }]} />
                  <Text style={[
                    styles.activityFilterText,
                    { color: isDarkMode ? '#eee' : '#333' },
                    selectedActivityFilter === activity && styles.selectedActivityFilterText
                  ]}>
                    {activity}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.clearButton, { backgroundColor: isDarkMode ? '#444' : '#f1f3f5' }]}
                  onPress={clearActivityFilter}
                >
                  <Text style={[styles.clearButtonText, { color: isDarkMode ? '#eee' : '#666' }]}>Clear Filter</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.closeButton, { backgroundColor: isDarkMode ? '#444' : '#f1f3f5' }]}
                  onPress={() => setShowActivityFilter(false)}
                >
                  <Text style={[styles.closeButtonText, { color: isDarkMode ? '#eee' : '#666' }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8f9fa' }]}>
      {renderDateRangePicker()}
      {renderActivityFilterModal()}
      
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowDatePicker(true)}
        >
          <LinearGradient
            colors={['#5E60CE', '#6A75E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.filterButtonGradient}
          >
            <Ionicons name="calendar" size={18} color="#fff" />
            <Text style={styles.filterButtonText}>{selectedRange.label}</Text>
            <Ionicons name="chevron-down" size={14} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openActivityFilterModal}
        >
          <LinearGradient
            colors={['#4CAF50', '#81C784']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.filterButtonGradient}
          >
            <Ionicons name="funnel" size={18} color="#fff" />
            <Text style={styles.filterButtonText}>
              {selectedActivityFilter ? selectedActivityFilter : 'Filter by Activity'}
            </Text>
            {selectedActivityFilter && (
              <TouchableOpacity
                style={styles.clearFilterIcon}
                onPress={clearActivityFilter}
              >
                <Ionicons name="close-circle" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.statsContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDarkMode ? '#eee' : '#333' }]}>{totalActivities}</Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Activities</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDarkMode ? '#eee' : '#333' }]}>{completionRate}%</Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Completion</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDarkMode ? '#eee' : '#333' }]}>{longestStreak}</Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Best Streak</Text>
        </View>
      </View>
      
      <View style={[styles.streakSection, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#eee' : '#333' }]}>Weekly Streak</Text>
        {renderWeeklyStreak()}
      </View>
      
      <View style={[styles.activitySection, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#eee' : '#333' }]}>Activity History</Text>
        {filteredActivities.length > 0 ? (
          <FlatList
            data={filteredActivities}
            renderItem={renderActivityItem}
            keyExtractor={item => item.id}
            scrollEnabled={false} // Disable scrolling as we're inside a ScrollView
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={50} color="#ddd" />
            <Text style={styles.emptyStateText}>No activities found in this date range</Text>
          </View>
        )}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  filterButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginHorizontal: 8,
    fontSize: 14,
  },
  clearFilterIcon: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalHeader: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  modalContent: {
    padding: 16,
  },
  dateRangeOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 10,
  },
  selectedDateRangeText: {
    color: '#fff',
    fontWeight: '600',
  },
  activityFilterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedActivityFilter: {
    backgroundColor: '#4CAF50',
  },
  activityFilterText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  selectedActivityFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#f1f3f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  closeButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5E60CE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  streakSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  weeklyStreakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayDotGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dayDotEmpty: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeDayText: {
    color: '#5E60CE',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  activitySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  activityColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    marginLeft: 4,
    color: '#4CAF50',
    fontWeight: '500',
  },
  missedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missedText: {
    marginLeft: 4,
    color: '#FF6B6B',
    fontWeight: '500',
  },
}

export default HistoryScreen;
