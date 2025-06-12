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
} from 'react-native';
import React, {useState, useMemo, useEffect, useRef} from 'react';
import Header from '../../../components/Header/Header';
import {CategoryList} from '../../../constants/Fns';
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
// Group items by GROUP_ID
const DURATION = 100;
const PATTERN = [2 * DURATION, 1 * DURATION];
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
      // handle edit here
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
      // <View key={item.KEY} style={styles.card}>
      //   <View style={styles.cardContent}>
      //     <View>
      //       <Text style={styles.title}>{item.LOCATION_NAME}</Text>
      //       <Text style={styles.location}>Location: {item.LOCATION}</Text>
      //       <Text>Radius: {item.RADIUS}</Text>
      //     </View>
      //     <View style={styles.iconContainer}>
      //       {categoryData?.icon && (
      //         <>
      //           <ImageIcon
      //             icon={categoryData.icon}
      //             iconStyle={{height: 60, width: 60}}
      //           />
      //           <Text>{categoryData?.CATEGORY_NAME}</Text>
      //         </>
      //       )}
      //     </View>
      //   </View>
      // </View>
      <View key={`location-${item._id}`} style={styles.card}>
        {/* Top-right IconButton */}

        <TouchableOpacity
          ref={optionsIconRef}
          style={styles.optionsIconContainer}
          onPress={() => {
            openPopover();
            setCurrentPopoverData(item);
          }}>
          <Image
            source={Icons.optionsDotsMore}
            style={{width: 24, height: 24, tintColor: '#333'}}
          />
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View>
            <Text style={styles.title}>{item.LOCATION_NAME}</Text>
            {/* <Text style={styles.location}>Location: {item.LOCATION}</Text> */}
            <Text>Radius: {item.RADIUS}</Text>
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
              onPress={() => toggleGroup(item.GROUP_ID)}
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
});

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
  LOCATION_DATA: state.locationData.locationList,
});

export default connect(mapStateToProps, {
  getLocationByUserData,
})(ViewLocations);
