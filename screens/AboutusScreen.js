import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AboutUsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.paragraph}>
        Welcome to our organization! We are dedicated to [briefly describe your organization's mission or purpose].
      </Text>
      <Text style={styles.paragraph}>
        Our team is passionate about [describe what your organization is passionate about or its core values].
      </Text>
      <Text style={styles.paragraph}>
        Founded in [year], we have been [briefly describe your organization's history and achievements].
      </Text>
      <Text style={styles.paragraph}>
        If you have any questions or would like to get in touch, please don't hesitate to contact us at [contact email/phone].
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
  },
});

export default AboutUsPage;
