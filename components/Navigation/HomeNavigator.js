import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../pages/Home';
import CourtCalendar from '../Courts/CourtCalendar';

const Stack = createStackNavigator();

const HomeNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CourtCalendar" component={CourtCalendar} />
    </Stack.Navigator>
  )  
}

export default HomeNavigator