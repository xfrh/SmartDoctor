import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ConfigNetScreen=({navigation})=> {
const[serverUrl,setServerUrl] =useState('');
 const data = [
    { key: '华为云Live', value: '123.60.62.73:8000' },
    { key: '测试环境1', value: '192.168.1.108:8000' },
    { key: '测试环境2', value: '192.168.161.77:8000' },
    { key: '测试环境3', value: '192.168.161.98:8000' },
    { key: '测试环境4', value: '192.168.1.67:8000' },
  ];


  const [selectedValue, setSelectedValue] = useState(data[0].value);

  useEffect(() => {
  
    fetchServerUrl();
   
  }, []);

  const fetchServerUrl = async () => {
    try {
      const url = await AsyncStorage.getItem('serverUrl');
      if (url) {
        setServerUrl(url);
        setSelectedValue(url);
       }
    } catch (error) {
      console.error('Error fetching server URL:', error);
    }
  };

  const saveServerUrl = async () => {
    try {
      // Save the server URL to AsyncStorage
     
      await AsyncStorage.setItem('serverUrl', selectedValue);
      navigation.navigate('Login');
    } catch (error) {
      alert('Error saving server URL:', error);
    }
  };
  


  return (
    <View style={styles.container}>
     <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        {/* 使用map函数生成Picker的选项 */}
        {data.map((item) => (
          <Picker.Item key={item.key} label={item.key} value={item.value} />
        ))}
      </Picker>
      <View style={styles.loginButtonContainer}>
      <Button title=" 保存 " onPress={saveServerUrl} />
      </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
   
  },
  loginButtonContainer: {
    marginTop: 50, // 添加上边距
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default ConfigNetScreen;
