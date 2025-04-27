import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
  FlatList,
  Animated,
  Button,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import SplashScreen from 'react-native-splash-screen';
import Paginator from '../../../components/Paginator/Paginator';
import {SvgUri} from 'react-native-svg';
import CustomButton from '../../../components/CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {
  AGENT_SIGNUP,
  DASHBOARD,
  LOGIN,
  SIGNIN,
} from '../../utils/Routes/Routes';
import {COLORS} from '../../../constants/theme';

const OnBoarding = props => {
  const navigation = useNavigation();

  const [BGColor, setBGColor] = useState('#fff');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (currentIndex == 1) {
      setBGColor('#fff');
    }
    if (currentIndex == 0) {
      setBGColor('#fff');
    }
    if (currentIndex == 2) {
      setBGColor('#fff');
    }
  }, [currentIndex]);

  const viewableItemChanged = useRef(({changed}) => {
    setCurrentIndex(changed[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const slideRef = useRef(null);

  const slides = [
    {
      id: '1',
      // title: 'Accountant',
      // description:
      //   'Let us manage your finances,Accountant is good in management',
      animation: require('../../../assets/image/onboarding1.png'),
    },
    {
      id: '2',
      // title: 'Your data is important',
      // description: 'Hassle free availability of all your data at one place',
      animation: require('../../../assets/image/onboarding2.png'),
    },
    {
      id: '3',
      // title: 'Accountant is organized',
      // description: 'Use Accountant and work smart',
      animation: require('../../../assets/image/onboarding3.png'),
    },
  ];

  const {width} = useWindowDimensions();
  const renderOnboardingItem = ({item}) => {
    return (
      <View style={[styles.container, {width}]}>
        {/* <LottieView
          source={item.animation}
          autoPlay
          loop
          style={{
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            // marginBottom: 170,
          }}
        /> */}
        {/* <SvgUri
          width="100%"
          height="100%"
          uri={item.animation}
        /> */}
        <Image source={item.animation} style={{width: width, height: 400}} />
        <View
          style={{
            flex: 0.3,
          }}>
          <Text style={styles.title}> {item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: BGColor}]}>
      {/* <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      /> */}
      {/* <StatusBar
        animated={true}
        backgroundColor={COLORS.white}
        barStyle={'light-content'}
      /> */}
      <View style={{flex: 3, backgroundColor: COLORS.white}}>
        {/* <Text>Hello</Text> */}
        <FlatList
          data={slides}
          renderItem={renderOnboardingItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          key={item => item.id}
          // showsHorizontalScrollIndicator
          pagingEnabled
          bounces={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {
              useNativeDriver: false,
            },
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemChanged}
          viewabilityConfig={viewConfig}
          ref={slideRef}
        />
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <Paginator data={slides} scrollX={scrollX} />
        {/* <NextButton
        scrollTO={scrollTo}
        percentage={(currentIndex + 1) * (100 / slides.length)}
        index={currentIndex}
        slideLength={slides.length}
      /> */}
        <CustomButton
          label="Get Started"
          color={COLORS.primary}
          containerStyle={{
            width: width - 100,
            padding: 20,
          }}
          onPress={() => {
            navigation.navigate(SIGNIN);
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 10,
    color: COLORS.primary,
    textAlign: 'center',
  },

  description: {
    fontWeight: '800',
    color: COLORS.gray70,
    textAlign: 'center',
    paddingHorizontal: 64,
  },
});

export default OnBoarding;
