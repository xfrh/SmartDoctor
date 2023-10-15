import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { useIsFocused } from '@react-navigation/native'; 
import { Camera } from 'expo-camera';
import { AntDesign, MaterialIcons,FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

 const UploadImageScreen =({route,navigation})=> {
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [ratio, setRatio] = useState('4:3'); 
  const [isRatioSet, setIsRatioSet] =  useState(false);
  const [imagePadding, setImagePadding] = useState(0);
  const[designedHeight,setDesignedHeight] = useState(0);
  const isFocused = useIsFocused();
  const {id,otherparams} = route.params;
  const { accessToken } = useAuth();
  const headers = {
    'Authorization': `Bearer ${accessToken}`, 
    'Content-Type': 'application/json', 
  };
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  useEffect(() => {
    setIsRatioSet(false);
    setIsLoading(false);
    if (isFocused) {
       onHandlePermission();
     }
   
  }, [isFocused]);
 

  const onHandlePermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
   };

   const prepareRatio = async () => {
    let desiredRatio = '4:3';  // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await cameraRef.current.getSupportedRatiosAsync();
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
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      setRatio(desiredRatio);
      setDesignedHeight(Math.round((width * desiredRatio.split(":")[0]) / desiredRatio.split(":")[1]));
      // console.log(desiredRatio);
      // Set a flag so we don't do this 
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

 
  const setCameraReady = async() => {
   
    if (!isRatioSet) {
    
      await prepareRatio();
    }
  };

  const switchCamera = () => {
    setCameraType(prevCameraType =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
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
    if (cameraRef.current) {
      if (flashMode === Camera.Constants.FlashMode.off) {
        setFlashMode(Camera.Constants.FlashMode.torch); // 打开闪光灯
      } else {
        setFlashMode(Camera.Constants.FlashMode.off); // 关闭闪光灯
      }
    }
  };

  const handleFocus = async (event) => {
    if (!isFocusing && cameraRef.current) {
      setIsFocusing(true);
      const { pointX, pointY } = event.nativeEvent;
      try {
        alert("here");
        await cameraRef.current.focusAtPoint(pointX, pointY);
        setIsFocusing(false);
      } catch (e) {
        console.error('聚焦失败:', e);
        setIsFocusing(false);
      }
    }
  };

  const onSnap = async () => {
    setIsLoading(true);
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.base64;
       if (source) {
        await cameraRef.current.pausePreview();
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
          
            });
        }) 
      }
      
    }
  };

 
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }


  return (
   <View style={styles.container}>
       { isFocused &&<Camera
        ref={cameraRef}
        style={[styles.container, {height: designedHeight,width: width}]}
        type={cameraType}
        useCamera2Api={true}
        flashMode={flashMode}
        ratio={ratio}
        onCameraReady={setCameraReady}
        />}

          <View style={styles.container}>
            
              {/* <View style={styles.bottomButtonsContainer}>
              <View>
                  <Text>请将比色卡和试剂纸放在指定区域内进行拍照</Text>
                </View>
                <TouchableOpacity onPress={switchCamera}>
                  <AntDesign name="back" size={28} color="white" />
                </TouchableOpacity>
                <Text>返回</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onSnap}
                  style={styles.capture}
                />
                <TouchableOpacity onPress={switchCamera}>
                <FontAwesome name="flash" size={28} color="white" />
                </TouchableOpacity>
                <Text>闪光灯</Text>
              </View> */}
      
      <View style={styles.camera}>
  {/* 正方形的聚焦框 */}
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


const styles = StyleSheet.create({
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
    width: '100%', // 宽度占满父容器
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


  // overlay: {
  //   flex: 1,
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // bottomButtonsContainer: {
  //   position: 'absolute',
  //   flexDirection: 'row',
  //   bottom: 28,
  //   width: '100%',
  //   alignItems: 'center',
  //   alignContent:'center'
  // },
  // grid: {
  //   flex: 1,
  //   borderColor: 'white',
  //   borderWidth: 5,
  // },
  // closeButton: {
  //   position: 'absolute',
  //   top: 35,
  //   right: 20,
  //   height: 50,
  //   width: 50,
  //   borderRadius: 25,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#5A45FF',
  //   opacity: 0.7
  // },
  capture: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: CAPTURE_SIZE,
    width: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    marginBottom: 16,
    marginHorizontal: 30
  },
  // focusBox: {
  //   position: 'absolute',
  //   borderColor: 'red',
  //   borderWidth: 2,
  //   // 矩形框的其他样式属性
  // },

  // cameraContent: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // captureButton: {
  //   width: 60,
  //   height: 60,
  //   borderRadius: 30,
  //   backgroundColor: 'white',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // captureButtonInner: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   backgroundColor: 'red',
  // },
});

export default UploadImageScreen;