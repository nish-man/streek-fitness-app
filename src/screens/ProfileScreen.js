import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Switch, Modal, TextInput, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

// Mock user data
const initialUserData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  profileImage: null, // Would be a URL in a real app
  fitnessGoal: 'Build strength and improve endurance',
  timezone: 'Asia/Kolkata',
  darkMode: false,
  notifications: true,
  offlineMode: false,
  socialSharing: true,
};

// Mock achievements data
const achievements = [
  { id: '1', name: 'First Workout', description: 'Complete your first workout', earned: true, icon: 'trophy' },
  { id: '2', name: '7-Day Streak', description: 'Complete activities for 7 consecutive days', earned: true, icon: 'flame' },
  { id: '3', name: '30-Day Streak', description: 'Complete activities for 30 consecutive days', earned: false, icon: 'flame' },
  { id: '4', name: 'Variety Master', description: 'Try 5 different workout types', earned: true, icon: 'ribbon' },
  { id: '5', name: 'Early Bird', description: 'Complete 10 workouts before 8 AM', earned: false, icon: 'sunny' },
];

const ProfileScreen = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUserData, setEditedUserData] = useState({...initialUserData});
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  
  // Sync the dark mode state with the theme context
  useEffect(() => {
    setUserData(prevData => ({
      ...prevData,
      darkMode: isDarkMode
    }));
  }, [isDarkMode]);
  
  // Toggle settings
  const toggleSetting = (setting) => {
    if (setting === 'darkMode') {
      toggleDarkMode(); // This will update the theme context and trigger the useEffect
    } else {
      setUserData({
        ...userData,
        [setting]: !userData[setting],
      });
    }
  };
  
  // Share app with friends
  const shareApp = async () => {
    if (!userData.socialSharing) {
      Alert.alert('Social Sharing Disabled', 'Please enable social sharing in settings to share your achievements.');
      return;
    }
    
    try {
      const result = await Share.share({
        message: 'Check out Streek, the fitness accountability app that helps me stay on track with my fitness goals! 💪',
        title: 'Join me on Streek!'
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('Shared with activity type of:', result.activityType);
        } else {
          // shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  // Pick an image from gallery for profile picture
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to change your profile picture!');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      setEditedUserData({
        ...editedUserData,
        profileImage: result.assets[0].uri,
      });
    }
  };
  
  // Save edited profile
  const saveProfile = () => {
    setUserData(editedUserData);
    setEditModalVisible(false);
  };
  
  // Calculate achievements progress
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const achievementProgress = Math.round((earnedAchievements / achievements.length) * 100);
  
  // Render achievement item
  const renderAchievement = (achievement) => (
    <View key={achievement.id} style={[styles.achievementItem, { borderBottomColor: isDarkMode ? '#333' : '#f1f3f5' }]}>
      <View style={[
        styles.achievementIcon, 
        !achievement.earned && styles.unearnedIcon,
        { backgroundColor: achievement.earned ? (isDarkMode ? '#2c2c54' : '#f0f2ff') : (isDarkMode ? '#333' : '#f8f9fa') }
      ]}>
        <Ionicons 
          name={achievement.icon} 
          size={24} 
          color={achievement.earned ? theme.primary : (isDarkMode ? '#555' : '#ccc')} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementName, 
          !achievement.earned && styles.unearnedText,
          { color: achievement.earned ? theme.text : (isDarkMode ? '#777' : '#999') }
        ]}>
          {achievement.name}
        </Text>
        <Text style={[styles.achievementDescription, { color: isDarkMode ? '#aaa' : '#666' }]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.earned && (
        <Ionicons name="checkmark-circle" size={24} color={theme.secondary} />
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={['#5E60CE', '#4CAF50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.profileHeader}
      >
        <View style={styles.profileImageContainer}>
          {userData.profileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={60} color="#ccc" />
            </View>
          )}
        </View>
        
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileEmail}>{userData.email}</Text>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => {
            setEditedUserData({...userData});
            setEditModalVisible(true);
          }}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Fitness Goal</Text>
        <Text style={[styles.fitnessGoal, { color: theme.text }]}>{userData.fitnessGoal}</Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#333' : '#f1f3f5' }]}>
            <View style={[styles.progressFill, { width: `${achievementProgress}%`, backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.primary }]}>
            {earnedAchievements}/{achievements.length} Earned
          </Text>
        </View>
        
        <View style={styles.achievementsList}>
          {achievements.map(renderAchievement)}
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={userData.darkMode}
            onValueChange={() => toggleSetting('darkMode')}
            trackColor={{ false: '#ddd', true: theme.primary }}
            thumbColor="#fff"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
          </View>
          <Switch
            value={userData.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: '#ddd', true: theme.primary }}
            thumbColor="#fff"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="cloud-offline" size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Offline Mode</Text>
          </View>
          <Switch
            value={userData.offlineMode}
            onValueChange={() => toggleSetting('offlineMode')}
            trackColor={{ false: '#ddd', true: theme.primary }}
            thumbColor="#fff"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="share-social" size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Social Sharing</Text>
          </View>
          <Switch
            value={userData.socialSharing}
            onValueChange={() => toggleSetting('socialSharing')}
            trackColor={{ false: '#ddd', true: theme.primary }}
            thumbColor="#fff"
          />
        </View>
        
        <View style={styles.shareContainer}>
          <Text style={[styles.shareTitle, { color: theme.text }]}>
            <Ionicons name="megaphone" size={18} color={theme.primary} /> Spread the Word!
          </Text>
          <Text style={[styles.shareDescription, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Help your friends achieve their fitness goals by sharing Streek with them.
          </Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={shareApp}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.primary, theme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shareButtonGradient}
            >
              <View style={styles.shareButtonContent}>
                <Ionicons name="share-social" size={24} color="#fff" />
                <Text style={styles.shareButtonText}>Share Streek with Friends</Text>
                <View style={styles.shareButtonArrow}>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="time" size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Time Zone</Text>
          </View>
          <Text style={[styles.timezoneText, { color: theme.text }]}>{userData.timezone}</Text>
        </View>
      </View>
      
      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
            
            <TouchableOpacity style={styles.editImageButton} onPress={pickImage}>
              {editedUserData.profileImage ? (
                <Image source={{ uri: editedUserData.profileImage }} style={styles.editProfileImage} />
              ) : (
                <View style={styles.editProfileImagePlaceholder}>
                  <Ionicons name="person" size={40} color="#ccc" />
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Name</Text>
              <TextInput
                style={[styles.textInput, { color: theme.text, backgroundColor: isDarkMode ? '#333' : '#f8f9fa', borderColor: isDarkMode ? '#555' : '#ddd' }]}
                value={editedUserData.name}
                onChangeText={(text) => setEditedUserData({...editedUserData, name: text})}
                placeholderTextColor={isDarkMode ? '#888' : '#999'}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Email</Text>
              <TextInput
                style={[styles.textInput, { color: theme.text, backgroundColor: isDarkMode ? '#333' : '#f8f9fa', borderColor: isDarkMode ? '#555' : '#ddd' }]}
                value={editedUserData.email}
                onChangeText={(text) => setEditedUserData({...editedUserData, email: text})}
                keyboardType="email-address"
                placeholderTextColor={isDarkMode ? '#888' : '#999'}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Fitness Goal</Text>
              <TextInput
                style={[styles.textInput, { color: theme.text, backgroundColor: isDarkMode ? '#333' : '#f8f9fa', borderColor: isDarkMode ? '#555' : '#ddd' }]}
                value={editedUserData.fitnessGoal}
                onChangeText={(text) => setEditedUserData({...editedUserData, fitnessGoal: text})}
                multiline
                placeholderTextColor={isDarkMode ? '#888' : '#999'}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Time Zone</Text>
              <TextInput
                style={[styles.textInput, { color: theme.text, backgroundColor: isDarkMode ? '#333' : '#f8f9fa', borderColor: isDarkMode ? '#555' : '#ddd' }]}
                value={editedUserData.timezone}
                onChangeText={(text) => setEditedUserData({...editedUserData, timezone: text})}
                placeholderTextColor={isDarkMode ? '#888' : '#999'}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
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
  fitnessGoal: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#f1f3f5',
    borderRadius: 5,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5E60CE',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5E60CE',
  },
  achievementsList: {
    marginTop: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  achievementIcon: {
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
  unearnedIcon: {
    backgroundColor: '#f8f9fa',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  unearnedText: {
    color: '#999',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  shareContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(94, 96, 206, 0.3)',
    borderStyle: 'dashed',
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  shareDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  shareButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shareButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  shareButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 12,
  },
  shareButtonArrow: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 4,
  },
  timezoneText: {
    fontSize: 14,
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
    borderRadius: 16,
    padding: 24,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  editImageButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 12,
    color: '#5E60CE',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#5E60CE',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;
