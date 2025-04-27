import React from 'react';

import {
  View,
  Pressable,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ScreenNamesList} from './ScreenNamesList';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {COLORS} from '../../../constants/theme';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const {width} = Dimensions.get('window');

const CustomBottomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.mainContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            key={index}
            style={styles.mainItemContainer}
            onPress={onPress}>
            <View
              style={{
                alignItems: 'center',
              }}>
              {/* <ImageIcon
                icon={ScreenNamesList[index].icon}
                iconStyle={{
                  height: 25,
                  width: 25,
                  tintColor: isFocused ? '#4581e5' : COLORS.gray50,
                }}
              /> */}
              <Icon
                name={ScreenNamesList[index].icon}
                size={25}
                color={isFocused ? '#21a3f1' : COLORS.gray50}
              />
              <Text
                style={{
                  color: isFocused ? '#4581e5' : COLORS.gray50,
                }}>
                {ScreenNamesList[index].label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 20,
  },
  mainItemContainer: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,

    padding: 5,
    backgroundColor: '#fff',
  },
});

export default CustomBottomTabBar;
