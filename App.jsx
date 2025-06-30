import {View, Text, Platform, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import MainLayout from './MainLayout';
import {Provider} from 'react-redux';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {persistor, store} from './src/Redux/Store';
import {PersistGate} from 'redux-persist/es/integration/react';
// import RenderDataOnLoad from './src/utils/RenderDataOnLoad';
import {COLORS} from './constants/theme';
import { startListeningForLocation } from './BackgroundJobs';
// import RenderDataOnLoad from './src/utils/RenderDataOnLoad';

const App = () => {
 
  useEffect(() => {
    console.log('App mounted');
    const unsubscribe = startListeningForLocation();

    return () => {
      unsubscribe(); // clean up
    };
  }, []);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SafeAreaView
            edges={['top', 'right', 'bottom', 'left']}
            style={{flex: 1}}>
            <StatusBar
              animated={true}
              backgroundColor={'#fff'}
              barStyle={'dark-content'}
            />
            <MainLayout />
            {/* <RenderDataOnLoad /> */}
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
