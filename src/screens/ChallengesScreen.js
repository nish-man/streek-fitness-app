import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Image, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

// Mock data for challenges
const initialChallenges = [
  { id: '1', name: 'Morning Run', frequency: 'Daily', streak: 5, completed: false },
  { id: '2', name: 'Gym Workout', frequency: 'Mon, Wed, Fri', streak: 3, completed: false },
  { id: '3', name: 'Yoga Session', frequency: 'Daily', streak: 10, completed: false },
];

// Activity types with icons
const activityTypes = [
  { id: '1', name: 'Running', icon: 'fitness-outline' },
  { id: '2', name: 'Gym', icon: 'barbell' },
  { id: '3', name: 'Yoga', icon: 'body' },
  { id: '4', name: 'Swimming', icon: 'water-outline' },
  { id: '5', name: 'Cycling', icon: 'bicycle' },
  { id: '6', name: 'Walking', icon: 'walk' },
];

// Frequency options
const frequencyOptions = [
  { id: '1', name: 'Daily' },
  { id: '2', name: 'Weekdays' },
  { id: '3', name: 'Weekends' },
  { id: '4', name: 'Mon, Wed, Fri' },
  { id: '5', name: 'Tue, Thu, Sat' },
  { id: '6', name: 'Custom' },
];

