
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useAuth } from '../context/AuthContext';

function HomeScreen({ navigation }) {
  const{accessToken} =useAuth();
  const handleButtonPress = () => {
    accessToken ?  navigation.navigate('UserList') : navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to My App</Text>
      </View>
      <View style={styles.middleContainer}>
        <ImageBackground
          source={require('.././assets/background.jpg')} // Replace with your image source
          style={styles.middleBackground}
        >
          <View style={styles.middleContent}>
            <Text style={styles.introText}>
              {/* Your long introduction text goes here */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget purus justo.
              {/* Example text */}
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  middleContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // Rounded corners
    overflow: 'hidden', // Clip the contents to the rounded shape
  },
  middleBackground: {
    width: '100%',
    height: '100%',
  },
  middleContent: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  introText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  footer: {
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF', // Example button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop:10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
