import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function StudentCreationForm() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your photos to continue.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a name' });
      return;
    }
  
    setLoading(true);
    setStatusMessage(null);
    
    const formData = new FormData();
    formData.append('name', name);
  
    if (image) {
      const base64Image = await fetch(image)
        .then(res => res.blob())
        .then(blob => new File([blob], 'student_image.jpg', { type: 'image/jpeg' }));
  
      formData.append('image', base64Image);
    }
  
    try {
      const response = await fetch('http://localhost:3001/api/students/create', {
        method: 'POST',
        body: formData
      });
  
      const responseData = await response.text();
      
      try {
        const parsedData = JSON.parse(responseData);
        if (response.ok) {
          setStatusMessage({ type: 'success', text: 'Student added successfully' });
          setName('');
          setImage(null);
        } else {
          setStatusMessage({ type: 'error', text: 'Failed to create student' });
        }
      } catch (parseError) {
        setStatusMessage({ type: 'error', text: 'Server error' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple status message */}
        {statusMessage && (
          <View style={[
            styles.statusMessage,
            statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage
          ]}>
            <Text style={styles.statusText}>{statusMessage.text}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Student Registration</Text>
            <Text style={styles.headerSubtitle}>Add a new student to the system</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Student Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#A0A0A0"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Profile Photo</Text>
            
            {!image ? (
              <TouchableOpacity 
                onPress={pickImage} 
                style={styles.imagePlaceholder}
              >
                {/* <Ionicons name="camera-outline" size={40} color="#3a86ff" /> */}
                <Text style={styles.imagePlaceholderText}>Tap to select photo</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: image }} 
                  style={styles.selectedImage} 
                />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                {/* <Ionicons name="person-add" size={20} color="#FFFFFF" style={styles.buttonIcon} /> */}
                <Text style={styles.submitButtonText}>Register Student</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  statusMessage: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: '#4CAF50',
  },
  errorMessage: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 180,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#F0F0F0',
  },
  changeImageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  },
  changeImageText: {
    color: '#3a86ff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3a86ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#3a86ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});