const ChallengesScreen = () => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [markDoneModalVisible, setMarkDoneModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [customFrequency, setCustomFrequency] = useState('');
  const [showCustomFrequency, setShowCustomFrequency] = useState(false);
  
  // Get current date
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Add a new activity
  const handleAddActivity = () => {
    if (!selectedActivity || !selectedFrequency) {
      Alert.alert('Error', 'Please select both activity type and frequency');
      return;
    }
    
    // Check if custom frequency is selected but not entered
    if (selectedFrequency.name === 'Custom' && !customFrequency.trim()) {
      Alert.alert('Error', 'Please enter a custom frequency');
      return;
    }
    
    const newChallenge = {
      id: Date.now().toString(),
      name: selectedActivity.name,
      frequency: selectedFrequency.name === 'Custom' ? customFrequency : selectedFrequency.name,
      streak: 0,
      completed: false,
    };
    
    setChallenges([...challenges, newChallenge]);
    setAddModalVisible(false);
    setSelectedActivity(null);
    setSelectedFrequency(null);
    
    // Show success message
    Alert.alert('Success', `${selectedActivity.name} challenge added!`);
  };

  // Open mark as done modal
  const openMarkDoneModal = (challenge) => {
    setCurrentChallenge(challenge);
    setMarkDoneModalVisible(true);
  };

  // Pick an image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload proof');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setProofImage(result.assets[0].uri);
    }
  };

  // Mark activity as done
  const markAsDone = (satisfied) => {
    if (!proofImage) {
      Alert.alert('Proof required', 'Please upload a photo as proof of your activity');
      return;
    }
    
    if (satisfied) {
      setChallenges(challenges.map(challenge => 
        challenge.id === currentChallenge.id 
          ? { ...challenge, completed: true, streak: challenge.streak + 1 }
          : challenge
      ));
      
      // Show success message with streak milestone if applicable
      const updatedStreak = currentChallenge.streak + 1;
      let message = `Great job! Your streak is now ${updatedStreak} days.`;
      
      if (updatedStreak === 7) {
        message = 'Awesome! You reached a 7-day streak! 🔥';
      } else if (updatedStreak === 30) {
        message = 'Incredible! You reached a 30-day streak! 🏆';
      }
      
      Alert.alert('Activity Completed', message);
    }
    
    setMarkDoneModalVisible(false);
    setProofImage(null);
    setCurrentChallenge(null);
  };

  // Render activity item
  const renderChallengeItem = ({ item }) => (
    <View style={[styles.challengeItem, item.completed && styles.completedChallengeItem]}>
      <View style={styles.challengeInfo}>
        <Text style={[styles.challengeName, item.completed && styles.completedText]}>{item.name}</Text>
        <Text style={[styles.challengeFrequency, item.completed && styles.completedText]}>{item.frequency}</Text>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={18} color={item.completed ? "#fff" : "#FF6B6B"} />
          <Text style={[styles.streakText, item.completed && {color: '#fff'}]}>{item.streak} day streak</Text>
        </View>
      </View>
      
      {!item.completed ? (
        <TouchableOpacity 
          style={styles.markDoneButton}
          onPress={() => openMarkDoneModal(item)}
        >
          <Text style={styles.markDoneButtonText}>Mark as Done</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}
    </View>
  );

  // Render activity type item
  const renderActivityTypeItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.activityTypeItem, 
        selectedActivity?.id === item.id && styles.selectedItem,
        { backgroundColor: isDarkMode ? '#333' : '#f1f3f5' }
      ]}
      onPress={() => setSelectedActivity(item)}
    >
      <Ionicons name={item.icon} size={24} color={selectedActivity?.id === item.id ? theme.primary : (isDarkMode ? '#aaa' : '#666')} />
      <Text style={[styles.activityTypeName, { color: isDarkMode ? '#eee' : '#333' }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Render frequency option item
  const renderFrequencyItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.frequencyItem, 
        selectedFrequency?.id === item.id && styles.selectedItem,
        { backgroundColor: isDarkMode ? '#333' : '#f1f3f5' }
      ]}
      onPress={() => {
        setSelectedFrequency(item);
        setShowCustomFrequency(item.name === 'Custom');
        if (item.name !== 'Custom') {
          setCustomFrequency('');
        }
      }}
    >
      <Text style={[styles.frequencyName, { color: isDarkMode ? '#eee' : '#333' }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8f9fa' }]}>
      <Text style={[styles.dateText, { color: isDarkMode ? '#eee' : '#333' }]}>{formattedDate}</Text>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Activity</Text>
      </TouchableOpacity>
      
      {challenges.length > 0 ? (
        <FlatList
          data={challenges}
          renderItem={renderChallengeItem}
          keyExtractor={item => item.id}
          style={styles.challengesList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={60} color={isDarkMode ? '#444' : '#ccc'} />
          <Text style={[styles.emptyStateText, { color: isDarkMode ? '#888' : '#999' }]}>No activities yet. Add your first activity to get started!</Text>
        </View>
      )}
      
      {/* Add Activity Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#eee' : '#333' }]}>Add New Activity</Text>
            
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#eee' : '#333' }]}>Select Activity Type</Text>
            <FlatList
              data={activityTypes}
              renderItem={renderActivityTypeItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.activityTypesList}
            />
            
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#eee' : '#333' }]}>Select Frequency</Text>
            <FlatList
              data={frequencyOptions}
              renderItem={renderFrequencyItem}
              keyExtractor={item => item.id}
              style={styles.frequencyList}
            />
            
            {showCustomFrequency && (
              <View style={[styles.customFrequencyContainer, { backgroundColor: isDarkMode ? '#333' : '#f8f9fa', borderColor: theme.primary }]}>
                <Text style={[styles.customFrequencyLabel, { color: theme.primary }]}>Enter custom frequency:</Text>
                <TextInput
                  style={[
                    styles.customFrequencyInput, 
                    { 
                      backgroundColor: isDarkMode ? '#444' : '#fff', 
                      borderColor: isDarkMode ? '#555' : '#ddd',
                      color: isDarkMode ? '#eee' : '#333'
                    }
                  ]}
                  placeholder="e.g., Twice a week, Every other day"
                  placeholderTextColor={isDarkMode ? '#888' : '#999'}
                  value={customFrequency}
                  onChangeText={setCustomFrequency}
                />
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddActivity}
              >
                <Text style={styles.confirmButtonText}>Add Activity</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Mark as Done Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={markDoneModalVisible}
        onRequestClose={() => setMarkDoneModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#eee' : '#333' }]}>
              Mark {currentChallenge?.name} as Done
            </Text>
            
            <Text style={[styles.proofText, { color: isDarkMode ? '#aaa' : '#666' }]}>Upload a photo as proof</Text>
            
            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: isDarkMode ? '#333' : '#f1f3f5', borderColor: isDarkMode ? '#555' : '#ddd' }]} onPress={pickImage}>
              {proofImage ? (
                <Image source={{ uri: proofImage }} style={styles.proofImage} />
              ) : (
                <>
                  <Ionicons name="camera" size={24} color={theme.primary} />
                  <Text style={[styles.uploadButtonText, { color: theme.primary }]}>Upload Photo</Text>
                </>
              )}
            </TouchableOpacity>
            
            {proofImage && (
              <Text style={[styles.satisfactionText, { color: isDarkMode ? '#eee' : '#333' }]}>
                Are you satisfied with today's session?
              </Text>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setMarkDoneModalVisible(false);
                  setProofImage(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              {proofImage && (
                <>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.noButton]}
                    onPress={() => markAsDone(false)}
                  >
                    <Text style={[styles.noButtonText, { color: '#fff' }]}>No, Retry</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.confirmButton, { backgroundColor: theme.primary }]}
                    onPress={() => markAsDone(true)}
                  >
                    <Text style={[styles.confirmButtonText, { color: '#fff' }]}>Yes, Done!</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5E60CE',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  challengesList: {
    flex: 1,
  },
  challengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  challengeFrequency: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
    marginLeft: 4,
  },
  markDoneButton: {
    backgroundColor: '#5E60CE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  markDoneButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedChallengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderColor: '#2E7D32',
    borderWidth: 1,
  },
  completedText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  activityTypesList: {
    marginBottom: 20,
  },
  activityTypeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#f1f3f5',
    width: 80,
  },
  activityTypeName: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
  frequencyList: {
    marginBottom: 10,
    maxHeight: 200,
  },
  customFrequencyContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5E60CE',
  },
  customFrequencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5E60CE',
    marginBottom: 8,
  },
  customFrequencyInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 14,
  },
  frequencyItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f1f3f5',
  },
  frequencyName: {
    fontSize: 14,
    color: '#333',
  },
  selectedItem: {
    backgroundColor: isDarkMode => isDarkMode ? '#2c2c54' : '#e9ecff',
    borderColor: '#5E60CE',
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#5E60CE',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  noButton: {
    backgroundColor: '#FF6B6B',
  },
  noButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  proofText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#5E60CE',
    marginTop: 8,
    fontWeight: '500',
  },
  proofImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  satisfactionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ChallengesScreen;
