import React, {use, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import Icons from '../../../constants/Icons';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {COLORS} from '../../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {
  ALL_EVENTS,
  EVENT_DETAILS,
  PROFILE_VIEW,
} from '../../utils/Routes/Routes';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {connect} from 'react-redux';
// import {locations} from '../Profile/ProfileEdit';
import Axios from '../../utils/Axios';
const {width} = Dimensions.get('window');
// import Icon from 'react-native-vector-icons/Ionicons';

export const GradientProfilePic = ({style, containerStyle}) => {
  return (
    <LinearGradient
      colors={['#FFD700', '#FFB700', '#FFA500']} // golden tones
      style={[styles.avatarGradient, {...containerStyle}]}>
      <Image source={Icons.user} style={[styles.avatarImage, {...style}]} />
    </LinearGradient>
  );
};

const Dashboard = props => {
  const navigation = useNavigation();

  const [myEvents, setMyEvents] = useState([
    // {
    //   UNIVERSITY_NAME: 'Harvard University',
    //   LOCATION: 'Harvard University',
    //   TOPIC: 'Data Science',
    //   PAYMENT_MODE: 'Paid',
    //   START_TIME: '4 PM',
    //   END_TIME: '5 PM',
    //   DATE: '21 April, 2025',
    // },
    // {
    //   UNIVERSITY_NAME: 'Harvard University',
    //   LOCATION: 'Harvard University',
    //   TOPIC: 'Data Science',
    //   PAYMENT_MODE: 'Paid',
    //   START_TIME: '4 PM',
    //   END_TIME: '5 PM',
    //   DATE: '21 April, 2025',
    // },
  ]);

  const [allGroupsList, setGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    getGroupsList();
  }, [props]);

  useFocusEffect(
    useCallback(() => {
      getGroupsList();
    }, [props]),
  );

  const getGroupsList = async () => {
    await axios
      .post(Axios.axiosUrl + Axios.getAllEvents, {
        USER_ID: props.AUTH_DATA?.USER_ID,
        // LOCATION: locations[0],
      })
      .then(response => {
        setIsLoading(false);
        setGroupsList(response.data);
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const UniversityCard = ({item, index}) => {
    let innerStyle;
    let wrapperStyle;
    if (index === 0) {
      innerStyle = {color: COLORS.white, borderColor: COLORS.white};
      wrapperStyle = {backgroundColor: COLORS.primary};
    } else {
      innerStyle = {color: COLORS.black, borderColor: COLORS.black};
      wrapperStyle = {backgroundColor: COLORS.white};
    }

    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate(EVENT_DETAILS, {
            EVENT_DETAILS_ITEM: item,
          })
        }>
        <View style={[styles.cardBlack, {...wrapperStyle}]}>
          <Text style={[styles.cardLabel, {...innerStyle}]}>
            {item.UNIVERSITY_NAME}
          </Text>
          <Text style={[styles.cardDetail, {...innerStyle}]}>{item.TOPIC}</Text>
          <Text style={[styles.cardDetail, {...innerStyle}]}>
            {new Date(item.DATE).toDateString()}
          </Text>
          <Text style={[styles.cardDetail, {...innerStyle}]}>
            {item.LOCATION}
          </Text>
          <Text style={styles.cardAmount}>{item.PAYMENT_MODE}</Text>
          <View style={styles.cardUsers}>
            <Image source={Icons.profile} style={styles.userImage} />
            <Image source={Icons.profile} style={styles.userImage} />
            <TouchableOpacity style={styles.addUser}>
              <ImageIcon
                icon={Icons.send}
                iconStyle={{
                  height: 15,
                  width: 15,
                  tintColor: COLORS.black,
                }}
                tintColor={COLORS.gray30}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardDetailsRow}>
            <Text
              style={[
                styles.cardDetail,
                {...innerStyle, fontWeight: 'bold', fontSize: 13},
              ]}>
              {item.ENROLLED && 'Enrolled'}
            </Text>
            <Text style={[styles.cardDetail, {...innerStyle}]}>
              Coming Soon...
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Your refresh logic here (e.g., API call)
      await getGroupsList(); // <- Replace this with your actual function
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate(PROFILE_VIEW)}>
            <GradientProfilePic />
          </TouchableOpacity>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Pro</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <ImageIcon
              icon={Icons.search}
              iconStyle={{
                height: 25,
                width: 25,
              }}
              tintColor={COLORS.gray30}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <ImageIcon
              icon={Icons.bell}
              iconStyle={{
                height: 25,
                width: 25,
              }}
              tintColor={COLORS.gray30}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Your <Text style={styles.bold}>Events</Text>
      </Text>

      <View style={styles.spendingContainer}>
        <Text style={styles.spendingLabel}>Enrolled</Text>
        <View style={styles.spendingRow}>
          <Text style={styles.spendingAmount}>{myEvents.length}</Text>
        </View>
      </View>

      <View style={styles.upcomingEventsWrapper}>
        <Text style={styles.cardsTitle}>
          All <Text style={styles.bold}>Groups </Text>
        </Text>
      </View>
      <FlatList
        data={allGroupsList}
        renderItem={UniversityCard}
        // horizontal
        style={styles.cardsScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScrollContent}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f8fd',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    tintColor: COLORS.secondary,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  upcomingEventsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    marginTop: 20,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  spendingContainer: {
    marginTop: 20,
  },
  viewAllBtn: {
    color: COLORS.blue10,
  },
  spendingLabel: {
    fontSize: 14,
    color: '#666',
  },
  spendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 6,
  },
  spendingAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  graphPlaceholder: {
    backgroundColor: '#dde3f2',
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  graphText: {
    color: '#888',
  },
  cardsTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 14,
  },

  cardDetail: {
    color: '#ccc',
    fontSize: 12,
  },

  cardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b3ff72',
    marginVertical: 8,
  },
  cardUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 8,
  },
  userImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addUser: {
    backgroundColor: '#b3ff72',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor: '#f0f2f8',
    borderRadius: 30,
  },
  avatarGradient: {
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 41,
    height: 41,
    borderRadius: 50,
    tintColor: COLORS.white,
  },
  homeCircle: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 25,
  },
  cardsScroll: {
    paddingVertical: 20,
  },
  cardsScrollContent: {
    paddingRight: 20,
    // flexDirection: 'row',
  },
  cardBlack: {
    width: width - 10,
    marginRight: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  cardWhite: {
    backgroundColor: '#E6F5F2',
    width: 280, // Increased width
    marginRight: 16,
    padding: 15,
    borderRadius: 20,
    elevation: 2,
  },
  chip: {
    backgroundColor: '#E6F5F2', // light grey or any color you like
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start', // optional: ensures it doesn't stretch
    margin: 4,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.primary, // or white if using a dark background
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps, {})(Dashboard);
