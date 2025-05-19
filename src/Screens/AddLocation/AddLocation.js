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
import location from '../../../assets/icons/gps.png';
import down from '../../../assets/icons/arrow_drop_down.png';

// import Progress from 'react-native-progress';
import BottomTabNavigator from '../../navigator/BottomNavigator/BottomNavigator';

export default function AddLocation() {
  const navigation = useNavigation();
  const [locationName, setLocationName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isDropdownOpenLocation, setIsDropdownOpenLocation] = useState(false);
  const [isDropdownOpenRadius, setIsDropdownOpenRadius] = useState(false);
  const categoryOptionsLocation = ['Option 1', 'Option 2', 'Option 3'];
  const categoryOptionsRadius = ['Data 1', 'Data 2', 'Data 3'];
  const [locationProgress, setLocationProgress] = useState(0.6);

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
          <Text style={styles.LocationText}>Location Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={locationName}
            onChangeText={setLocationName}
            placeholderTextColor="#000"
          />

          <Text style={styles.LocationText}>Location</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setIsDropdownOpenLocation(!isDropdownOpenLocation)}>
            <Text style={styles.dropdownHeaderText}>
              {selectedOption || 'Location'}
            </Text>
            <Image source={down} style={styles.arrowIcon} />
            {/* <View style={styles.progressWrapper}>
              <Progress.Bar
                progress={0.6} // You can change this value dynamically
                width={5}
                height={30}
                color="#4B7BE5"
                unfilledColor="#e0e0e0"
                borderWidth={0}
                // style={{transform: [{rotate: '90deg'}]}}
              />
            </View> */}
            <View style={styles.verticalProgressBarContainer}>
  <View style={styles.verticalProgressBackground}>
    <View style={[styles.verticalProgressFill, { height: `${locationProgress * 100}%` }]} />
  </View>
</View>
            <Image source={location} style={styles.locationIcon} />
          </TouchableOpacity>

          {isDropdownOpenLocation && (
            <View style={styles.dropdownList}>
              <FlatList
                data={categoryOptionsLocation}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedOption(item);
                      setIsDropdownOpenLocation(false);
                    }}>
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <Text style={styles.LocationText}>Radius</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setIsDropdownOpenRadius(!isDropdownOpenRadius)}>
            <Text style={styles.dropdownHeaderText}>
              {selectedOption || 'Radius'}
            </Text>
            <Image source={down} style={styles.arrowIconRadius} />
          </TouchableOpacity>

          {isDropdownOpenRadius && (
            <View style={styles.dropdownList}>
              <FlatList
                data={categoryOptionsRadius}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedOption(item);
                      setIsDropdownOpenRadius(false);
                    }}>
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
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
    flex: 1,
    marginTop: 5,
  },
  LocationText: {
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
    right: 45,
    top: '50%',
    marginTop: -15,
  },
  arrowIconRadius: {
    width: 30,
    height: 30,
    tintColor: '#555',
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -15,
  },
  locationIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 10,
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

  verticalProgressBarContainer: {
  position: 'absolute',
  right: 40, // Adjust based on layout
  top: '50%',
  marginTop: -15,
  width: 6,
  height: 30,
  justifyContent: 'flex-end',
  alignItems: 'center',
},

verticalProgressBackground: {
  width: 4,
  height: '100%',
  backgroundColor: '#ccc',
  borderRadius: 2,
  overflow: 'hidden',
},

verticalProgressFill: {
  backgroundColor: '#4B7BE5',
  width: '100%',
  borderRadius: 2,
  position: 'absolute',
  bottom: 0,
},
});
