import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {COLORS} from '../../constants/theme';

const Paginator = ({data, scrollX}) => {
  const {width} = useWindowDimensions();
  return (
    <View
      style={{flexDirection: 'row', height: 64, backgroundColor: COLORS.white}}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[styles.dot, {width: dotWidth}]}
            key={i.toString()}></Animated.View>
        );
      })}
      {/* <Text>Paginator</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#493d8a',
    marginHorizontal: 8,
  },
});
export default Paginator;
