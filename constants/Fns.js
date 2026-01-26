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

export const CategoryList = [
  {
    label: 'Office/RTO',
    value: 1,
    icon: Icons.work,
  },
  {
    label: 'Gym',
    value: 2,
    icon: Icons.gym,
  },
  {
    label: 'Yoga',
    value: 3,
    icon: Icons.meditation,
  },
  {
    label: 'Swimming',
    value: 4,
    icon: Icons.swimming_pool,
  },
  {
    label: 'Cricket',
    value: 5,
    icon: Icons.cricket,
  },
  {
    label: 'Dance',
    value: 6,
    icon: Icons.dance,
  },
  {
    label: 'Boxing',
    value: 7,
    icon: Icons.boxing,
  },
  {
    label: 'Badminton',
    value: 8,
    icon: Icons.badminton,
  },
  {
    label: 'Tennis',
    value: 9,
    icon: Icons.tennis,
  },
  {
    label: 'Football',
    value: 10,
    icon: Icons.football,
  },
  {
    label: 'Basketball',
    value: 11,
    icon: Icons.basketball,
  },
  {
    label: 'Meet Partner',
    value: 12,
    icon: Icons.lovers,
  },
  {
    label: 'Home Visit',
    value: 13,
    icon: Icons.mansion,
  },
];

export const radiusOptions = [
  {label: '50 M', value: 50, icon: locationIcon},
  {label: '100 M', value: 100, icon: locationIcon},
  {label: '200 M', value: 200, icon: locationIcon},
  {label: '500 M', value: 500, icon: locationIcon},
  {label: '1000 M', value: 1000, icon: locationIcon},
];
export const frequencyOptions = [
  {label: 'Weekly', value: 'weekly', icon: Icons.email},
  {label: 'Monthly', value: 'monthly', icon: Icons.email},
  {label: 'Quarterly', value: 'quarterly', icon: Icons.email},
];

export const bufferRadius = parseFloat(200);
