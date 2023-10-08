import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 

const RegisterScreen = ({ navigation }) => {
  const [mobilenum, setMobilenum] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      // 在页面获得焦点时重置搜索文本
      setMobilenum('');
      setPassword('');
      setVerificationCode('');
      setErrorMessage('');
      setIsCodeSent(false);
    }, [])
  );

  // 处理验证码输入的函数
  const handleVerificationCodeChange = (text) => {
    setVerificationCode(text);
  };

  // 处理获取验证码按钮点击的函数
  const handleGetCodePress = () => {
    // 在此处触发发送验证码的逻辑
    // 通常这里会发送请求到服务器，然后等待短信验证码的响应
    // 在示例中，我们简单地将验证码设置为随机的6位数字
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    setVerificationCode(randomCode.toString());
    setIsCodeSent(true);
  };

  const handleRegister = () => {
    const phoneNumberPattern = /^1[3|4|5|6|7|8][0-9]{9}$/;
    if (!phoneNumberPattern.test(mobilenum)) {
      setErrorMessage('请输入有效的手机号');
      return;
    }
    
    if(verificationCode==''){
      setErrorMessage('请输入有效的验证码');
      return;
    }

    // 检查密码是否不少于6位
    if (password.length < 6) {
      setErrorMessage('密码不能少于6位');
      return;
    }

    setErrorMessage('');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
        <View style={styles.textContainer}>
        <Text style={[styles.text, styles.greenBorder]}>
          请设置6-16位密码,包含数字、符号、字母（区分大小写），不允许有空格
        </Text>
       
      </View>

      <TextInput
        placeholder="请输入手机号"
        value={mobilenum}
        onChangeText={setMobilenum}
        style={styles.input}
      />
        <View style={styles.registerContainer}>
      <TextInput
        placeholder="输入验证码"
        value={verificationCode}
        onChangeText={handleVerificationCodeChange}
        style={styles.inputVcode}
      />
      <TextInput
        editable={false}
        value={!isCodeSent ? '获取验证码' : '验证码已发送'}
        onTouchStart={handleGetCodePress}
        style={[styles.inputVcode, styles.codeButton]}
      />
    </View>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {/* 错误消息 */}
     {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <Button title="注册" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:80,
  },
  registerContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
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
  inputVcode:{
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '40%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1, // 边框宽度
    borderColor: '#ccc', // 边框颜色，浅灰色
    backgroundColor: '#f5f5f5', // 设置浅灰色的背景
  },
  textContainer: {
    width:'80%',
    marginBottom: 20,
  },
  greenBorder: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    padding: 10,
    color:'green',
  },
  codeButton: {
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RegisterScreen;
