import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Vibration,
  Animated,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useState, useMemo, useEffect, useRef} from 'react';
import Header from '../../../components/Header/Header';
import {CategoryList, radiusOptions} from '../../../constants/Fns';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {useNavigation, useRoute} from '@react-navigation/native';
import {connect} from 'react-redux';
import Icons from '../../../constants/Icons';
import IconButton from '../../../components/IconButton/IconButton';
import {ADD_LOCATION} from '../../utils/Routes/Routes';
import Popover from 'react-native-popover-view';
import axios from 'axios';
import Axios from '../../utils/Axios';
import Toast from 'react-native-toast-message';
import {toastConfig, toBoolean} from '../../../constants/Fns';
import {getLocationByUserData} from '../../Redux/Action/getAllGroupData';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Dropdown} from 'react-native-element-dropdown';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation'; // Install this if not already
const GOOGLE_MAPS_API_KEY = 'AIzaSyDTWIhZVf2a-guaVMA2sPvUXlcNsmL1CtA';
// import {GOOGLE_MAPS_API_KEY} from '@env';

// Group items by GROUP_ID
const DURATION = 100;
const PATTERN = [2 * DURATION, 1 * DURATION];
const screenHeight = Dimensions.get('window').height;

const groupByGroupId = data => {
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.GROUP_ID]) {
      grouped[item.GROUP_ID] = {
        GROUP_NAME: item.GROUP_NAME,
        locations: [],
      };
    }
    grouped[item.GROUP_ID].locations.push(item);
  });

  return Object.entries(grouped).map(([GROUP_ID, group]) => ({
    GROUP_ID,
    GROUP_NAME: group.GROUP_NAME,
    locations: group.locations,
  }));
};

