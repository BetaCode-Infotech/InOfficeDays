import React, {FunctionComponent, useEffect, useRef} from 'react';
import {View, StyleSheet, Pressable, Text, Animated, Image} from 'react-native';
import {COLORS} from '../../constants/theme';

const AnimatedIconButton = ({onPress, iconStyle, icon, label, labelStyle}) => {
  const animatedScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedScale.setValue(1);
  }, []);

  const handleOnPress = () => {
    animatedScale.setValue(0.8);
    Animated.spring(animatedScale, {
      toValue: 1,
      bounciness: 24,
      speed: 20,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      onPress();
    }, 100);
  };

  return (
    <View style={style.container}>
      <Pressable
        onPress={() => {
          handleOnPress();
        }}>
        <Animated.View style={[{transform: [{scale: animatedScale}]}]}>
          {!label && (
            <Image
              source={icon}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                // tintColor: tintColor,
                ...iconStyle,
              }}
            />
          )}
          {label && (
            <View
              style={{
                ...labelStyle,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text
                style={{color: COLORS.white, fontWeight: 'bold', fontSize: 17}}>
                {label}
              </Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'purple',
    width: 200,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
  },
});

export default AnimatedIconButton;
