import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import StackNavigator from './src/navigator/Stack/StackNavigator';
import {RenderDataOnLoad} from './src/utils/RenderDataOnLoad';
// import RenderDataOnLoad from './src/utils/RenderDataOnLoad';

const MainLayout = () => {
  return (
    <>
      <RenderDataOnLoad />
      <StackNavigator />
    </>
  );
};

export default MainLayout;
