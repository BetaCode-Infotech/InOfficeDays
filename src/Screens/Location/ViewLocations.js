import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useMemo, useEffect} from 'react';
import Header from '../../../components/Header/Header';
import {CategoryList} from '../../../constants/Fns';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {useRoute} from '@react-navigation/native';

// Group items by GROUP_ID
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


const ViewLocations = () => {
  const route = useRoute();
  const passedGroupId = route.params?.groupId || null;

  const [allLocationList] = useState([
    {
      KEY: 'MS001',
      GROUP_ID: 'G001',
      GROUP_NAME: 'Hit Gym',
      LOCATION_NAME: 'Hit Gym',
      CATEGORY: 1,
      LOCATION: 'Mumbai',
      RADIUS: 15,
    },
    {
      KEY: 'MS002',
      GROUP_ID: 'G001',
      GROUP_NAME: 'Hit Gym',  
      LOCATION_NAME: 'Hit Gym Branch 2',
      CATEGORY: 1,
      LOCATION: 'Pune',
      RADIUS: 12,
    },
    {
      KEY: 'MS003',
      GROUP_ID: 'G002',
      GROUP_NAME: 'Engineering Team', 
      LOCATION_NAME: 'Engineering Team',
      CATEGORY: 3,
      LOCATION: 'Bangalore',
      RADIUS: 7,
    },
    {
      KEY: 'MS004',
      GROUP_ID: 'G002',
      GROUP_NAME: 'Engineering Team', 
      LOCATION_NAME: 'Engineering Floor 2',
      CATEGORY: 3,
      LOCATION: 'Bangalore',
      RADIUS: 9,
    },
    {
      KEY: 'MS005',
      GROUP_ID: 'G003',
      GROUP_NAME: 'HR Department',
      LOCATION_NAME: 'HR Department',
      CATEGORY: 2,
      LOCATION: 'Delhi',
      RADIUS: 30,
    },
    {
      KEY: 'MS006',
      GROUP_ID: 'G004',
      GROUP_NAME: 'Product Team',
      LOCATION_NAME: 'Product Team',
      CATEGORY: 3,
      LOCATION: 'Hyderabad',
      RADIUS: 7,
    },
  ]);

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
      cat => cat.CATEGORY_ID === item.CATEGORY,
    );
    return (
      <View key={item.KEY} style={styles.card}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.title}>{item.LOCATION_NAME}</Text>
            <Text>Location: {item.LOCATION}</Text>
            <Text>Radius: {item.RADIUS} km</Text>
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
      <Header title="View Locations" showBack  />
      <FlatList
        data={groupedLocations}
        keyExtractor={item => item.GROUP_ID}
        renderItem={({item}) => (
          <View style={styles.accordionSection}>
            <TouchableOpacity
              onPress={() => toggleGroup(item.GROUP_ID)}
              style={styles.accordionHeader}>
              <Text style={styles.accordionTitle}>
                 {item.GROUP_NAME}
              </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  list: {paddingBottom: 16},
  accordionSection: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
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
});

export default ViewLocations;
