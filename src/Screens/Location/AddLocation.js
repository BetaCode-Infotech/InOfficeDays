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
  Vibration,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Axios from '../../utils/Axios';
import locationIcon from '../../../assets/icons/gps.png';
import down from '../../../assets/icons/arrow_drop_down.png';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Header from '../../../components/Header/Header';
import {Dropdown} from 'react-native-element-dropdown';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import {toastConfig, toBoolean} from '../../../constants/Fns';
import {
  getLocationByUserData,
  getTrackingByUserData,
} from '../../Redux/Action/getAllGroupData';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Config from 'react-native-config';

const DURATION = 100;
const PATTERN = [2 * DURATION, 1 * DURATION];

const AddLocation = props => {
  const navigation = useNavigation();
  const [locationName, setLocationName] = useState('');
  const [group, setGroup] = useState(null);
  const [googleLocation, setGoogleLocation] = useState('');
  const [radius, setRadius] = useState('Select Radius');
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [groupData, setGroupData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const mapRef = useRef(null);

  const groupOptions = [];

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
  const resetForm = () => {
    setLocationName('');
    setGoogleLocation('');
    setRadius('Select Radius');
    setGroup(null);
    setErrors({});
  };
  const onSave = () => {
    const newErrors = {};
    if (!locationName.trim())
      newErrors.locationName = 'Location name is required.';
    if (!googleLocation.trim())
      newErrors.googleLocation = 'Location is required.';
    if (radius === 'Select Radius') newErrors.radius = 'Radius is required.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);

    axios
      .post(Axios.axiosUrl + Axios.createLocation, {
        LOCATION_NAME: locationName,
        LOCATION: googleLocation,
        RADIUS: radius,
        GROUP_ID: group,
        USER_ID: props.AUTH_DATA?._id,
      })
      .then(response => {
        setLoading(false);

        Toast.show({
          type: 'success',
          text1: `Location Created`,
        });
        Vibration.vibrate(PATTERN);
        props.getLocationByUserData(props.AUTH_DATA?._id);
        props.getTrackingByUserData(props.AUTH_DATA?._id);
        resetForm();
      })
      .catch(err => {
        setLoading(false);

        console.log('Err', err);
        Toast.show({
          type: 'error',
          text1: `Something went wrong`,
        });
        Vibration.vibrate(PATTERN);
      });
    console.log('Location saved:', {locationName, googleLocation, radius});
  };
  useEffect(() => {
    setGroupData(props.GROUP_DATA);
    console.log('Group_Data:', props.GROUP_DATA);
  }, [props.GROUP_DATA]);
  const handleMapPress = event => {
    const {coordinate} = event.nativeEvent;
    getPlaceName(coordinate.latitude, coordinate.longitude);
    console.log('asdmaksdasdas', coordinate, event.nativeEvent);

    setMarkerCoordinate(coordinate); // Update marker position
  };

  const getPlaceName = async (latitude, longitude) => {
    const lat = latitude;
    const lng = longitude;
    const apiKey = 'AIzaSyDTWIhZVf2a-guaVMA2sPvUXlcNsmL1CtA';
    console.log('asdasdasdasasds', apiKey);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        const address = data.results[0]?.formatted_address;
        console.log('Place name:', address);
        setGoogleLocation(address);
        return address;
      } else {
        console.error('Geocoding error:', data.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          },
        ]}>
        <Toast position="top" topOffset={0} config={toastConfig} />
      </View>
      <Header showBack={true} showHome={true} title="Add Location" />
      <ScrollView style={{paddingHorizontal: 10}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Location Name */}
          <View style={{marginTop: 20, gap: 1}}>
            <Text style={styles.label}>Groups *</Text>
            <Dropdown
              style={styles.cardInput}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={groupData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Group"
              value={group}
              onChange={item => {
                setGroup(item.value);
                setErrors(prev => ({...prev, group: undefined}));
              }}
              renderItem={item => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </View>
              )}
              renderSelectedItem={(item, index) => (
                <View style={styles.selectedItemContainer}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </View>
              )}
            />
            {errors.group && (
              <Text style={styles.errorText}>{errors.group}</Text>
            )}
            <Text style={[styles.label, {marginTop: 20}]}>Location Name *</Text>
            <TextInput
              style={styles.cardInput}
              placeholder="Enter location name"
              placeholderTextColor="#aaa"
              value={locationName}
              onChangeText={text => {
                setLocationName(text);
                setErrors(prev => ({...prev, locationName: undefined}));
              }}
            />
            {errors.locationName && (
              <Text style={styles.errorText}>{errors.locationName}</Text>
            )}

            {/* Google Location */}
            <Text style={[styles.label, {marginTop: 20}]}>Location *</Text>
            <TextInput
              style={[styles.cardInput, {backgroundColor: '#eee'}]}
              placeholder="Select Location from Maps"
              placeholderTextColor="#aaa"
              value={googleLocation}
              editable={false}
              onChangeText={text => {
                setGoogleLocation(text);
                setErrors(prev => ({...prev, googleLocation: undefined}));
              }}
              // Integrate Google Places API here
            />
            {errors.googleLocation && (
              <Text style={styles.errorText}>{errors.googleLocation}</Text>
            )}

            {/* Radius Dropdown */}
            <Text style={[styles.label, {marginTop: 20}]}>Radius *</Text>
            <Dropdown
              style={styles.cardInput}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={radiusOptions}
              maxHeight={300}
              labelField="label"
              valueField="label"
              placeholder="Select Radius"
              value={radius === 'Select Radius' ? null : radius}
              onChange={item => {
                setRadius(item.label);
                setErrors(prev => ({...prev, radius: undefined}));
              }}
              renderItem={item => (
                <View style={styles.itemContainer}>
                  <Image source={item.icon} style={styles.itemIcon} />
                  <Text style={styles.itemText}>{item.label}</Text>
                </View>
              )}
              renderSelectedItem={(item, index) => (
                <View style={styles.selectedItemContainer}>
                  <Image source={item.icon} style={styles.itemIcon} />
                  <Text style={styles.itemText}>{item.label}</Text>
                </View>
              )}
            />
            {errors.radius && (
              <Text style={styles.errorText}>{errors.radius}</Text>
            )}
            <View style={styles.container}>
              {/* Search Bar */}
              <GooglePlacesAutocomplete
                placeholder="Search for a location"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  const location = details.geometry.location;
                  const newRegion = {
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  };
                  setRegion(newRegion);
                  mapRef.current.animateToRegion(newRegion, 1000);
                }}
                query={{
                  key: 'AIzaSyDTWIhZVf2a-guaVMA2sPvUXlcNsmL1CtA',
                  language: 'en',
                }}
                styles={{
                  container: {
                    position: 'absolute',
                    top: 10,
                    width: '100%',
                    zIndex: 1,
                  },
                  listView: {
                    backgroundColor: 'red',
                    color: 'black',
                  },
                }}
              />

              {/* Map View */}
              <View style={styles.mapsContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={styles.map}
                  region={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                  onPress={handleMapPress} // Handle tap
                >
                  {markerCoordinate && <Marker coordinate={markerCoordinate} />}
                </MapView>
              </View>
            </View>
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
                  onPress={onSave}
                  disabled={loading} // 👈 disables Pressable when loading is true
                  style={({pressed}) => [
                    styles.bottomButton,
                    pressed && !loading && {opacity: 0.8},
                  ]}>
                  {loading ? (
                    <ActivityIndicator color={'#fff'} size={'small'} />
                  ) : (
                    <Text style={styles.bottomButtonText}>Save</Text>
                  )}
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};
const mapStateToProps = state => ({
  GROUP_DATA: state.groupData.groupList,
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps, {
  getLocationByUserData,
  getTrackingByUserData,
})(AddLocation);

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
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 50,
    shadowColor: '#000',
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
  placeholderStyle: {
    color: '#aaa',
  },
  mapsContainer: {
    // ...StyleSheet.absoluteFillObject,
    marginTop: 10,
    padding: 10,
    height: 300,
    // width: 300,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
