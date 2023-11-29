import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import { View, Text, TextInput,Button,TouchableOpacity,
  KeyboardAvoidingView,ScrollView } from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; 
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
const UserListScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
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

  useEffect(() => {
      setName('');
      setGender('');
      setAge('');
      setPhone('');
      setDepartment('');
      setErrorMessage('');
    if (isFocused) {
        fetchData();
    }
  }, [isFocused]); 

    const fetchData =  async ()=> await AsyncStorage.getItem('serverUrl').then((url)=>{
            try {
               
                axios.get(`http://${url}/accepters/`,{headers}).then((response) => {
                    setData(response.data);
                   
              })
                setErrorMessage('');
            } catch (error) {
              alert(error);
            }

        });
  
  const getCurrentDateTime = () => {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  
    return formattedDateTime;
  };
   
  const handleNameChange = (itemValue, itemIndex) => {

    try {
      setName(itemValue);
      obj= JSON.parse(data[itemIndex-1]);
      setPhone(obj.phone);
      setGender(obj.sex);
      setAge(obj.age);
      setDepartment(obj.department);
            
    } catch (error) {
      console.log(error);
    }
   
      
  };

  const handleGenderChange = (value) => {
        setGender(value);
  };

  const handlePhoneChange = (text) => {
    setPhone(text);
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
  };

  const handleAgeChange = (value) => {
    setAge(value);
  };

  const handleUpload = async () => {
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
      setErrorMessage('请选择受检者性别')
      return;
    }
    
     
    if(department==''){
      setErrorMessage('请输入受检科室');
      return;
    }
    const crerateDate = getCurrentDateTime();
    await AsyncStorage.getItem('serverUrl').then(async (url)=>{
      try {

        const response = await axios.post("http://"+ url +"/inspections/", {
          "name":name,
          "sex":gender,
          "age": age,
          "phone":phone,
          "testedby":department,
          "createAt":crerateDate,
          },{headers});
   
         setErrorMessage('');
         navigation.navigate('Upload',{"id": response.data.id});
        
      } catch (error) {
         if(error.response && error.response.status===500){
           alert("token is expired, relogin please");
           navigation.navigate("Login");
         }
         else
            alert(error);
      }

  });



      // await AsyncStorage.getItem('serverUrl').then((url)=>{
       
      //     try {
      //       axios.post(`http:// ${url}/inspections/`, {
      //       "name": name,
      //       "sex" : gender,
      //       "age" :age,
      //       "phone":phone,
      //       "createAt":getCurrentDateTime(),
      //       "testedby" : department,
      //     },{headers}).then((response) => {
      //        const inspection_id = response.data.id;
      //        setErrorMessage('');
      //        navigation.navigate('Upload',{id:inspection_id});
      //     }).catch((error) => {
      //       // 处理错误
      //       console.error('Axios Error:', error);
      //     });
              
      //   } catch (error) {
      //          alert(error);
      // }
      // });


  };

  return accessToken ?
    (
      <KeyboardAvoidingView
      style={styles.container}
      behavior="padding" 
    >
      <ScrollView
        keyboardShouldPersistTaps="handled" 
      >
      <View style={styles.container}>
         <Text style={styles.label}>姓名:</Text>
      <Picker
       selectedValue={name}
       onValueChange={handleNameChange}
     >
       <Picker.Item label="请选择受检人" value="" />
       
       {data.map((item) => (
         <Picker.Item key={JSON.parse(item).id} label={JSON.parse(item).name} value={JSON.parse(item).name} />
       ))}
     </Picker>
     {/* <RadioGroup
         selectedIndex={gender}
         onSelect={(index, value) => handleGenderChange(value)}
         style={styles.radioGroup}
       >
         <RadioButton 
         value="男"
         status={gender === "男" ? 'checked' : 'unchecked'}
         >
           <Text>男</Text>
         </RadioButton>

         <RadioButton 
         value="女"
         status={gender === '女' ? 'checked' : 'unchecked'}
         >
           <Text>女</Text>
         </RadioButton>
       </RadioGroup> */}
      <RadioGroup
      selectedIndex={gender === '男' ? 0 : gender === '女' ? 1 : -1}
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


      <Text style={styles.label}>年龄:</Text>
     <TextInput
       value={age}
       onChangeText={handleAgeChange}
       placeholder="请输入年龄"
       style={styles.input}
     />
       <Text style={styles.label}>电话:</Text>
       <TextInput
         value={phone}
         onChangeText={handlePhoneChange}
         placeholder="请输入电话"
         keyboardType="phone-pad"
         style={styles.input}
       />
      <Text style={styles.label}>科室:</Text>
     <TextInput
       value={department}
       onChangeText={handleDepartmentChange}
       placeholder="请输入科室"
       style={styles.input}
     />

 <View style={styles.loginButtonContainer}>
      {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}
<Button title="开始检测" onPress={handleUpload} />
</View>
 </View>
 </ScrollView>
    </KeyboardAvoidingView>
 
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
const styles = {
  container: {
    padding: 20,
    
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
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  registerLink: {
    marginTop: 10,
    color: 'blue',
    justifyContent:'flex-end',
  },
  registercontainer: {
    flex: 1,
     justifyContent: 'flex-end', // 从顶部开始
    alignItems: 'right',
    paddingBottom: 30, // 顶部距离
    paddingHorizontal: 20,
  },
  loginButtonContainer: {
    marginTop: 20, // 添加上边距
  
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
};

export default UserListScreen;
