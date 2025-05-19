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
import down from '../../../assets/icons/arrow_drop_down.png';
import BottomTabNavigator from '../../navigator/BottomNavigator/BottomNavigator';

export default function AddGroup() {
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
  const [isDropdownOpenFrequency, setIsDropdownOpenFrequency] = useState(false);
  const categoryOptionsGroup = ['Option 1', 'Option 2', 'Option 3'];
  const categoryOptionsFrequency = ['Data 1', 'Data 2', 'Data 3'];

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
            placeholderTextColor="#000"
          />

          <Text style={styles.GroupText}>Category</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setIsDropdownOpenCategory(!isDropdownOpenCategory)}>
            <Text style={styles.dropdownHeaderText}>
              {selectedOption || 'Category'}
            </Text>
            <Image source={down} style={styles.arrowIcon} />
          </TouchableOpacity>

          {isDropdownOpenCategory && (
            <View style={styles.dropdownList}>
              <FlatList
                data={categoryOptionsGroup}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedOption(item);
                      setIsDropdownOpenCategory(false);
                    }}>
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <Text style={styles.GroupText}>Milestone Frequency</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() =>
              setIsDropdownOpenFrequency(!isDropdownOpenFrequency)
            }>
            <Text style={styles.dropdownHeaderText}>
              {selectedOption || 'Milestone Frequency'}
            </Text>
            <Image source={down} style={styles.arrowIcon} />
          </TouchableOpacity>

          {isDropdownOpenFrequency && (
            <View style={styles.dropdownList}>
              <FlatList
                data={categoryOptionsFrequency}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedOption(item);
                      setIsDropdownOpenFrequency(false);
                    }}>
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <Text style={styles.GroupText}>Milestone Days</Text>
          <TextInput
            style={styles.input}
            placeholder="Milestone Days"
            value={groupName}
            onChangeText={setGroupName}
            placeholderTextColor="#000"
          />
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => console.log('Submit pressed')}>
          <Text style={styles.bottomButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    backgroundColor: 'White',
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
    marginTop: 50,
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

  dropdownHeader: {
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  arrowIcon: {
    width: 30,
    height: 30,
    tintColor: '#555',
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -15,
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

  bottomButtonContainer: {
    marginTop: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomButton: {
    backgroundColor: '#4B7BE5',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '50%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
