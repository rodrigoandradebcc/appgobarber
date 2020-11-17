/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React from 'react';
import Dashboard from '../pages/Dashboard';
import { createStackNavigator } from '@react-navigation/stack';



const Auth = createStackNavigator();

const AppRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      // headerTintColor: '#fff',
      // headerStyle: {
      //   backgroundColor: '#7159c1',
      // },
      cardStyle: { backgroundColor: '#312e38' },
    }}
    // initialRouteName="SignUp"
  >
    <Auth.Screen name="Dashboard" component={Dashboard} />
  </Auth.Navigator>
);

export default AppRoutes;