const ViewLocations = props => {
  const route = useRoute();
  const navigation = useNavigation();

  const passedGroupId = route.params?.groupId || null;
  const [showPopover, setShowPopover] = useState(false);
  const [currentPopoverData, setCurrentPopoverData] = useState({});
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [groupData, setGroupData] = useState([]);
  useEffect(() => {
    setGroupData(props.GROUP_DATA);
    console.log('Group_Data:', props.GROUP_DATA);
  }, [props.GROUP_DATA]);
  const optionsIconRef = useRef(null);
  const openPopover = () => {
    setShowPopover(true);
  };

  const closePopover = () => {
    setShowPopover(false);
  };

  // const handleOptionSelect = option => {
  //   console.log('Selected option:', option);
  //   closePopover();
  // };
  const handleOptionSelect = option => {
    if (option === 'Edit') {
      bottomSheetRef.current.open();
      setShowPopover(false);
    } else if (option === 'Delete') {
      setShowPopover(false);
      setShowDeleteConfirmModal(true);
    }
    closePopover();
  };

  const handleConfirmDelete = () => {
    // your delete function here
    axios
      .post(Axios.axiosUrl + Axios.updateLocation, {
        LOCATION_ID: currentPopoverData._id,
        IS_DELETED: true,
        IS_ACTIVE: false,
      })
      .then(response => {
        console.log('Deleted!');

        Toast.show({
          type: 'success',
          text1: `Location Deleted`,
        });
        Vibration.vibrate(PATTERN);
        props.getLocationByUserData(props.AUTH_DATA?._id);
      })
      .catch(err => {
        console.log('Err', err);
        Toast.show({
          type: 'error',
          text1: `Something went wrong`,
        });
        Vibration.vibrate(PATTERN);
      });
    setShowDeleteConfirmModal(false);
  };
  useEffect(() => {
    setAllLocationList(props.LOCATION_DATA);
  }, [props.LOCATION_DATA]);

  const [allLocationList, setAllLocationList] = useState([]);

  useEffect(() => {
    const defaultExpanded = {};
    groupedLocations.forEach(group => {
      defaultExpanded[group.GROUP_ID] = true;
    });
    setExpandedGroups(defaultExpanded);
  }, [groupedLocations]);

  const filteredList = useMemo(() => {
    return passedGroupId
      ? allLocationList.filter(item => item.GROUP_ID === passedGroupId)
      : allLocationList;
  }, [allLocationList, passedGroupId]);

  const groupedLocations = useMemo(
    () => groupByGroupId(filteredList),
    [filteredList],
  );

  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    if (passedGroupId) {
      // Automatically expand the passed group
      setExpandedGroups({[passedGroupId]: true});
    }
  }, [passedGroupId]);

  const toggleGroup = GROUP_ID => {
    setExpandedGroups(prev => ({
      ...prev,
      [GROUP_ID]: !prev[GROUP_ID],
    }));
  };

  const renderLocation = item => {
    const categoryData = CategoryList.find(
      cat => cat.value == item.CATEGORY_ID,
    );
    return (
      <View key={`location-${item._id}`} style={styles.card}>
        <TouchableOpacity
          ref={optionsIconRef}
          style={styles.optionsIconContainer}
          onPress={() => {
            console.log('Options pressed for:', item);
            openPopover();
            setCurrentPopoverData(item);
            setUpdatedData(item);
            setLocationName(item.LOCATION_NAME);
            setGoogleLocation(item.LOCATION);
          }}>
          <Image
            source={Icons.optionsDotsMore}
            style={{width: 24, height: 24, tintColor: '#333'}}
          />
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View>
            <Text style={styles.location}>{item.LOCATION_NAME}</Text>
            {/* <Text style={styles.location}>Location: {item.LOCATION}</Text> */}
            <Text>Radius: {item.RADIUS} M</Text>
          </View>

          <View style={styles.iconContainer}>
            {categoryData?.icon && (
              <>
                <ImageIcon
                  icon={categoryData.icon}
                  iconStyle={{height: 60, width: 60}}
                />
                <Text>{categoryData?.label}</Text>
              </>
            )}
          </View>
        </View>

        {/* Popover Modal */}
        <Popover
          isVisible={showPopover}
          from={optionsIconRef}
          onRequestClose={() => setShowPopover(false)}
          placement="bottom">
          <View style={{padding: 12}}>
            <TouchableOpacity onPress={() => handleOptionSelect('Edit')}>
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionSelect('Delete')}>
              <Text style={[styles.optionText, {color: 'red'}]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Popover>
      </View>
    );
  };
  // --------------------------------------------
  const bottomSheetRef = useRef();

  const [group, setGroup] = useState(null);
  const [locationName, setLocationName] = useState('Select Location');
  const [radius, setRadius] = useState('Select Radius');
  const [region, setRegion] = useState({
    latitude: 22.5726,
    longitude: 88.3639,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [googleLocation, setGoogleLocation] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onSave = () => {
    const newErrors = {};
    if (!locationName.trim())
      newErrors.locationName = 'Location name is required.';
    if (!googleLocation) newErrors.googleLocation = 'Location is required.';
    if (updatedData.Radius === 'Select Radius')
      newErrors.radius = 'Radius is required.';

    setErrors(newErrors);
    console.log('onSave called', newErrors);

    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);

    axios
      .post(Axios.axiosUrl + Axios.updateLocation, {
        LOCATION_ID: updatedData._id,
        LOCATION_NAME: locationName,
        LOCATION: googleLocation,
        RADIUS: updatedData.RADIUS,
        GROUP_ID: updatedData.GROUP_ID,
        USER_ID: props.AUTH_DATA?._id,
      })
      .then(response => {
        setLoading(false);

        Toast.show({
          type: 'success',
          text1: `Location Updated`,
        });
        Vibration.vibrate(PATTERN);
        props.getLocationByUserData(props.AUTH_DATA?._id);
        bottomSheetRef.current.close();
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

  const goToMyLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Location permission denied');
          return;
        }
      }
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const region = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(region);
          setGoogleLocation({latitude, longitude});
          getPlaceName(latitude, longitude);
        },
        error => console.error(error.message),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMapPress = event => {
    const {coordinate} = event.nativeEvent;
    getPlaceName(coordinate.latitude, coordinate.longitude);

    setGoogleLocation(coordinate); // Update marker position
  };
  const getPlaceName = async (latitude, longitude) => {
    const lat = latitude;
    const lng = longitude;
    const apiKey = GOOGLE_MAPS_API_KEY;
    console.log('asdasdasdasasds', apiKey);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        const address = data.results[0]?.formatted_address;
        console.log('Place name:', address);
        setLocationName(address);
        return address;
      } else {
        console.error('Geocoding error:', data.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  // --------------------------------------------
  return (
    <View style={styles.container}>
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
      <Header title="View Locations" showBack />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ADD_LOCATION)}
          style={{
            flexDirection: 'row',
            backgroundColor: '#000',
            alignItems: 'center',
            width: 150,
            borderRadius: 10,
            padding: 10,
          }}>
          <Text
            style={{
              color: '#fff',
            }}>
            {' '}
            Add Location{' '}
          </Text>
          <ImageIcon
            icon={Icons.locationGroup}
            iconStyle={{
              width: 30,
              height: 30,
              tintColor: '#fff',
            }}
            containerStyle={{
              borderRadius: 50,
              marginHorizontal: 10,
            }}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={groupedLocations}
        keyExtractor={item => `group-${item._id}`}
        renderItem={({item}) => (
          <View style={styles.accordionSection}>
            <TouchableOpacity
              onPress={() => {
                toggleGroup(item.GROUP_ID);
              }}
              style={styles.accordionHeader}>
              <Text style={styles.accordionTitle}>{item.GROUP_NAME}</Text>
              <Text style={{fontSize: 18}}>
                {expandedGroups[item.GROUP_ID] ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            {expandedGroups[item.GROUP_ID] &&
              item.locations.map(loc => renderLocation(loc))}
          </View>
        )}
        contentContainerStyle={styles.list}
      />
      <Modal
        visible={showDeleteConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirmModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={{marginVertical: 10}}>
              Are you sure you want to delete this location?
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: 'red'}]}
                onPress={handleConfirmDelete}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#ccc'}]}
                onPress={() => setShowDeleteConfirmModal(false)}>
                <Text style={[styles.modalButtonText, {color: '#333'}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <RBSheet
        draggable
        ref={bottomSheetRef}
        height={screenHeight * 0.8}
        openDuration={250}
        customStyles={{
          container: {borderTopLeftRadius: 18, borderTopRightRadius: 18},
        }}>
        <View
          style={{
            paddingTop: 16,
            paddingBottom: 5,
            marginHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
          }}>
          <Text style={{fontSize: 18, fontWeight: '700'}}>Update Location</Text>
        </View>
        <ScrollView style={{paddingHorizontal: 10}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Groups *</Text>
              <Dropdown
                style={[styles.cardInput, {backgroundColor: '#eee'}]}
                placeholder="Select Group"
                disable={true}
                data={groupData}
                labelField="label"
                valueField="value"
                value={{
                  label: updatedData.GROUP_NAME,
                  value: updatedData.GROUP_ID,
                }}
                onChange={item => {
                  setGroup(item.value);
                }}
                renderItem={item => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
              />
              <Text style={[styles.label, {marginTop: 20}]}>
                Location Name *
              </Text>
              <TextInput
                style={[styles.cardInput, {backgroundColor: '#eee'}]}
                value={locationName}
                editable={false}
                onChangeText={text => {
                  setLocationName(text);
                  setErrors(prev => ({...prev, locationName: undefined}));
                }}
              />

              <Text style={[styles.label, {marginTop: 20}]}>Radius *</Text>
              <Dropdown
                style={styles.cardInput}
                placeholder="Select Radius"
                data={radiusOptions}
                iconStyle={styles.iconStyle}
                labelField="label"
                valueField="value"
                value={Number(updatedData?.RADIUS)}
                onChange={item => {
                  setGroup(item.value);
                  setUpdatedData(prev => ({
                    ...prev,
                    RADIUS: item.value,
                  }));
                }}
                renderItem={item => (
                  <View style={styles.dropdownItem}>
                    <Image source={item.icon} style={styles.itemIcon} />

                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                renderSelectedItem={(item, index) => (
                  <View style={styles.selectedItemContainer}>
                    <Image source={item.icon} style={styles.itemIcon} />
                    <Text style={styles.itemText}>{item.label}</Text>
                  </View>
                )}
              />

              <Text>{updatedData.RADIUS}</Text>

              <View style={{height: 300, marginTop: 20}}>
                <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={styles.map}
                  region={region}
                  onPress={handleMapPress} // Handle tap
                  zoomControlEnabled
                  zoomTapEnabled
                  zoomEnabled>
                  {googleLocation && (
                    <>
                      <Marker coordinate={googleLocation} />
                      {Number(updatedData.RADIUS) > 0 && (
                        <Circle
                          center={googleLocation}
                          radius={Number(updatedData.RADIUS)} // in meters
                          strokeColor="rgba(0, 122, 255, 0.5)"
                          fillColor="rgba(0, 122, 255, 0.2)"
                        />
                      )}
                    </>
                  )}
                </MapView>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={goToMyLocation}>
                  <Text style={styles.locationButtonText}>📍</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomButtonContainer}>
                <Animated.View style={[{transform: [{scale: scaleValue}]}]}>
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={onSave}
                    disabled={loading}
                    style={({pressed}) => [
                      styles.bottomButton,
                      pressed && !loading && {opacity: 0.8},
                    ]}>
                    {loading ? (
                      <ActivityIndicator color={'#fff'} size={'small'} />
                    ) : (
                      <Text style={styles.bottomButtonText}>Update</Text>
                    )}
                  </Pressable>
                </Animated.View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  list: {paddingBottom: 16},
  accordionSection: {
    marginBottom: 10,
    paddingBottom: 10,
  },
  accordionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  optionsIconContainer: {
    position: 'absolute',
    // top: 10,
    right: 10,
    zIndex: 2,
    padding: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    maxWidth: '80%',
    fontWeight: 600,
  },
  popover: {
    // position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 3,
  },
  optionText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
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
  bottomButtonContainer: {
    marginTop: 10,
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
  dropdownItem: {
    paddingVertical: 8, // adjust this number to control vertical spacing
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  locationButtonText: {
    fontSize: 20,
  },
  itemIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
});

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
  LOCATION_DATA: state.locationData.locationList,
  GROUP_DATA: state.groupData.groupList,
});

export default connect(mapStateToProps, {
  getLocationByUserData,
})(ViewLocations);
