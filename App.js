import React, {useEffect, useMemo, useReducer, useContext} from 'react';
import { Title, TextInput, Button, Text, Avatar } from 'react-native-paper';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import DrawerNavigation from './components/Navigation/DrawerNavigation';
import TabNavigator from './components/Navigation/TabNavigator';

const Stack = createStackNavigator();
export const AuthContext = React.createContext();

export default function App ({navigation}) {
  const [state,dispatch] = React.useReducer((prevState, action) => {
    switch(action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          userType: action.userType
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
          userType: action.userType
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
          userType: null
        };
      case 'UPDATE_COURTS':
        return {
          ...prevState,
          courts: action.courts  
        } 
    }
  },{
    isLoading: true,
    isSignout: false,
    userToken: null,
    userType: null,
    courts: []
  });

  useEffect(() =>{
    const getToken = async () => {
      let userToken, userType;
      try{
        userToken = await AsyncStorage.getItem('token')
        userType = await AsyncStorage.getItem('userType')
      } catch(err){
        console.log(err)
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken, userType: userType })
    };
    getToken();
  },[])

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({ type: 'SIGN_IN', token: data.token, userType: data.userType})
      },
      signOut: () => dispatch({ type: 'SIGN_OUT'}),
      signUp: async data => {
        dispatch({ type: 'SIGN_IN', token: data.token, userType: data.userType})
      },
      updateCourts: async data => {
        dispatch({ type: 'UPDATE_COURTS', courts: data.courts })
      } 
    }),
    []
  )
  console.log("State",state)   
  //let userType = async () => {await AsyncStorage.getItem('userType') || 'User'}
  return(
    <AuthContext.Provider value={{state,authContext}}>
      <NavigationContainer>
          <DrawerNavigation />
      </NavigationContainer>
      
    </AuthContext.Provider>
  )  
}


