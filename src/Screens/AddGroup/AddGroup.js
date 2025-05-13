import {
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import rectangle from '../../../assets/icons/rectangle.png';
import back from '../../../assets/icons/back.png';
import ellipse from '../../../assets/icons/ellipse.png';
import home from '../../../assets/icons/home.png';
import React, {useState} from 'react';
// import RNPickerSelect from 'react-native-picker-select';

export default function AddGroup() {
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownOptions = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <SafeAreaView style={styles.MainContainer}>
      <View style={styles.TopContainer}>
        <View style={styles.iconWrapperBack}>
          <Image source={rectangle} style={styles.rectangle} />
          <TouchableOpacity
            style={styles.backIconWrapper}
            onPress={() => navigation.goBack()}>
            <Image source={back} style={styles.Back} />
          </TouchableOpacity>
        </View>

        <View style={styles.iconWrapperBack}>
          <Image source={ellipse} style={styles.ellipse} />
          <TouchableOpacity
            style={styles.backIconWrapper}
            onPress={() => navigation.home()}>
            <Image source={home} style={styles.home} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.SecondContainer}>
          <Text style={styles.GroupText}>Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
            placeholderTextColor="#888"
          />

          {/* <RNPickerSelect
          onValueChange={value => setSelectedOption(value)}
          items={[
            {label: 'Option 1', value: 'option1'},
            {label: 'Option 2', value: 'option2'},
            {label: 'Option 3', value: 'option3'},
          ]}
          placeholder={{label: 'Select an option', value: null}}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
          value={selectedOption}
        /> */}

          <Text style={styles.GroupText}>Category</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Text style={styles.dropdownHeaderText}>
              {selectedOption || 'Category'}
            </Text>
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              <FlatList
                data={dropdownOptions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedOption(item);
                      setIsDropdownOpen(false);
                    }}>
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    backgroundColor: 'rgb(226, 225, 230)',
  },
  TopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconWrapperBack: {
    position: 'relative',
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangle: {
    width: 42,
    height: 42,
  },
  ellipse: {
    width: 50,
    height: 50,
  },
  backIconWrapper: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  Back: {
    width: 21,
    height: 21,
  },
  home: {
    width: 25,
    height: 25,
    tintColor: '#ffffff',
  },
  SecondContainer: {
    marginTop: 100,
  },
  GroupText: {
    color: 'Black',
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#999',
    fontSize: 20,
    color: '#000',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  // picker: {
  //   height: 50,
  //   borderColor: '#999',
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   paddingHorizontal: 10,
  //   justifyContent: 'center',
  //   backgroundColor: '#fff',
  //   color: '#333',
  // },

  dropdownHeader: {
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  dropdownHeaderText: {
    fontSize: 20,
    color: '#000',
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 15,
    marginTop: 5,
    backgroundColor: '#fff',
    maxHeight: 150,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});
