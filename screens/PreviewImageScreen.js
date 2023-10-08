import React, { useEffect,useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import { View, Text, Image, TouchableOpacity, Button, FlatList, TextAlert,Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PreviewImageScreen = ({route,navigation}) => {
const [base64Image, setBase64Image] = useState('');
const isFocused = useIsFocused();
const{InspectId,others} =route.params;
const { accessToken } = useAuth();
const headers = {
  'Authorization': `Bearer ${accessToken}`, 
  'Content-Type': 'application/json', 
};

useEffect(() => {
  setBase64Image('');

if (isFocused) {
  fetchImage();
}
}, [isFocused]); 
  
 const fetchImage = async()=>{
  await AsyncStorage.getItem('serverUrl').then((url)=>{ 
      
    try {
        const image_url=`http://${url}/detail/${InspectId}`;
        axios
        .get(image_url,{headers})
        .then((response) => {
           setBase64Image(response.data);
           
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
  
  } catch (error) {
    alert(error);
  }
  });
 };

 const handleImagePress = () => {
    navigation.navigate("ResultList");
};

 

  

  return (
    <View>
    <TouchableOpacity onPress={handleImagePress}>
     { 
       base64Image && <Image source={{ uri: base64Image }} style={{ width: '100%', height: '100%' }} />
     }
    </TouchableOpacity>
  </View>
 
  );
};

export default PreviewImageScreen;
