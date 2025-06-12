import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/Header/Header';
import {CategoryList} from '../../../constants/Fns';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {connect} from 'react-redux';
import Icons from '../../../constants/Icons';
import {ADD_GROUP} from '../../utils/Routes/Routes';
import {useNavigation} from '@react-navigation/native';

const ViewGroups = props => {
  const [allGroupsList, setAllGroupsList] = useState([]);
  useEffect(() => {
    setAllGroupsList(props.GROUP_DATA);
  }, [props.GROUP_DATA]);
  const renderGroupCard = ({item}) => {
    const categoryData = CategoryList.find(
      cat => cat.value == item.CATEGORY_ID,
    );
    return (
      <View style={styles.card}>
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
                <Text>{categoryData?.CATEGORY_NAME}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header title="View Groups" showBack />

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
        keyExtractor={item => item.KEY}
        renderItem={renderGroupCard}
        style={styles.viewGroups}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};
const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
  GROUP_DATA: state.groupData.groupList,
});

export default connect(mapStateToProps)(ViewGroups);

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
});
