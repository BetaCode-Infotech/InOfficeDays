import React from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from '../../constants/Icons';
import {DASHBOARD} from '../../src/utils/Routes/Routes';
import IconButton from '../IconButton/IconButton';

export default function Header({
  showBack = false,
  showHome = false,
  title = '',
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.headerCard}>
      <View style={styles.container}>
        {showBack ? (
          // <TouchableOpacity
          //   onPress={() => navigation.goBack()}
          //   style={styles.iconWrapper}>
          //   <Image source={Icons.back} style={styles.icon} />
          // </TouchableOpacity>
          <IconButton
            icon={Icons.back}
            onPress={() => navigation.goBack()}
            iconStyle={styles.icon}
            containerStyle={styles.iconWrapper}
          />
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <Text style={styles.title}>{title}</Text>

        {showHome ? (
          <TouchableOpacity
            onPress={() => navigation.navigate(DASHBOARD)}
            style={styles.iconWrapper}>
            <Image
              source={Icons.home}
              style={[styles.icon, { width: 20, height: 20}]}  
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: '#fff',
    // borderRadius: 12,
    // margin: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    padding: 6,
    backgroundColor: '#f2f2f2',
    borderRadius: 50,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconPlaceholder: {
    width: 36, // match the iconWrapper space
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
