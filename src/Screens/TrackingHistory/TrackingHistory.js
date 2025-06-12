import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/Header/Header';
import IconButton from '../../../components/IconButton/IconButton';
import Icons from '../../../constants/Icons';
import {getHistoryByTrackingID} from '../../Redux/Action/getAllGroupData';
import {connect} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import Axios from '../../utils/Axios';
import axios from 'axios';

const TrackingHistory = props => {
  const route = useRoute();
  const [trackingHistory, setTrackingHistory] = useState([]);
  const passedTrackingID = route.params?.TRACKING_ID || null;

  useEffect(() => {
    getTrackingData(passedTrackingID, props.AUTH_DATA._id);
  }, [passedTrackingID]);

  const getTrackingData = async (TrackingId, UserId) => {
    if (!TrackingId) return {error: 'No Tracking ID provided'};
    if (!UserId) return {error: 'No User ID provided'};

    await axios
      .post(`${Axios.axiosUrl}${Axios.getTrackingHistory}`, {
        TRACKING_ID: TrackingId,
        USER_ID: UserId,
      })
      .then(response => {
        setTrackingHistory(response.data);
      })
      .catch(err => {});
  };

  return (
    <View>
      <Header title="Tracking History" showBack showHome />
      <FlatList
        data={trackingHistory}
        renderItem={({item}) => (
          <View key={item.KEY} style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.title}>{item.LOCATION_NAME}</Text>
                <Text> On {new Date(item.INCREMENT_DATE).toDateString()}</Text>
              </View>
              <View style={styles.iconContainer}>
                <>
                  <IconButton
                    icon={Icons.optionsDots}
                    iconStyle={{height: 20, width: 20}}
                  />
                </>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};
const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps)(TrackingHistory);

const styles = StyleSheet.create({
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
  },
});
