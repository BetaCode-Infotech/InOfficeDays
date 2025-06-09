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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import styles from './ProfileStyles';
import profile from '../../../assets/icons/profile.png';
import location from '../../../assets/icons/gps.png';
import people from '../../../assets/icons/people.png';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import {
  ADD_GROUP,
  ADD_LOCATION,
  GROUP,
  PROFILE,
} from '../../utils/Routes/Routes';
import IconButton from '../../../components/IconButton/IconButton';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {CategoryList} from '../../../constants/Fns';
import Icons from '../../../constants/Icons';
import {PieChart} from 'react-native-gifted-charts';
const {width} = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.9);

export default function Dashboard() {
  const [newUser, setNewUser] = useState(true);
  const navigation = useNavigation();

  const data = [
    {value: 60, color: '#FF8C00'}, // 60%
    {value: 40, color: '#E0E0E0'}, // 40%
  ];

  const [milestonesData, setMilestonesData] = useState([
    {
      id: '1',
      GROUP_NAME: 'Greyt HR Office',
      LOCATION_NAME: 'Greyt HR Office',
      CATEGORY: '1',
      DUE_DATE: '',
      icon: people,
      pinned: true,
      gradient: ['#21a3f1', '#0668a3'],
    },
    {
      id: '2',
      GROUP_NAME: 'Greyt HR Office',
      locations: 5,
      CATEGORY: '2',
      pinned: false,
      icon: location,
      gradient: ['#5409DA', '#4E71FF'],
    },
  ]);
  const handlePin = selectedId => {
    const updatedData = milestonesData.map(item => ({
      ...item,
      pinned: item.id === selectedId,
    }));
    setMilestonesData(updatedData);
  };
  // Animated value for rotation
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate from 0 to 0.5 (0 to 180deg)
    Animated.timing(spinAnim, {
      toValue: 0.5,
      duration: 2000, // 2 seconds
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [spinAnim]);

  // Interpolate spin value to rotation degrees
  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderGroupCard = ({item, index}) => {
    const categoryData = CategoryList.find(
      cat => cat.CATEGORY_ID == item.CATEGORY,
    );

    return (
      <TouchableWithoutFeedback
        // style={{}}
        onPress={() => navigation.navigate(GROUP, {groupId: item.id})}>
        <LinearGradient
          colors={item.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.cardNotPinned}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.GROUP_NAME}</Text>
            <IconButton
              icon={item.pinned ? Icons.pinFilled : Icons.pinBorder}
              iconStyle={{
                tintColor: '#fff',
                width: 20,
                height: 20,
              }}
              onPress={() => handlePin(item.id)}
            />
          </View>

          <View style={[styles.statusBadge, {marginBottom: 20}]}>
            <Text style={styles.badgeText}>20/10/2025 -27/10/2025</Text>
          </View>

          {item.pinned == true && (
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
                  radius={100}
                  innerRadius={60}
                  showText
                  textColor="black"
                  textSize={16}
                  strokeCap="butt"
                />
              </Animated.View>
              <View style={{position: 'absolute', top: 80}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>60%</Text>
              </View>
            </View>
          )}
          {item.pinned == false && (
            <View style={{width: '100%'}}>
              <Progress.Bar
                progress={0.6} // 60%
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
                <Text style={styles.progressLabel}>60%</Text>
                {/* <Text style={styles.progressLabel}>
                  {Math.round(progress * 100)}%
                </Text> */}
                <Text style={styles.progressLabel}>100%</Text>
              </View>
            </View>
          )}

          <View style={[styles.titleRow, {marginTop: 10}]}>
            {categoryData.CATEGORY_ICON && (
              <ImageIcon icon={categoryData.CATEGORY_ICON} />
            )}
            <Text style={styles.badgeText}>Completed</Text>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#fff'}}>
        <IconButton
          icon={profile}
          iconStyle={{
            width: 45,
            height: 45,
          }}
          containerStyle={{
            backgroundColor: '#BFD3F9',
            padding: 5,
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
              keyExtractor={item => item.id}
              contentContainerStyle={{
                // paddingVertical: 20,
                alignItems: 'center',
              }}
              renderItem={renderGroupCard}
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
