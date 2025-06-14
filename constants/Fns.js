import Icons from './Icons';
import locationIcon from '../assets/icons/location.png';

export const toastConfig = {
  tomatoToast: ({text1, props}) => (
    // <View style={{height: 60, width:width-30, backgroundColor: 'tomato',margin:10, padding:10,borderRadius:10}}>
    //   <Text>{text1}</Text>
    //   <Text>{props.uuid}</Text>
    // </View>
    <View
      style={{
        backgroundColor: COLORS.primary3,
        padding: 3,
        margin: 10,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 20,
        height: 55,
      }}>
      <View>
        <LottieView
          source={require('../assets/lottie/no-internet-light.json')}
          autoPlay
          loop
          style={{
            height: 60,
            width: 50,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            // marginBottom: 170,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'column',
        }}>
        <Text
          style={{
            color: COLORS.white,
            marginLeft: 20,
            fontWeight: 'bold',
          }}>
          Internet Not available
        </Text>
        <Text
          style={{
            color: COLORS.white,
            marginLeft: 20,
          }}>
          still You can Work
        </Text>
      </View>
    </View>
  ),
};

export function toBoolean(value) {
  return value === 1 ? true : value === 0 ? false : value;
}
import {PermissionsAndroid, Platform, Alert} from 'react-native';

export const CategoryList = [
  {
    label: 'Fitness',
    value: 1,
    icon: Icons.fitness,
  },
  {
    label: 'Office',
    value: 2,
    icon: Icons.workspace,
  },
  {
    label: 'Meet Girlfriend',
    value: 3,
    icon: Icons.hearts,
  },
];

export const radiusOptions = [
  {label: '50 M', value: 50, icon: locationIcon},
  {label: '100 M', value: 100, icon: locationIcon},
  {label: '200 M', value: 200, icon: locationIcon},
  {label: '500 M', value: 500, icon: locationIcon},
  {label: '1000 M', value: 1000, icon: locationIcon},
];
