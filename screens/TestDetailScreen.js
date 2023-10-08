import React, { useEffect,useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import { View, Text, StyleSheet,ScrollView,Image,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
function TestDetailScreen({ route,navigation }) {
  const isFocused = useIsFocused();
  const { item,others } = route.params;
  const [base64Image, setBase64Image] = useState('');
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
          const InspectId =JSON.parse(item).id;
          const image_url=`http://${url}/detail/${InspectId}`;
          
            axios.get(image_url,{headers}).then((response) => {
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
         const InspectId =JSON.parse(item).id;
        navigation.navigate('ImagePreview',{"InspectId":InspectId});
  };
  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      <View style={styles.textContainer}>
      <Text style={styles.title}>姓名:</Text> 
      <Text style={styles.description}> {JSON.parse(item).name}</Text>
      </View>
      <View style={styles.textContainer}>
      <Text style={styles.title}>性别:</Text> 
      <Text style={styles.description}> {JSON.parse(item).sex}</Text>
      </View>
      <View style={styles.textContainer} >
      <Text style={styles.title}>年龄:</Text> 
      <Text style={styles.description}> {JSON.parse(item).age}</Text>
      </View>
      <View style={styles.textContainer} >
      <Text style={styles.title}>电话:</Text> 
      <Text style={styles.description}> {JSON.parse(item).phone}</Text>
      </View>
     
      <View style={styles.textContainer} >
      <Text style={styles.title}>测试科室:</Text> 
      <Text style={styles.description}> {JSON.parse(item).testedby}</Text>
      </View>
      <View style={styles.textContainer} >
      <Text style={styles.title}>提交时间:</Text> 
      <Text style={styles.description}> {JSON.parse(item).createAt}</Text>
      </View>
      <View style={styles.textContainer} >
      <Text style={styles.title}>更新时间:</Text> 
      <Text style={styles.description}> {JSON.parse(item).updateAt}</Text>
      </View>
      {
        JSON.parse(item).conclusion?
        (
          <View style={styles.textContainer} >
             <View style={styles.cludeContainer} >
              <Text style={styles.title}>测试结论:</Text> 
                <Text style={styles.text}>
                Control 色差: {JSON.parse(item).conclusion.control_distance}
                </Text>
                <Text style={styles.text}>
                Test1 色差: {JSON.parse(item).conclusion.test_1}
                </Text>
                <Text style={styles.text}>
                Test2 色差: {JSON.parse(item).conclusion.test_2}
                </Text>
                <Text style={styles.text}>
                Test3 色差: {JSON.parse(item).conclusion.test_3}
                </Text>
                <Text style={styles.text}>
                Test4 色差: {JSON.parse(item).conclusion.test_4}
                </Text>
             </View>
       
          </View>

        ) 
        :
        ( 
          <View style={styles.textContainer} >
          <Text style={styles.title}>测试结论:</Text> 
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() =>  navigation.navigate('Upload',{id:JSON.parse(item).id})} >
               <Text style={styles.description}>
                      去拍照
              </Text> 
            </TouchableOpacity>
            
          
          </View>
        )
       
       } 
     
      
      <View style={styles.textContainer} >
     
      <Text style={styles.title}>测试用图片:</Text>
      
      <TouchableOpacity onPress={handleImagePress}> 
      {
        base64Image && <Image
        source={{ uri: base64Image }}
        style={{ width: 150, height: 200, marginTop: 20, alignSelf: 'flex-start' }} />
  
      }
    
     
    
     </TouchableOpacity>
      </View>
      
    

     </View>
     </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  cludeContainer :{
    flexDirection: 'column',
  },
  text: {
    fontSize: 16,
    lineHeight: 24, 
    mariginRight:16,
    alignSelf: 'flex-start',
  },
  textContainer: {
    flexDirection: 'row', 
    alignItems: 'flex-start',
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'normal',
    marginRight: 16, 
    lineHeight: 32, 
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    alignSelf: 'flex-start',
  },
});

export default TestDetailScreen;
