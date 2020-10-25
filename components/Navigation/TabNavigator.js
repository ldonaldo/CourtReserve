import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, IconButton } from 'react-native-paper';
import LoginForm from '../Login/LoginForm';
import RegisterForm from '../Register/RegisterForm';
import Logout from '../Logout/Logout';
import CourtForm from '../Courts/CourtForm';
import { AuthContext } from '../../App';
import  HomeNavigator  from './HomeNavigator';
import Reservations from '../Profile/Reservations';
import Profile from '../Profile/Profile';
import MyCourts from '../Profile/MyCourts';

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
      <Tab.Screen name="Home" component={HomeNavigator} options={{title: "Home"}} />
      <Tab.Screen name="Login" component={LoginForm} options={{title: "Ingresar"}} />  
      <Tab.Screen name="Register" component={RegisterForm} options={{title: "Registro"}} />  
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
          } else if (route.name === "Reservations"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'format-list-numbered'
          } else if (route.name === "Profile"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'account-circle'
          }
          return <IconButton icon={iconName} color={colorIcon} size={25} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#6200EE',
        inactiveTintColor: 'black',
      }}
    >       
      <Tab.Screen name="Home" component={HomeNavigator} options={{title: "Home"}} /> 
      <Tab.Screen name="Reservations" component={Reservations} options={{title: "Reservas"}} />   
      <Tab.Screen name="Profile" component={Profile} options={{title: "Perfil"}} /> 
      <Tab.Screen name="Logout" component={Logout} options={{title: "Cerrar Sesión"}} />
      
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
          } else if (route.name === "Profile"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'account-circle'
          } else if (route.name === "Logout"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'logout'
          } else if (route.name === "MyCourts"){
            colorIcon = focused ? "#6200EE" : "black"
            iconName = 'soccer-field'
          }
          return <IconButton icon={iconName} color={colorIcon} size={25} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#6200EE',
        inactiveTintColor: 'black',
      }}
    >         
      <Tab.Screen name="Home" component={HomeNavigator} options={{title: "Home"}} />  
      <Tab.Screen name="CreateCourt" component={CourtForm} options={{title: "Crear Espacio"}} />  
      <Tab.Screen name="MyCourts" component={MyCourts} options={{title: "Mis Espacios"}} /> 
      <Tab.Screen name="Profile" component={Profile} options={{title: "Perfil"}} />   
      <Tab.Screen name="Logout" component={Logout} options={{title: "Cerrar sesión"}} />
    </Tab.Navigator>
  )
}