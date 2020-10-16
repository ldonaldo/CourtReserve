import React from "react";
import Court from './Court';
import { ScrollView } from 'react-native';
import {Title} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Courts = ({ courts, navigation }) => {
  const renderingCourts = courts.length > 0 && courts.map( court => (
    <Court key={court._id} court={court} />
  ))
  return (
    <>
      <ScrollView>
        <Title>Vea todas las canchas existentes:</Title>
        {renderingCourts}
      </ScrollView>
    </>  
  )
}

export default Courts;