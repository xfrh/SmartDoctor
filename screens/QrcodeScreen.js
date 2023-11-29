import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const QRCodeScreen = () => {
 
  const qrcodeImagePath = require('.././assets/apkDownload.png');

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Scan the QR Code below:</Text>
      <Image source={qrcodeImagePath} style={styles.qrcodeImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
  },
  qrcodeImage: {
    width: 200,
    height: 200,
  },
});

export default QRCodeScreen;
