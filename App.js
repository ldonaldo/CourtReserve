import React, {useEffect, useMemo, useReducer, useContext} from 'react';
import { Title, TextInput, Button, Text, Avatar } from 'react-native-paper';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';
import RegisterForm from './components/Register/RegisterForm';
import LoginForm from './components/Login/LoginForm';
import Logout from './components/Logout/Logout';
import AsyncStorage from '@react-native-community/async-storage';
import Navigation from './components/Navigation/Navigation';

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
    }
  },{
    isLoading: true,
    isSignout: false,
    userToken: null,
    userType: null
  });

  useEffect(() =>{
    const getToken = async () => {
      let userToken, userType;
      try{
        userToken = await AsyncStorage.getItem('token')
        userType = await AsyncStorage.getItem('userType')
      } catch(err){

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
      }  
    }),
    []
  )
  console.log("State",state)   
  //let userType = async () => {await AsyncStorage.getItem('userType') || 'User'}
  return(
    <AuthContext.Provider value={{state,authContext}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">   
          <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />               
          {state.userToken == null ?  
          <>             
            <Stack.Screen name="Register" component={RegisterForm} options={{ title: "Register" }} />
            <Stack.Screen name="Login" component={LoginForm} options={{ title: 'Login User' }} /> 
          </>
          :
          <>            
            <Stack.Screen name="Logout" component={Logout} options={{ title: 'Logout User' }} /> 
          </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )  
}


