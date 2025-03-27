import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [attendanceMessage, setAttendanceMessage] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      captureImage();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);

        const base64Image = await fetch(photo.uri)
          .then(res => res.blob())
          .then(blob => new File([blob], 'captured_image.jpg', { type: 'image/jpeg' }));

        const formData = new FormData();
        formData.append('image', base64Image);

        const response = await fetch('http://localhost:3001/api/attendance/mark', {
          method: 'POST',
          body: formData,
        });

        const responseData = await response.text();

        try {
          const parsedData = JSON.parse(responseData);
          setAttendanceMessage(parsedData.message || 'Upload failed');
        } catch (parseError) {
          console.error('Parsing error:', parseError);
          Alert.alert('Error', 'Unable to parse server response');
        }
      } catch (error) {
        console.error('Capture error:', error);
        Alert.alert('Error', 'Failed to capture or upload image');
      }
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <Text onPress={requestPermission} style={styles.permissionText}>Grant Permission</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      />
      {capturedImage && (
        <View style={styles.previewContainer}>
          <Text style={styles.attendanceMessage}>{attendanceMessage}</Text>
          <Image
            source={{ uri: capturedImage }}
            style={styles.previewImage}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  attendanceMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  permissionText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },
  text: {
    textAlign: 'center',
    marginBottom: 10,
  },
});
