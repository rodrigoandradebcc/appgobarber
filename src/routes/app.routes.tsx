import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import CreateAppointment from '../pages/CreateAppointment';
import AppointmentCreated from '../pages/AppointmentCreated';

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
    <Auth.Screen name="CreateAppointment" component={CreateAppointment} />
    <Auth.Screen name="AppointmentCreated" component={AppointmentCreated} />

    <Auth.Screen name="Profile" component={Profile} />
  </Auth.Navigator>
);

export default AppRoutes;
