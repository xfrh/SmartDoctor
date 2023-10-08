import React, { useEffect,useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import { View, Text, Image, ProgressBar, Button, FlatList, TextAlert,Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const ImageProcessScreen = ({route,navigation}) => {
const [base64Image, setBase64Image] = useState('');
const[data,setData] = useState([]);
const{ItemId, InspectId,others} =route.params;
const [errorMessage, setErrorMessage] = useState('');
const isFocused = useIsFocused();
useEffect(() => {
  setBase64Image('');
  setData([]);
  setBase64Image('');
  setErrorMessage('');
if (isFocused) {
  fetchImage();
}
}, [isFocused]); 
  
 const fetchImage = async()=>{
  await AsyncStorage.getItem('serverUrl').then((url)=>{ 
      
    try {
        const image_url=`http://${url}/item/${ItemId}/`;
        axios
        .get(image_url)
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

 const handleStartDetection = async () => {
   setData([]);
  for (let i = 0; i < 10; i++) {
    setData((prevData) => [...prevData, { content: `检测 ${i + 1}`, result: '结果' }]);
  }
  showConfirmationDialog();
};

  const handleSave =() =>{
    navigation.navigate('ResultList',{id:InspectId});
  };
  const handleCancel= async() =>{
    await AsyncStorage.getItem('serverUrl').then((url)=>{ 
        axios.delete(`http://${url}/item/${ItemId}/`)
        .then(response => {
          if(response.data.item_id)
            handleInspectionDelete();
         })
        .catch(error => {
         alert("delete item failed");
       });

    });
  };
  const handleInspectionDelete = async() =>{
    console.log(InspectId);
    await AsyncStorage.getItem('serverUrl').then((url)=>{ 
      axios.delete(`http://${url}/inspection/${InspectId}/`)
      .then(response => {
        if(response.data.id)
          alert("Inspection has deleted");
          navigation.navigate("UserList");
       })
      .catch(error => {
       alert("delete inspection failed");
     });
    });
  };


  const showConfirmationDialog = () => {
    Alert.alert(
      '确认',
      '是否使用此照片',
      [
        {
          text: '否',
          onPress: ()=>handleCancel(),
          style: 'cancel',
        },
        {
          text: '是',
          onPress: () => handleSave(),
        },
      ],
      { cancelable: false }
    );
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    { base64Image && <Image
      source={{ uri: base64Image }}
      style={{ width: 150, height: 200, marginBottom: 20 }}
    />
  }
        {/* 开始检测按钮 */}
     <Button title="开始检测" onPress={handleStartDetection} />
    
    {/* 列表 */}
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <Text>{item.content}</Text>
          <Text>{item.result}</Text>
        </View>
      )}
/>

   
  </View>
  
  );
};

export default ImageProcessScreen;
