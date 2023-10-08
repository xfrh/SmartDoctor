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
  const isFocused = useIsFocused();
  const {id,otherparams} = route.params;
  const { accessToken } = useAuth();
  const headers = {
    'Authorization': `Bearer ${accessToken}`, 
    'Content-Type': 'application/json', 
  };

  useEffect(() => {
    if (isFocused) {
       onHandlePermission();
     }
   
  }, [isFocused]);
 

  const onHandlePermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
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
  const toggleFlashlight = async () => {
    if (cameraRef.current) {
      if (flashMode === Camera.Constants.FlashMode.off) {
        setFlashMode(Camera.Constants.FlashMode.torch); // 打开闪光灯
      } else {
        setFlashMode(Camera.Constants.FlashMode.off); // 关闭闪光灯
      }
    }
  };

  const onSnap = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      const options = { quality: 0.7, base64: true };
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
                  navigation.navigate('ResultList',{id:id});
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
        style={styles.container}
        type={cameraType}
        useCamera2Api={true}
        flashMode={flashMode} // 闪光灯状态
       
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
    height: '75%', // 高度占据 borderContainer 的三分之一
    top: '2%', // 从顶部开始
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