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
import {Dropdown} from 'react-native-element-dropdown';
import React, {useEffect, useState, useRef} from 'react';
import Header from '../../../components/Header/Header';
import {
  CategoryList,
  frequencyOptions,
  toastConfig,
} from '../../../constants/Fns';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {connect} from 'react-redux';
import Icons from '../../../constants/Icons';
import {ADD_GROUP} from '../../utils/Routes/Routes';
import {useNavigation} from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import Axios from '../../utils/Axios';
import {getGroupByUserData} from '../../Redux/Action/getAllGroupData';
import Toast from 'react-native-toast-message';

const DURATION = 100;
const PATTERN = [2 * DURATION, 1 * DURATION];
const screenHeight = Dimensions.get('window').height;
const ViewGroups = props => {
  const [allGroupsList, setAllGroupsList] = useState([]);
  const [showPopover, setShowPopover] = useState(false);
  const [currentPopoverData, setCurrentPopoverData] = useState({});
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [category, setCategory] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [milestoneDays, setMilestoneDays] = useState('');

  const scaleValue = useRef(new Animated.Value(1)).current;
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
      .post(Axios.axiosUrl + Axios.deleteGroup, {
        GROUP_ID: currentPopoverData._id,
      })
      .then(response => {
        Toast.show({
          type: 'success',
          text1: `Location Deleted`,
        });
        Vibration.vibrate(PATTERN);
        props.getGroupByUserData(props.AUTH_DATA?._id);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: `Something went wrong`,
        });
        Vibration.vibrate(PATTERN);
      });
    setShowDeleteConfirmModal(false);
  };

  const bottomSheetRef = useRef();
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
    if (!groupName.trim()) newErrors.groupName = 'Location name is required.';
    if (!milestoneDays) newErrors.milestoneDays = 'Location is required.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);

    axios
      .post(Axios.axiosUrl + Axios.updateGroup, {
        GROUP_ID: updatedData._id,
        GROUP_NAME: groupName,
        CATEGORY_ID: category,
        MILESTONE_FREQUENCY_ID: frequency,
        MILESTONE_DAYS: milestoneDays,
      })
      .then(response => {
        setLoading(false);

        Toast.show({
          type: 'success',
          text1: `Location Updated`,
        });
        Vibration.vibrate(PATTERN);
        props.getGroupByUserData(props.AUTH_DATA?._id);
        bottomSheetRef.current.close();
      })
      .catch(err => {
        setLoading(false);

        Toast.show({
          type: 'error',
          text1: `Something went wrong`,
        });
        Vibration.vibrate(PATTERN);
      });
  };

  useEffect(() => {
    setAllGroupsList(props.GROUP_DATA);
  }, [props.GROUP_DATA]);

  const renderGroupCard = ({item}) => {
    const categoryData = CategoryList.find(
      cat => cat.value == item.CATEGORY_ID,
    );

    return (
      // <View style={styles.card}>
      //   <View style={styles.cardContent}>
      //     <View>
      //       <Text style={styles.title}>{item.GROUP_NAME}</Text>
      //       <Text>Target: {item.MILESTONE_FREQUENCY_ID}</Text>
      //       <Text>Milestone Days: {item.MILESTONE_DAYS}</Text>
      //     </View>
      //     <View style={styles.iconContainer}>
      //       {categoryData?.icon && (
      //         <>
      //           <ImageIcon
      //             icon={categoryData.icon}
      //             iconStyle={{height: 60, width: 60}}
      //           />
      //           <Text>{categoryData?.label}</Text>
      //         </>
      //       )}
      //     </View>
      //   </View>
      // </View>
      <View key={`group-${item._id}`} style={styles.card}>
        <TouchableOpacity
          ref={optionsIconRef}
          style={styles.optionsIconContainer}
          onPress={() => {
            openPopover();
            setCurrentPopoverData(item);
            setUpdatedData(item);
            setGroupName(item.GROUP_NAME);
            setCategory(item.CATEGORY_ID);
            setFrequency(item.MILESTONE_FREQUENCY_ID);
            setMilestoneDays(item.MILESTONE_DAYS);
            // setLocationName(item.LOCATION_NAME);
            // setGoogleLocation(item.LOCATION);
          }}>
          <Image
            source={Icons.optionsDotsMore}
            style={{width: 24, height: 24, tintColor: '#333'}}
          />
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View>
            <Text style={styles.title}>{item.GROUP_NAME}</Text>
            <Text>Target: {item.MILESTONE_FREQUENCY_ID}</Text>
            <Text>Milestone Days: {item.MILESTONE_DAYS}</Text>
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

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header title="View Groups" showBack />
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 10,
          paddingTop: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ADD_GROUP)}
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
            Add Group{' '}
          </Text>
          <ImageIcon
            icon={Icons.group}
            iconStyle={{
              width: 30,
              height: 30,
              tintColor: '#fff',
            }}
            containerStyle={{
              borderRadius: 50,
              marginHorizontal: 10,
            }}
            onPress={() => {
              // navigation.navigate(PROFILE);
            }}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={allGroupsList}
        keyExtractor={item => item._id}
        renderItem={renderGroupCard}
        style={styles.viewGroups}
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
              All locations of this group will be deleted. Are you sure you want
              to delete this Group?
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
        height={screenHeight * 0.7}
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
          <Text style={{fontSize: 18, fontWeight: '700'}}>Update Group</Text>
        </View>
        <ScrollView
          style={{
            paddingHorizontal: 10,
          }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{marginTop: 20, gap: 16}}>
              <View>
                <Text style={styles.label}>Group Name *</Text>
                <TextInput
                  style={styles.cardInput}
                  value={groupName}
                  onChangeText={text => {
                    setGroupName(text);
                    setErrors(prev => ({...prev, groupName: undefined}));
                  }}
                  placeholder="Enter group name"
                  placeholderTextColor="#aaa"
                />
                {errors.groupName && (
                  <Text style={styles.errorText}>{errors.groupName}</Text>
                )}
              </View>

              <View>
                <Text style={styles.label}>Category *</Text>

                <Dropdown
                  style={styles.cardInput}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={CategoryList}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Category"
                  value={Number(category)}
                  onChange={item => {
                    setCategory(item.value);
                    setErrors(prev => ({...prev, category: undefined}));
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
                {errors.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}
              </View>

              <View>
                <Text style={styles.label}>Milestone Frequency *</Text>

                <Dropdown
                  style={styles.cardInput}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={frequencyOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Category"
                  value={frequency}
                  onChange={item => {
                    setFrequency(item.value);
                    setErrors(prev => ({...prev, frequency: undefined}));
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
                {errors.frequency && (
                  <Text style={styles.errorText}>{errors.frequency}</Text>
                )}
              </View>

              <View>
                <Text style={styles.label}>Milestone Days *</Text>
                <TextInput
                  style={styles.cardInput}
                  value={milestoneDays}
                  onChangeText={text => {
                    setMilestoneDays(text);
                    setErrors(prev => ({...prev, milestoneDays: undefined}));
                  }}
                  placeholder="e.g. 7"
                  placeholderTextColor="#aaa"
                  keyboardType="number-pad"
                />
                {errors.milestoneDays && (
                  <Text style={styles.errorText}>{errors.milestoneDays}</Text>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>

          {/* <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => console.log('Submit pressed')}>
          <Text style={styles.bottomButtonText}>Save</Text>
        </TouchableOpacity>
      </View> */}
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
        </ScrollView>
      </RBSheet>
    </View>
  );
};
const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
  GROUP_DATA: state.groupData.groupList,
});

export default connect(mapStateToProps, {getGroupByUserData})(ViewGroups);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingBottom: 16,
  },
  viewGroups: {
    padding: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  emoji: {
    fontSize: 26,
  },
  optionsIconContainer: {
    position: 'absolute',
    // top: 10,
    right: 10,
    zIndex: 2,
    padding: 4,
  },
  optionText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
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
  placeholderStyle: {
    color: '#aaa',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  selectedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
});
