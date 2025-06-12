import {View, Text, Animated, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';

const AnimatedCard = ({children, onPress}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Animated.View
      style={[
        styles.bottomButtonContainer,
        {transform: [{scale: scaleValue}]},
      ]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={({pressed}) => [styles.bottomButton]}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedCard;

const styles = StyleSheet.create({});
