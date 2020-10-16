import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, IconButton } from 'react-native-paper';
import LoginForm from '../Login/LoginForm';
import RegisterForm from '../Register/RegisterForm';
import Logout from '../Logout/Logout';
import CourtForm from '../Courts/CourtForm';
import Home from '../../pages/Home';
import { AuthContext } from '../../App';
import  HomeNavigator  from './HomeNavigator';

const Tab = createBottomTabNavigator();

export const NonLoggedTabNavigator = () => {
  const {state } = React.useContext(AuthContext)
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let colorIcon;
          if(route.name === "Home"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'home'            
          } else if (route.name === "Login"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'login'
          } else if (route.name === "Register"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'account-plus'
          }
          return <IconButton icon={iconName} color={colorIcon} size={25} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#6200EE',
        inactiveTintColor: 'black',
      }}
    > 
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Login" component={LoginForm} />  
      <Tab.Screen name="Register" component={RegisterForm} />  
    </Tab.Navigator>
  )
}

export const LoggedUserTabNavigator = () => {
  const {state } = React.useContext(AuthContext)
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let colorIcon;
          if(route.name === "Home"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'home'            
          } else if (route.name === "Logout"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'logout'
          }
          return <IconButton icon={iconName} color={colorIcon} size={25} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#6200EE',
        inactiveTintColor: 'black',
      }}
    >       
      <Tab.Screen name="Home" component={HomeNavigator} />      
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  )
}

export const LoggedAdminTabNavigator = () => {
  const {state } = React.useContext(AuthContext)
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let colorIcon;
          if(route.name === "Home"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'home'            
          } else if (route.name === "CreateCourt"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'tennis'
          } else if (route.name === "Logout"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'logout'
          }
          return <IconButton icon={iconName} color={colorIcon} size={25} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#6200EE',
        inactiveTintColor: 'black',
      }}
    >         
      <Tab.Screen name="Home" component={HomeNavigator} />  
      <Tab.Screen name="CreateCourt" component={CourtForm} />    
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  )
}