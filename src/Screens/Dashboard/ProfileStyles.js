import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileIconWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 15,
    marginVertical: 15,
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
  icon:{
    width:55,
    height:55,
    tintColor: '#ffffff'
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});