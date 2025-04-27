import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

const IconButton = ({containerStyle, icon, iconStyle, onPress, tintColor}) => {
  return (
    <TouchableOpacity style={{...containerStyle}} onPress={onPress}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 30,
          height: 30,
          tintColor: tintColor,
          ...iconStyle,
        }}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
