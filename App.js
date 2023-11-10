import 'react-native-gesture-handler';
import React  from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ForgetScreen from './screens/SmsLoginScreen';
import UserListScreen from './screens/UserListScreen';
import TestResultScreen from './screens/TestResultScreen'; 
import TestDetailScreen from './screens/TestDetailScreen';
import CustomBarScreen from './screens/CustomBarScreen';
import AboutUsScreen from './screens/AboutusScreen';
import VisualCameraScreen from './screens/VisualCameraScreen';
import NewUserScreen from './screens/NewUserScreen';
import ConfigNetScreen from './screens/ConfigNetScreen';
import ImageProcessScreen from './screens/ImageProcessScreen';
import PreviewImageScreen from './screens/PreviewImageScreen';
import LogoutScreen from './screens/logout';
import {AuthProvider } from './context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();
const App = () => {
    return (
  
    <AuthProvider>
    <NavigationContainer>
    <Drawer.Navigator initialRouteName="Home" screenOptions={{
          activeTintColor: '#e91e63',
          itemStyle: {marginVertical: 5},
        }}  drawerContent={props => <CustomBarScreen {...props} />}>

       <Drawer.Screen name="Home" component={HomeScreen} options={{title:'主页'}} />
   
        <Drawer.Screen
          name="UserList"
          component={UserListScreen}
          options={({ navigation }) => ({
            title: '人员列表',
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 25 }}
                onPress={() => navigation.navigate('AddPerson')}
              >
                <FontAwesome name="plus" size={24} color="grey" />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen name="ResultList" component={TestResultScreen} options={{title:'检验结果查询'}} />
        <Drawer.Screen name="NetUrl" component={ConfigNetScreen} options={{title:'设置服务器地址'}} />
         <Drawer.Screen name="AboutUs" component={AboutUsScreen} options={{title:'关于我们'}} />
        
          <Drawer.Screen name="Upload" component={VisualCameraScreen} options={{ title:'拍照', drawerItemStyle: { height: 0 }}} /> 
         
         <Drawer.Screen name="AddPerson" component={NewUserScreen} options={{ title:'新建受检人', drawerItemStyle: { height: 0 }}} />
         <Drawer.Screen name="Logout" component={LogoutScreen} options={{title:'退出登录'}} />
        
         <Drawer.Screen name="Login" component={LoginScreen} options={{ title:'登录系统', drawerItemStyle: { height: 0 }}} />
        <Drawer.Screen name="Forget" component={ForgetScreen} options={{ title:'重置密码', drawerItemStyle: { height: 0 }}} />
         <Drawer.Screen name="DetailView" component={TestDetailScreen} options={{ title:'检查结果', drawerItemStyle: { height: 0 }}} />
         <Drawer.Screen name="ImageProcess" component={ImageProcessScreen} options={{ title:'检测图片', drawerItemStyle: { height: 0 }}} />
         <Drawer.Screen name="ImagePreview" component={PreviewImageScreen} options={{ title:'', drawerItemStyle: { height: 0 }}} />
  

      </Drawer.Navigator>
    </NavigationContainer>
   
    </AuthProvider>
  
  );
};


export default App;

