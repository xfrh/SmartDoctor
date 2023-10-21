import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Dimensions, Platform,TouchableOpacity,ActivityIndicator  } from 'react-native';
import { Camera } from 'expo-camera';
import { AntDesign, MaterialIcons,FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

const UploadImageScreen =({route,navigation})=> {
  //  camera permissions
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();
  const headers = {
    'Authorization': `Bearer ${accessToken}`, 
    'Content-Type': 'application/json', 
  };
  const {id,otherparams} = route.params;
  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');  // default is 4:3
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] =  useState(false);
  const[designedHeight,setDesignHeight] =useState(height);
  const isFocused = useIsFocused();
  // on screen  load, ask for permission to use the camera
  useEffect(() => {
    setIsLoading(false);
    if (isFocused) {
      onHandlePermission();
    
    }
    
  }, [isFocused]);

  const onHandlePermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === 'granted');
    
   };
   const handeDelete= async () =>{
    await AsyncStorage.getItem('serverUrl').then( async (apiUrl)=>{ 
      await axios.delete(`http://${apiUrl}/inspections/${id}`,{headers} )
    });
  };

   const handleback=() =>{
    navigation.navigate("UserList");
  };

  const handleforward= async()=>{
      await AsyncStorage.getItem('serverUrl').then( (apiUrl)=>{ 
         axios.get(`http://${apiUrl}/inspections/${id}`,{headers} ).then(response=>{
          let item =response.data;
          navigation.navigate('DetailView', { "item":item })

         })
    });
  };
  const toggleFlashlight = async () => {
    if (camera.current) {
      if (flashMode === Camera.Constants.FlashMode.off) {
        setFlashMode(Camera.Constants.FlashMode.torch); // 打开闪光灯
      } else {
        setFlashMode(Camera.Constants.FlashMode.off); // 关闭闪光灯
      }
    }
  };

  const onSnap = async () => {
    setIsLoading(true);
    if (camera) {
      
      const options = { quality: 1, base64: true };
      const data = await camera.takePictureAsync(options);
      const source = data.base64;
       if (source) {
        await camera.pausePreview();
         let base64Img = `data:image/jpg;base64,${source}`;
         let data = {
          file: base64Img,
          inspection_id: id,
        };
         await AsyncStorage.getItem('serverUrl').then((apiUrl)=>{ 
          fetch(`http://${apiUrl}/item/`, {
            body: JSON.stringify(data),
            headers: headers,
            method: 'POST'
          })
            .then(async response => {
                setIsLoading(false);
                let data = await response.json();
                if(data.status_code=="400"){
                   handeDelete();
                   alert(data.error);
                   handleback();
                }
                 
                else if(data.status_code=="200"){
                  alert("上传成功!");
                  // navigation.navigate('ResultList',{id:id});
                  handleforward();
                }

           
             
            })
            .catch(err => {
              alert(err);
            });
        }) 
      }
      
    }
  };

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = '4:3';  // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();
      // console.log(ratios);
      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio; 
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      const newheight=Math.round((width * desiredRatio.split(":")[0]) / desiredRatio.split(":")[1]);
      setDesignHeight(newheight);
      // set the preview padding and preview ratio
      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
       setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async() => {
    if (!isRatioSet) {
       await prepareRatio();
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <Text>Waiting for camera permissions</Text>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
         { isFocused &&<Camera
          style={[styles.container,{height: designedHeight,width: width}]}
          onCameraReady={setCameraReady}
          ratio={ratio}
          ref={(ref) => {
            setCamera(ref);
          }}>
        </Camera>}
        <View style={styles.container}>
         <View style={styles.camera}>
          
         <View style={styles.focusBox}>
         <View style={styles.cornerTopLeft}></View>
          {/* 右上角 */}
          <View style={styles.cornerTopRight}></View>
          {/* 左下角 */}
          <View style={styles.cornerBottomLeft}></View>
          {/* 右下角 */}
          <View style={styles.cornerBottomRight}></View>
          </View>
          </View>
          <View style={styles.bottomButtonsContainer}>
            <View style={styles.textContainer}>
            <Text style={styles.text}>
              请将比色卡和试剂纸放在指定区域内进行拍照
            </Text>
            </View> 
            <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.iconContainer} onPress={handleback} >
              <FontAwesome name="undo" style={styles.icon} />
              <Text style={styles.iconText}>返回</Text>
            </TouchableOpacity>
            {
              isLoading? (<ActivityIndicator size={40} color="white" />) :
            (<TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onSnap}
                    style={styles.capture}
                    disabled={isLoading}
                  />)
            }
            <TouchableOpacity style={styles.iconContainer} onPress={toggleFlashlight}>
            {flashMode === Camera.Constants.FlashMode.off ? (
              // 如果闪光灯关闭，显示打开闪光灯图标
              <FontAwesome name="flash" size={24} color="white" />
            ) : (
              // 如果闪光灯打开，显示关闭闪光灯图标
              <FontAwesome name="flash" size={24} color="yellow" />
            )}
              <Text style={styles.iconText}>闪光灯</Text>
            </TouchableOpacity>
              </View>

          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: { 
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
   },
   camera: {
    flex: 1, // 相机镜头占据整个容器
  },
  focusBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white', // 聚焦框边框颜色设置为白色
    width: '75%', // 宽度占据 borderContainer 的三分之一
    height: '60%', // 高度占据 borderContainer 的三分之一
    top: '5%', // 从顶部开始
    left: '15%', // 从左侧开始
  },

  cornerTopLeft: {
    position: 'absolute',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'red', // 锐角颜色设置为红色
    width: 16, // 锐角宽度
    height: 16, // 锐角高度
    top: 0, // 从顶部开始
    left: 0, // 从左侧开始
  },
  cornerTopRight: {
    position: 'absolute',
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: 'red', // 锐角颜色设置为红色
    width: 16, // 锐角宽度
    height: 16, // 锐角高度
    top: 0, // 从顶部开始
    right: 0, // 从右侧开始
  },
  cornerBottomLeft: {
    position: 'absolute',
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'red', // 锐角颜色设置为红色
    width: 16, // 锐角宽度
    height: 16, // 锐角高度
    bottom: 0, // 从底部开始
    left: 0, // 从左侧开始
  },
  cornerBottomRight: {
    position: 'absolute',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: 'red', // 锐角颜色设置为红色
    width: 16, // 锐角宽度
    height: 16, // 锐角高度
    bottom: 0, // 从底部开始
    right: 0, // 从右侧开始
  },
  bottomButtonsContainer: {
    flexDirection: 'column', // 垂直布局
    alignItems: 'center', // 在水平方向上居中对齐
    backgroundColor: 'black', // 背景颜色设置为黑色
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  guidelines: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderColor: 'white',
  },
  guideline: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dotted',
  },

  textContainer: {
    padding: 10,
  },
  text: {
    fontSize: 14,
    color: 'white', // 文本颜色设置为白色
  },
  iconsContainer: {
    flexDirection: 'row', // 水平布局
    justifyContent: 'space-between', // 两侧对齐
    width: '90%', // 宽度占满父容器
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    color: 'white', // 图标颜色设置为白色
    fontSize: 24,
    marginVertical: 5,
  },
  iconText: {
    color: 'white', // 说明文字颜色设置为白色
  },
  capture: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: CAPTURE_SIZE,
    width: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    marginBottom: 16,
    marginHorizontal: 30
  },
});

export default UploadImageScreen;