import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import AnimatedLoader from 'react-native-animated-loader';

const Loader = ({visible, Label}) => {
  return (
    <View>
      <AnimatedLoader
        visible={visible}
        overlayColor="rgba(0,0,0,0.75)"
        source={require('../../assets/lottie/clock-time.json')}
        animationStyle={styles.lottie}
        speed={1}>
        {/* <Text>{Label}</Text> */}
      </AnimatedLoader>
    </View>
  );
};
const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 150,
  },
});

export default Loader;
