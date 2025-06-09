import {
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Pressable,
  ScrollView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import Icons from '../../../constants/Icons';
import Header from '../../../components/Header/Header';
import Axios from '../../utils/Axios';
import axios from 'axios';

const categoryOptions = [
  {label: 'Education', value: 'education', icon: Icons.email},
  {label: 'Health', value: 'health', icon: Icons.email},
  {label: 'Finance', value: 'finance', icon: Icons.email},
];

const frequencyOptions = [
  {label: 'Weekly', value: 'weekly', icon: Icons.email},
  {label: 'Monthly', value: 'monthly', icon: Icons.email},
  {label: 'Quarterly', value: 'quarterly', icon: Icons.email},
];

export default function AddGroup() {
  const navigation = useNavigation();

  const [groupName, setGroupName] = useState('');
  const [category, setCategory] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [milestoneDays, setMilestoneDays] = useState('');
  const [scaleValue] = useState(new Animated.Value(1));
  const [errors, setErrors] = useState({});

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onSave = async () => {
    const newErrors = {};
    if (!groupName.trim()) newErrors.groupName = 'Group name is required.';
    if (!category) newErrors.category = 'Category is required.';
    if (!frequency) newErrors.frequency = 'Milestone frequency is required.';
    if (
      !milestoneDays.trim() ||
      isNaN(milestoneDays) ||
      Number(milestoneDays) <= 0
    ) {
      newErrors.milestoneDays = 'Enter valid milestone days.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Dummy API call
    axios
      .post(Axios.axiosUrl + Axios.createGroups, {
        GROUP_NAME: groupName,
        CATEGORY_ID: category,
        MILESTONE_FREQUENCY_ID: frequency,
        MILESTONE_DAYS: Number(milestoneDays),
        USER_ID: '68388b31488f92f58b452d35',
      })
      .then(response => {
        console.log('Group Created');
      })
      .catch(err => {
        console.log('Err', err);
      });
    // Optionally reset form or show success UI
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header showBack title="Add Group" />
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
                data={categoryOptions}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Category"
                value={category}
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
            style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>Save</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // padding: 20,
    flexDirection: 'column',
    backgroundColor: 'white',
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
  placeholderStyle: {
    color: '#aaa',
  },

  itemText: {
    fontSize: 16,
    color: '#000',
  },
  bottomButtonContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomButton: {
    backgroundColor: '#5409DA', // vibrant coral-like color
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 50,
    shadowColor: '#5409DA',
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
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
});
