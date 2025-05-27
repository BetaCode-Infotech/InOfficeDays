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
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import locationIcon from '../../../assets/icons/gps.png';
import down from '../../../assets/icons/arrow_drop_down.png';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Header from '../../../components/Header/Header';

export default function AddLocation() {
  const navigation = useNavigation();
  const [locationName, setLocationName] = useState('');
  const [googleLocation, setGoogleLocation] = useState('');
  const [radius, setRadius] = useState('Select Radius');
  const [showDropdown, setShowDropdown] = useState(false);

  const radiusOptions = [
    {label: '500m', icon: locationIcon},
    {label: '1km', icon: locationIcon},
    {label: '5km', icon: locationIcon},
    {label: '10km', icon: locationIcon},
  ];

  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleSelectRadius = value => {
    setRadius(value.label);
    setShowDropdown(false);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header showBack={true} showHome={true} title="Add Location" />
      <ScrollView style={{paddingHorizontal: 10}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Location Name */}
          <View style={{marginTop: 20, gap: 1}}>
            <Text style={styles.label}>Location Name *</Text>
            <TextInput
              style={styles.cardInput}
              placeholder="Enter location name"
              placeholderTextColor="#aaa"
              value={locationName}
              onChangeText={setLocationName}
            />

            {/* Google Location */}
            <Text style={[styles.label, {marginTop: 20}]}>Location *</Text>
            <TextInput
              style={styles.cardInput}
              placeholder="Search for a location"
              placeholderTextColor="#aaa"
              value={googleLocation}
              onChangeText={setGoogleLocation}
              // Integrate Google Places API here
            />

            {/* Radius Dropdown */}
            <Text style={[styles.label, {marginTop: 20}]}>Radius *</Text>
            <TouchableOpacity
              style={[
                styles.cardInput,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}
              onPress={() => setShowDropdown(!showDropdown)}>
              <Text
                style={{color: radius === 'Select Radius' ? '#aaa' : '#000'}}>
                {radius}
              </Text>
              <Image
                source={down}
                style={{width: 20, height: 20, tintColor: '#999'}}
              />
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownCard}>
                <FlatList
                  data={radiusOptions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.itemContainer}
                      onPress={() => handleSelectRadius(item)}>
                      <Image source={item.icon} style={styles.itemIcon} />
                      <Text style={styles.itemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* Submit Button */}
            <View style={styles.bottomButtonContainer}>
              <Animated.View
                style={[
                  styles.bottomButtonContainer,
                  {transform: [{scale: scaleValue}]},
                ]}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => console.log('Submit pressed')}
                  style={styles.bottomButton}>
                  <Text style={styles.bottomButtonText}>Save</Text>
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  cardInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  bottomButtonContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    backgroundColor: '#5409DA',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 50,
    shadowColor: '#5409DA',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
