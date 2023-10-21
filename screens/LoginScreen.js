import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native'; 
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const isFocused = useIsFocused();
  useEffect(() => {
    setUsername('');
    setPassword('');
    setErrorMessage('');
  
}, [isFocused]); 


  const handleLogin = async () => {
    // const phoneNumberPattern = /^1[3|4|5|6|7|8][0-9]{9}$/;
    //  if (!phoneNumberPattern.test(mobilenum)) {
    //    setErrorMessage('请输入有效的手机号');
    //    return;
    //  }

     if(username=='') {
       setErrorMessage("用户名不为空");
       return;
     } 

     if (password.length < 6) {
       setErrorMessage('密码不能少于6位');
       return;
     }

      await AsyncStorage.getItem('serverUrl').then(async (url)=>{
       try {
          const login_url=`http://${url}/login/`;
          const response = await axios.post(login_url, {
           "username": username,
          "password" : password,
          });
        const accessToken = response.data.access_token;
        login(accessToken);
        setErrorMessage('');
        navigation.navigate('UserList');
   
       } catch (error) {
          alert(JSON.stringify(error.request));
          alert(error);
       }

    });
       
   
  };

  const navigateToRegister = () => {
    navigation.navigate('Forget');
  };
  const navigateToHome =() =>{
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
         {/* <TouchableOpacity onPress={navigateToSMS}>
        <Text style={styles.rightTop}>验证码登录</Text>
      </TouchableOpacity>  */}
      {/* <TouchableOpacity onPress={navigateToSMS}style={styles.rightTop} >
      <Text>验证码登录</Text> 
      </TouchableOpacity> */}
     
      <TextInput
        placeholder="请输入用户名"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="请输入密码"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
  {/* 错误消息 */}
     {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}

      <Button title="登 录" onPress={handleLogin} />
      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.registerLink}>忘记密码?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:30,
  },
  registercontainer: {
    flex: 1,
     justifyContent: 'flex-end', // 从顶部开始
    alignItems: 'right',
    paddingBottom: 30, // 顶部距离
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderWidth: 1, // 边框宽度
    borderColor: '#ccc', // 边框颜色，浅灰色
    backgroundColor: '#f5f5f5', // 设置浅灰色的背景
  },
  registerLink: {
    marginTop: 10,
    color: 'blue',
    justifyContent:'flex-end',
  },
  smsLink:{
   marginBottom:10,
   padding:10,
   color:'blue',
  },
  rightTop: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    // 其他样式属性
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },

});

export default LoginScreen;
