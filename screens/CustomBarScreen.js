
import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';




const CustomBarScreen = (props) => {
   return (
    <SafeAreaView style={{flex: 1}}>
      {/*Top Large Image */}
      <Image
       source={require('.././assets/user.png')}
        style={styles.sideMenuProfileIcon}
      />
      <Text style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey'
        }}>Hello</Text>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}  />
        <View style={styles.customItem}>
          <Text
            onPress={() => {
              Linking.openURL('https://aboutreact.com/');
            }}>
            分享应用
          </Text>
          <Image
              source={require('.././assets/share.png')}
            style={styles.iconStyle}
          />
        </View>
       
      </DrawerContentScrollView>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey'
        }}>
        www.aboutreact.com
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomBarScreen;