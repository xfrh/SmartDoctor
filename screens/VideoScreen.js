import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet,Text,Button } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native'; 
import Video from 'react-native-video';


const VideoScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const videoRef = useRef(null);
  const { accessToken } = useAuth();

  if(accessToken==null)
  return (
    <View style={styles.container}>
      <Text>还没登录?</Text>
      <Button
        title="登录系统"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );


  return (
    <View style={styles.container}>
      {isFocused && (
        <Video
          ref={videoRef}
          source={require('.././assets/sample.mp4')}
          style={styles.video}
          controls={true}
          resizeMode="contain"
          // 在组件加载时自动播放
          onLoad={() => videoRef.current?.seek(0)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default VideoScreen;
