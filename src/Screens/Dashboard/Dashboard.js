import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
  Animated,
  Easing,
  Pressable,
  RefreshControl,
  Vibration,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import profile from '../../../assets/icons/profile.png';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import {
  ADD_GROUP,
  ADD_LOCATION,
  GROUP,
  PROFILE,
  TRACKING_HISTORY,
} from '../../utils/Routes/Routes';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/Fns';
import IconButton from '../../../components/IconButton/IconButton';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {CategoryList} from '../../../constants/Fns';
import Icons from '../../../constants/Icons';
import {PieChart} from 'react-native-gifted-charts';
import {connect} from 'react-redux';
import AnimatedCard from '../../../components/AnimatedCard/AnimatedCard';
import {getTrackingByUserData} from '../../Redux/Action/getAllGroupData';
import Axios from '../../utils/Axios';
import axios from 'axios';

const {width} = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.9);
const DURATION = 100;
const PATTERN = [2 * DURATION, 1 * DURATION];
function Dashboard(props) {
  const [newUser, setNewUser] = useState(true);
  const navigation = useNavigation();
  const [milestonesData, setMilestonesData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await props.getTrackingByUserData(props.AUTH_DATA?._id);
    setRefreshing(false);
  };

  useEffect(() => {
    if (props.GROUP_DATA.length > 0 && props.LOCATION_DATA.length > 0) {
      setNewUser(false);
    } else {
      setNewUser(true);
    }
  }, [props.GROUP_DATA, props.LOCATION_DATA]);

  useEffect(() => {
    let tempTrackingData = [...props.TRACKING_DATA];
    if (tempTrackingData.length > 0) {
      tempTrackingData.sort((a, b) => {
        if (a.PINNED === b.PINNED) return 0;
        return a.PINNED ? -1 : 1;
      });
      setMilestonesData(tempTrackingData);
    }
  }, [props.TRACKING_DATA]);
  const handlePin = async selectedId => {
    // const updatedData = milestonesData.map(item => ({
    //   ...item,
    //   PINNED: item.id === selectedId,
    // }));
    await axios
      .post(Axios.axiosUrl + Axios.pinTracking, {
        TRACKING_ID: selectedId,
      })
      .then(async response => {
        await props.getTrackingByUserData(props.AUTH_DATA?._id);

        console.log('Logout ', response.data);
      })
      .catch(err => {
        console.log('err', err);
        Toast.show({
                  type: 'error',
                  text1: `Something went wrong`,
                });
                Vibration.vibrate(PATTERN);
      });
    // setMilestonesData(updatedData);
  };
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(spinAnim, {
      toValue: 0.5,
      duration: 2000, // 2 seconds
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [spinAnim]);

  const renderGroupCard = ({item, index}) => {
    const spinInterpolate = spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const categoryData = CategoryList.find(
      cat => cat.value == item.CATEGORY_ID,
    );

    const percentage = Math.min(
      (item.ACHIEVEMENT / item.MILESTONE_DAYS) * 100,
      100,
    ).toFixed(0);

    const outerRadius = 100;
    const donutThickness = 20 + (100 - percentage) * 0.3; // You can tweak this formula
    const innerRadius = outerRadius - donutThickness;
    const data = [
      {value: item.ACHIEVEMENT, color: '#FF8C00'}, // orange part
      {value: item.MILESTONE_DAYS - item.ACHIEVEMENT, color: '#E0E0E0'}, // remaining part
    ];
    return (
      <AnimatedCard
        onPress={() =>
          navigation.navigate(TRACKING_HISTORY, {
            TRACKING_ID: item._id,
            GROUP_ID: item.GROUP_ID,
          })
        }>
        <View>
          <LinearGradient
            colors={item.GRADIENT_COLOR}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.cardNotPinned}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{item.GROUP_NAME}</Text>
              <IconButton
                icon={item.PINNED ? Icons.pinFilled : Icons.pinBorder}
                iconStyle={{
                  tintColor: '#fff',
                  width: 20,
                  height: 20,
                }}
                onPress={() => handlePin(item._id)}
              />
            </View>

            <View style={[styles.statusBadge, {marginBottom: 20}]}>
              <Text style={styles.badgeText}>
                {new Date(item.START_DATE).toDateString()} -{' '}
                {new Date(item.END_DATE).toDateString()}
              </Text>
            </View>

            {item.PINNED == true && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  // height: 150,
                }}>
                <Animated.View
                  style={{
                    transform: [{rotate: spinInterpolate}, {rotate: '-90deg'}],
                  }}>
                  <PieChart
                    data={data}
                    donut
                    radius={outerRadius}
                    innerRadius={innerRadius}
                    showText
                    textColor="black"
                    textSize={16}
                    strokeCap="butt"
                  />
                </Animated.View>
                <View style={{position: 'absolute', top: 80}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    {percentage}%
                  </Text>
                </View>
              </View>
            )}
            {item.PINNED == false && (
              <View style={{width: '100%'}}>
                <Progress.Bar
                  progress={percentage / 100} // 60%
                  width={null}
                  height={6}
                  color="#fff"
                  unfilledColor="rgba(255,255,255,0.3)"
                  borderWidth={0}
                  borderRadius={3}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
                  }}>
                  <Text style={styles.progressLabel}>0%</Text>
                  {percentage != 0 && (
                    <Text style={styles.progressLabel}>{percentage}%</Text>
                  )}
                  <Text style={styles.progressLabel}>100%</Text>
                </View>
              </View>
            )}
            <View style={[styles.titleRow, {marginTop: 10}]}>
              {categoryData?.icon && <ImageIcon icon={categoryData.icon} />}
              <Text style={styles.badgeText}>
                {percentage == 100 ? 'Completed' : 'In Progress'}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </AnimatedCard>
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
      <View style={{backgroundColor: '#fff'}}>
        <IconButton
          icon={profile}
          iconStyle={{
            width: 45,
            height: 45,
          }}
          containerStyle={{
            backgroundColor: '#BFD3F9',
            padding: 3,
            borderRadius: 50,
            width: 50,
            height: 50,
            marginHorizontal: 20,
          }}
          onPress={() => {
            navigation.navigate(PROFILE);
          }}
        />
      </View>
      {newUser == true && (
        <View style={styles.cardWrapper}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate(ADD_GROUP)}>
            <LinearGradient
              colors={['#096B68', '#129990']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.card}>
              <Image
                source={require('../../../assets/icons/img-badge-unclaimed.png')}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 10,
                  alignSelf: 'center',
                }}
              />
              <Text style={styles.title}>Add Group</Text>
              <Text style={styles.body}>
                A group brings together multiple locations that work toward one
                shared purpose.
              </Text>
            </LinearGradient>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate(ADD_LOCATION)}>
            <LinearGradient
              colors={['#5409DA', '#4E71FF']} // orange-to-peach gradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.card}>
              <Image
                source={require('../../../assets/icons/Views_L1_xqipkq.png')}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 10,
                  alignSelf: 'center',
                }}
              />
              <Text style={styles.title}>Pin Your Points</Text>
              <Text style={styles.body}>
                Quickly mark any location on the map and save it for later.
              </Text>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      )}
      {newUser == false && (
        <>
          {newUser === false && (
            <FlatList
              data={milestonesData}
              keyExtractor={item => item._id}
              contentContainerStyle={{
                alignItems: 'center',
              }}
              renderItem={renderGroupCard}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      )}
      {newUser == null && (
        <View style={styles.cardWrapper}>
          <ActivityIndicator size={'large'} color={'#21a3f1'} />
        </View>
      )}
    </View>
  );
}
const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
  GROUP_DATA: state.groupData.groupList,
  LOCATION_DATA: state.locationData.locationList,
  TRACKING_DATA: state.trackingData.trackingList,
});

export default connect(mapStateToProps, {
  getTrackingByUserData,
})(Dashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center', // vertical center
    alignItems: 'center', // horizontal center
    backgroundColor: '#ffffff',
  },
  card: {
    width: CARD_WIDTH,
    paddingVertical: 50,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
  },
  cardNotPinned: {
    width: CARD_WIDTH,
    paddingHorizontal: 10,
    paddingTop: 20,

    padding: 5,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 0},
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 5,
  },

  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start', // <-- This is important for wrapping
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
