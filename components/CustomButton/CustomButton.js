import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default function CustomButton({
  label,
  onPress,
  color,
  containerStyle,
  disabled,
  textColor,
  gradient,
  data,
}) {
  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      style={{
        backgroundColor: color,
        // padding: 10,`
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 30,
        marginTop: 20,
        ...containerStyle,
      }}>
      {gradient && data && (
        <LinearGradient
          colors={['#0084ff', '#00417f', '#000']}
          start={{x: 0.0, y: 0.45}}
          end={{x: 0.95, y: 1.0}}
          locations={[0, 0.4, 1.3]}
          style={{width: '100%', height: '100%', justifyContent: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 16,
              color: textColor != undefined ? textColor : '#fff',
            }}>
            {label}
          </Text>
        </LinearGradient>
      )}
      {gradient && !data && (
        <LinearGradient
          colors={['#00417f', '#0084ff', '#e5acf0']}
          start={{x: 0.0, y: 0.45}}
          end={{x: 0.95, y: 1.0}}
          locations={[0, 0.4, 1.3]}
          style={{width: '100%', height: '100%', justifyContent: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 16,
              color: textColor != undefined ? textColor : '#fff',
            }}>
            {label}
          </Text>
        </LinearGradient>
      )}
      {gradient != true && (
        <Text
          style={{
            textAlign: 'center',
            fontWeight: '700',
            fontSize: 16,
            color: textColor != undefined ? textColor : '#fff',
          }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
