import React, { useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView,ScrollView  } from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import { useFocusEffect } from '@react-navigation/native'; 
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NewUserScreen  = ({navigation}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('男');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState([]);
  const { accessToken } = useAuth();
  const isFocused = useIsFocused();
  const headers = {
    'Authorization': `Bearer ${accessToken}`, 
    'Content-Type': 'application/json', 
  };
  
  useFocusEffect(
        React.useCallback(() => {
          // 在页面获得焦点时重置搜索文本
          setName('');
          setGender('男');
          setAge('');
          setPhone('');
          setDepartment('');
          setErrorMessage('')
          if (isFocused) {
            fetchData();
        }
        }, [isFocused])
      );

      
    const fetchData =  async ()=> await AsyncStorage.getItem('serverUrl').then((url)=>{
      try {
          axios.get(`http://${url}/departments/`,{headers}).then((response) => {
              setData(response.data);
           
        })
          setErrorMessage('');
      } catch (error) {
        alert(error);
      }

  });
     

      const handleNameChange = (value) => {
        setName(value);
      };
    
      const handleGenderChange = (value) => {
        setGender(value);
      };
    
      const handleAgeChange = (value) => {
        setAge(value);
      };
    
      const handlePhoneChange = (text) => {
        setPhone(text);
      };
    
      const handleDepartmentChange = (value) => {
        setDepartment(value);
      };
      const getCurrentDateTime = () => {
        const currentDate = new Date();
      
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
      
        return formattedDateTime;
      };
      
     

      const handleAddNewUser = async() => {
        const phoneNumberPattern = /^1[3|4|5|6|7|8][0-9]{9}$/;
        if (!phoneNumberPattern.test(phone)) {
          setErrorMessage('请输入有效的手机号');
          return;
        }
        if(name==''){
          setErrorMessage('请输入受检者姓名');
          return;
        }

        if(gender==''){
          setErrorMessage('请选择受检者性别');
          return;
        }
       
       
        if(age==''){
          setErrorMessage('请输入受检者年龄');
          return;
        }
        if(department==''){
          setErrorMessage('请输入受检科室');
          return;
        }
        const crerateDate = getCurrentDateTime();
        await AsyncStorage.getItem('serverUrl').then(async (url)=>{
            try {
                const response = await axios.post("http://"+ url +"/accepters/", {
                "name":name,
                "sex":gender,
                "age": age,
                "phone":phone,
                "department":department,
                "createAt":crerateDate,
                },{headers});
         
               setErrorMessage('');
               navigation.navigate('UserList',{"id": response.data.id});
              
            } catch (error) {
              alert(error);
            }

        });

    
    
      
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding" 
    >
      <ScrollView
        keyboardShouldPersistTaps="handled" 
      >
      <View style={styles.formGroup}>
        <Text style={styles.label}>姓名:</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入受检人姓名"
          value={name}
          onChangeText={handleNameChange}
        />
      </View>


   

      <View style={styles.formGroup}>
      <Text style={styles.label}>性别:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioGroup
              selectedIndex={gender}
              onSelect={(index, value) => handleGenderChange(value)}
              style={styles.radioGroup}
            >
              <RadioButton value="男">
                <Text>男</Text>
              </RadioButton>
              <RadioButton value="女">
                <Text>女</Text>
              </RadioButton>
            </RadioGroup>
        </View>
      </View>

      <View style={styles.formGroup}>
        
      <Text style={styles.label}>年龄:</Text>
          <TextInput
            value={age}
            onChangeText={handleAgeChange}
            placeholder="请输入受测人年龄"
            style={styles.input}
          />
      </View>

      <View style={styles.formGroup}>
      <Text style={styles.label}>电话:</Text>
          <TextInput
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="请输入电话"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.formpicker} >
     
     <Text style={styles.label}>科室:</Text>
         {/* <TextInput
           value={department}
           onChangeText={handleDepartmentChange}
           placeholder="请输入检测科室"
           style={styles.input}
         /> */}

          <Picker
      selectedValue={department}
      onValueChange={handleDepartmentChange}
    >
      <Picker.Item label="请输入检测科室" value="" />
      {data.map((item) => (
         <Picker.Item key={JSON.parse(item).id} label={JSON.parse(item).name} value={JSON.parse(item).name} />
       ))}
      </Picker>
       </View>

        <View style={styles.loginButtonContainer}>
          {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            <Button title="确定" onPress={handleAddNewUser} />
       </View>
       </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formpicker:{
  padding:10,
    
  },
  label: {
    flex: 1,
    marginRight: 10,
    textAlign: 'left',
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  loginButtonContainer: {
    marginTop: 20, // 添加上边距
  
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default NewUserScreen;
