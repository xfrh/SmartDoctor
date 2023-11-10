import React, { useState, useRef,useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Dimensions,ActivityIndicator,Image } from 'react-native';
import { Camera,useCameraDevice,useCameraPermission,useCameraFormat } from 'react-native-vision-camera';
import { AntDesign, MaterialIcons,FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native'; 
import ImgToBase64 from 'react-native-image-base64';


const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

const  VisualCameraScreen=({route,navigation})=> {
  const device = useCameraDevice('back')
  const isFocused = useIsFocused()
  const camera = useRef(null)
  const { hasPermission, requestPermission } = useCameraPermission()
  const [cameraPerm, setCameraPerm] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [flashMode, setFlashMode] = useState("off");
  const[photo,setPhoto]=useState(null);
  const {id,otherparams} = route.params;
  const { accessToken } = useAuth();
  const headers = {
    'Authorization': `Bearer ${accessToken}`, 
    'Content-Type': 'application/json', 
  };

  useEffect(() => {
    setIsLoading(false);
    if (isFocused) {
     
      onHandlePermission();
    }
   
    
  }, [isFocused]);

  const onHandlePermission = async () => {

    await Camera.requestCameraPermission();
    await requestPermission()

    const cameraPermission = await Camera.getCameraPermissionStatus();
    setCameraPerm(cameraPermission)

   };
   const toggleFlashlight = async () => {
    if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("off");
    }
    
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



  const onSnap = ()=>{
    setIsLoading(true);
    setTimeout(() => {
      takePhoto();
     }, 1000); 
  };

  const takePhoto = async () => {
   
     const photo = await camera.current.takePhoto({
       flash: flashMode,
       qualityPrioritization: "quality"
    });
    
         
    const base64String = await ImgToBase64.getBase64String(`file://${photo.path}`);

    let base64Img = `data:image/jpg;base64,${base64String}`;
    let data = {
      file: base64Img,
      inspection_id: id,
     
    };

    const apiUrl=await AsyncStorage.getItem('serverUrl');

    fetch(`http://${apiUrl}/item/`, {
            body: JSON.stringify(data),
            headers: headers,
            method: 'POST',
           
          })
            .then(async response => {
              
                let data = await response.json();
                if(data.status_code=="400"){
                  setIsLoading(false);
                  handeDelete();
                  alert(data.error);
                //  handleback();
                
                }
                 
                else if(data.status_code=="200"){
                 
                  setIsLoading(false);
                  alert("上传成功!");
             
                  handleforward();
                 
                
                }
            
            })
            .catch(err => {
            
              setIsLoading("false");
              handeDelete();
              alert("拍照不成功,请重试: " + err.message);
              handleback();
             
            });


    
  }


  if (cameraPerm === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    );
  } 
  
  if (device == null) 
     return <View><Text>Loading</Text></View>
  
  return (
    <View style={styles.container}>
          { isFocused && <Camera
        
          ref={camera}
          style={{flex:1}}
          device={device}
          isActive={isFocused}
          photo={true}
          torch={flashMode}
          />}
           
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
            {flashMode === "off" ? (
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

export default VisualCameraScreen;
