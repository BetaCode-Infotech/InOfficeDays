import React from 'react';
import {TouchableOpacity, Image, View} from 'react-native';

const ImageIcon = ({containerStyle, icon, iconStyle, tintColor}) => {
  return (
    <View style={{...containerStyle}}>
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
    </View>
  );
};

export default ImageIcon;
