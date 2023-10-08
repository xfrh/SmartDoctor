import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ConfigNetScreen=({navigation})=> {
  const[serverUrl,setServerUrl] =useState('');
  useEffect(() => {
  
    fetchServerUrl();
  }, []);

  const fetchServerUrl = async () => {
    try {
      const url = await AsyncStorage.getItem('serverUrl');
      if (url) {
        setServerUrl(url);
       }
    } catch (error) {
      console.error('Error fetching server URL:', error);
    }
  };

  const saveServerUrl = async () => {
    try {
      // Save the server URL to AsyncStorage
      await AsyncStorage.setItem('serverUrl', serverUrl);
      navigation.navigate('Login');
    } catch (error) {
      alert('Error saving server URL:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="输入服务器url"
        value={serverUrl}
        onChangeText={text => setServerUrl(text)}
      />
      <Button title="Save" onPress={saveServerUrl} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ConfigNetScreen;
