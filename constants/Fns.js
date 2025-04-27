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