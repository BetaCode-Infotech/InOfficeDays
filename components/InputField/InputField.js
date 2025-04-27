import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import ImageIcon from '../ImageIcon/ImageIcon';
import {COLORS} from '../../constants/theme';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  onChangeText,
  isDisable,
  value,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        // paddingBottom: 8,
        // marginBottom: 20,
        marginTop: 10,
        backgroundColor: '#fff',
        height: 45,
        shadowColor: '#FFF',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 5,
      }}>
      {icon && (
        <ImageIcon
          icon={icon}
          iconStyle={{
            height: 40,
            width: 15,
            marginLeft: 10,
            marginRight: 5,
          }}
          tintColor={COLORS.gray30}
        />
      )}
      {inputType == 'password' ? (
        <TextInput
          placeholder={label}
          placeholderTextColor={COLORS.gray50}
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0, color: COLORS.black}}
          secureTextEntry={true}
          onChangeText={onChangeText}
        />
      ) : (
        <TextInput
          placeholder={label}
          placeholderTextColor={COLORS.gray50}
          value={value}
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0, color: COLORS.black}}
          onChangeText={onChangeText}
          editable={isDisable}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{color: '#21a3f1', fontWeight: '700'}}>
          {fieldButtonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
