import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  TextInput, Alert, Image
} from 'react-native';
import { CameraView } from 'expo-camera';
import { router } from 'expo-router';

const LoginPage = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  const handleLogin = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Please enter your name');

    try {
      setLoading(true);

      const photo = await cameraRef.current?.takePictureAsync();
      if (!photo?.uri) throw new Error('Failed to capture image');
      setCapturedImage(photo.uri);

      const blob = await fetch(photo.uri).then(res => res.blob());
      const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', file);

      const res = await fetch('http://localhost:3001/api/auth/face-auth', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Save token or user info
      await localStorage.setItem('user', JSON.stringify(data));
      await localStorage.setItem('token', JSON.stringify(data.token));
      Alert.alert('Success', 'Logged in successfully');
      router.push("/(tabs)/explore");
    } catch (err: any) {
      Alert.alert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  if (token) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{JSON.parse(user)?.message}</Text>
      </SafeAreaView>
    );
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recognify Login</Text>

      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <CameraView style={styles.camera} ref={cameraRef} facing="front" />

      {capturedImage && (
        <Image source={{ uri: capturedImage }} style={styles.preview} />
      )}

      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loadingButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login with Face'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    padding: 14,
    borderRadius: 20,
    marginBottom: 30,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  camera: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  preview: {
    width: 120,
    height: 120,
    marginVertical: 20,
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#4a90e2',
  },
  loginButton: {
    backgroundColor: '#4a90e2',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
    transition: 'background-color 0.3s',
  },
  loadingButton: {
    backgroundColor: '#7b9eaf',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPage;
