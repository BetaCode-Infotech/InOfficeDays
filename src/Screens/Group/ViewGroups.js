import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/Header/Header';
import {CategoryList} from '../../../constants/Fns';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';

const ViewGroups = () => {
  const [allGroupsList, setAllGroupsList] = useState([
    {
      KEY: 'MS001',
      GROUP_ID: 'G001',
      GROUP_NAME: 'Hit Gym',
      CATEGORY: 1,
      MILESTONE_FREQUENCY: 'MONTHLY',
      MILESTONE_DAYS: 15,
    },
    {
      KEY: 'MS002',
      GROUP_ID: 'G002',
      GROUP_NAME: 'Engineering Team',
      CATEGORY: 3,
      MILESTONE_FREQUENCY: 'WEEKLY',
      MILESTONE_DAYS: 7,
    },
    {
      KEY: 'MS003',
      GROUP_ID: 'G003',
      GROUP_NAME: 'HR Department',
      CATEGORY: 2,
      MILESTONE_FREQUENCY: 'MONTHLY',
      MILESTONE_DAYS: 30,
    },
    {
      KEY: 'MS004',
      GROUP_ID: 'G004',
      GROUP_NAME: 'Product Team',
      CATEGORY: 3,
      MILESTONE_FREQUENCY: 'WEEKLY',
      MILESTONE_DAYS: 7,
    },
  ]);

  const renderGroupCard = ({item}) => {
    const categoryData = CategoryList.find(
      cat => cat.CATEGORY_ID === item.CATEGORY,
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.title}>{item.GROUP_NAME}</Text>
            <Text>Target: {item.MILESTONE_FREQUENCY}</Text>
            <Text>Milestone Days: {item.MILESTONE_DAYS}</Text>
          </View>
          <View style={styles.iconContainer}>
            {categoryData?.CATEGORY_ICON && (
              <>
                <ImageIcon
                  icon={categoryData.CATEGORY_ICON}
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

  return (
    <View style={styles.container}>
      <Header title="View Groups" showBack />
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

export default ViewGroups;
