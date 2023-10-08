import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
const SmsLoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCounting, setIsCounting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const startCountdown = () => {
    setIsCounting(true);
    setCountdown(60);
  };

  useFocusEffect(
    React.useCallback(() => {
      // 在页面获得焦点时重置搜索文本
      setPhoneNumber('');
      setIsCounting(false);
      setVerificationCode('');
      setErrorMessage('');
      setCountdown(60);
    }, [])
  );


  useEffect(() => {
    let timer;
    if (isCounting) {
      timer = setInterval(() => {
        if (countdown === 0) {
          setIsCounting(false);
          clearInterval(timer);
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCounting, countdown]);

  const handleSendCode = () => {
    // 在实际应用中，这里可以添加发送验证码的逻辑
    // 并根据返回结果来判断是否开始倒计时
    startCountdown();
  };

  const navigateToHome =() =>{
    navigation.navigate('Home');
  };

  const handleLogin = () => {
    // 处理短信登录逻辑

    const phoneNumberPattern = /^1[3|4|5|6|7|8][0-9]{9}$/;
    if (!phoneNumberPattern.test(phoneNumber)) {
      setErrorMessage('请输入有效的手机号');
      return;
    }
    
    if(verificationCode==''){
      setErrorMessage('请输入有效的验证码');
      return;
    }

      // 检查密码是否不少于6位
      if (newpassword.length < 6) {
        setErrorMessage('密码不能少于6位');
        return;
      }


      
      setErrorMessage('');
      navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="请输入新密码"
        value={newpassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="请输入手机号"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <View style={styles.codeInputContainer}>
        <TextInput
          placeholder="请输入短信验证码"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="numeric"
          style={styles.codeInput}
        />
       <TouchableOpacity onPress={handleSendCode} disabled={isCounting}>
          <Text style={styles.getCodeText}>
            {isCounting ? `倒计时 ${countdown} 秒` : '获取验证码'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginButtonContainer}>
      {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        <Button title="登录" onPress={handleLogin} />
      </View>
       </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registercontainer: {
    flex: 1,
     justifyContent: 'flex-end', // 从顶部开始
    alignItems: 'right',
    paddingBottom: 30, // 顶部距离
    paddingHorizontal: 20,
  },
  codeInput: {
    padding: 10,
    borderBottomWidth: 1, // 添加底部边框
    borderColor: 'gray', // 边框颜色
    marginRight: 10,
  },
  loginButtonContainer: {
    marginTop: 20, // 添加上边距
  
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SmsLoginScreen;
