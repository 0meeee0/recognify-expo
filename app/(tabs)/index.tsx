import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.logo}>Recognify</Text>
                    <Text style={styles.tagline}>Smart Attendance. Smarter Campus.</Text>
                </View>
                
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../../assets/images/hat.png')}
                        style={styles.image} 
                        resizeMode="contain"
                    />
                </View>
                
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Attendance Made Simple</Text>
                    <Text style={styles.description}>
                        Revolutionize your classroom with our advanced facial recognition system. 
                        Recognify uses cutting-edge DeepFace technology to automate attendance tracking, 
                        saving time and improving accuracy.
                    </Text>
                </View>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('CameraScreen')}>
                        <Text style={styles.primaryButtonText}>Take Attendance</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('addStudent')}>
                        <Text style={styles.secondaryButtonText}>Register New Student</Text>
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.footer}>
                    Powered by DeepFace & Express
                </Text>
            </View>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3a86ff',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 16,
        color: '#6c757d',
        marginTop: 4,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    image: {
        width: width * 0.7,
        height: width * 0.7,
    },
    textContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212529',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#495057',
        textAlign: 'center',
    },
    buttonContainer: {
        marginBottom: 30,
    },
    primaryButton: {
        backgroundColor: '#3a86ff',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3a86ff',
    },
    secondaryButtonText: {
        color: '#3a86ff',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        color: '#adb5bd',
        fontSize: 14,
        marginBottom: 10,
    }
});

export default LandingPage;