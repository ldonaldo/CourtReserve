import React from 'react'
import { Title, Text, Button, BottomNavigation} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import Logout from '../components/Logout/Logout';
import Navigation from '../components/Navigation/Navigation';

export default function Home({navigation}) {
  return(
    <>
      {/*<Button icon="account-plus" title="Register User" mode="contained" onPress={() => navigation.navigate('Register')}>Register User</Button>
      <Button icon="login" title="Login User" mode="contained" onPress={() => navigation.navigate('Login')}>Login User</Button>
  <Logout /> */}
      <Navigation />
    </>
  )
}
