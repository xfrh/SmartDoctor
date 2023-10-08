import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import { SafeAreaView,View, Text,TextInput, FlatList, TouchableOpacity, StyleSheet,Button } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'; 
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

  const TestResultScreen=({ navigation })=> {
   const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { accessToken } = useAuth();
  const isFocused = useIsFocused();
  const [names, setNames] = useState([]);
  const [filteredData, setFilteredData] = useState(data); 
  const headers = {
    'Authorization': `Bearer ${accessToken}`, 
    'Content-Type': 'application/json', 
  };

  useEffect(() => {
    setSearchQuery('');
    setErrorMessage('');

    if (isFocused) {
       fetchData();
    }
  }, [isFocused]); 

const fetchData =  async ()=> await AsyncStorage.getItem('serverUrl').then( async (url)=>{
            try {
                   
                    const response = await fetch(`http://${url}/inspections/`,{headers:headers});
                    const result = await response.json();
                    
                     setData(result); 
                     setFilteredData(data);
                     setErrorMessage('');
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }

        });




    const handleSearch = () => {
      if (searchQuery === '') {
        // 如果搜索查询为空，则显示所有数据
        setFilteredData(data);
      } 
       else {
          const newFilteredData = data.filter(item => {
          const itemName = JSON.parse(item).name ? JSON.parse(item).name.toLocaleLowerCase() : '';
          const query = searchQuery ? searchQuery.toLocaleLowerCase() : '';
          return itemName.includes(query);
        });
  
        setFilteredData(newFilteredData);
      }
  };


  return accessToken ?
  (
    <View style={styles.container}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
     <TextInput
       style={{
         flex: 1,
         borderWidth: 1,
         borderColor: 'gray',
         borderRadius: 5,
         padding: 5,
         marginRight: 10,
       }}
       placeholder="搜索姓名"
       value={searchQuery}
       onChangeText={(text) => setSearchQuery(text)}
     />
     <TouchableOpacity
       onPress={handleSearch} // 清除搜索文本
     >
       <FontAwesome name="search" size={24} color="black" />
     </TouchableOpacity>
   </View>
   <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredData}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('DetailView', { "item":item })}
          >
         <View style={{ flexDirection: 'col', justifyContent: 'space-between', padding: 6 }}>
             <Text>受检人: {JSON.parse(item).name}</Text>
             <Text>时间: {JSON.parse(item).createAt}</Text>

            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
 </View>
 ) :  (
      <View>
        <Text>还没登录</Text>
        <Button
          title="登录系统"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    )
  
     
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gridItem: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TestResultScreen;
