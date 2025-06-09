import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {connect} from 'react-redux';

const ProfileEdit = props => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: '#f7f7f9',
      }}>
      <ScrollView style={[styles.container]}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            },
          ]}>
          {/* <Toast position="top" topOffset={0} config={toastConfig} /> */}
        </View>
        <View>
          {props.AUTH_DATA?.NEW_USER == false && (
            <IconButton
              icon={Icons.back}
              containerStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                width: 40,
                height: 40,
                borderRadius: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
              }}
              iconStyle={{tintColor: '#fff'}}
              onPress={() => navigation.navigate(PROFILE_VIEW)}
            />
          )}
        </View>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps)(ProfileEdit);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f9',
    padding: 16,
  },
  label: {
    color: '#4a4a4a',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
});
