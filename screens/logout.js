import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext'
import { Ionicons } from '@expo/vector-icons';
function LogoutScreen({navigation}) {
  const { logout } = useAuth(); 

  const handleLogout = () => {
      logout();
      navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Ionicons name="exit" size={50} color="blue" />
      <Text style={styles.text}>你确定要注销吗？</Text>
      <Button title="注销" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
});

export default LogoutScreen;
