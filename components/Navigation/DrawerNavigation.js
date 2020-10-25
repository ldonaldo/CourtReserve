import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, IconButton } from 'react-native-paper'
import LoginForm from '../Login/LoginForm';
import RegisterForm from '../Register/RegisterForm';
import Logout from '../Logout/Logout';
import Reservations from '../Profile/Reservations';
import Profile from '../Profile/Profile';
import { AuthContext } from '../../App';
import {NonLoggedTabNavigator, LoggedUserTabNavigator, LoggedAdminTabNavigator} from './TabNavigator';
import CourtForm from '../Courts/CourtForm';
import MyCourts from '../Profile/MyCourts';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const {state } = React.useContext(AuthContext)

  return (
    <Drawer.Navigator 
      drawerContentOptions={{
        activeTintColor: '#6200EE',
        inactiveTintColor: 'black'
      }}       
    >      
      {state.userToken === null ? 
        <>          
          <Drawer.Screen name="Home" component={NonLoggedTabNavigator} 
          options={{
            title: 'Home',
            drawerIcon: ({ focused, color, size }) => (               
              <IconButton icon={'home'} color={focused ? "#6200EE" : 'black' } size={25} />
            )            
          }} />
          <Drawer.Screen name="Login" component={LoginForm}
          options={{
            title: 'Ingresar',
            drawerIcon: ({ focused, color, size }) => (               
              <IconButton icon={'login'} color={focused ? "#6200EE" : 'black' } size={25} />
            )            
          }} />
          <Drawer.Screen name="Register" component={RegisterForm}
          options={{
            title: 'Registro',
            drawerIcon: ({ focused, color, size }) => (               
              <IconButton icon={'account-plus'} color={focused ? "#6200EE" : 'black' } size={25} />
            )            
          }} /> 
        </> :
        <>
          {state.userType === "admin" ? 
          <>
            <Drawer.Screen name="Home" component={LoggedAdminTabNavigator}
            options={{
              title: 'Home',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'home'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} />
            <Drawer.Screen name="CreateCourt" component={CourtForm}
            options={{
              title: 'Crear Espacio',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'tennis'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} />   
            <Drawer.Screen name="MyCourts" component={MyCourts}
            options={{
              title: 'Mis espacios',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'soccer-field'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} /> 
            <Drawer.Screen name="Profile" component={Profile}
            options={{
              title: 'Perfil',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'account-circle'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} />
            <Drawer.Screen name="Logout" component={Logout}
            options={{
              title: 'Cerrar Sesión',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'logout'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} />           
          </>
          : 
          <>
            <Drawer.Screen name="Home" component={LoggedUserTabNavigator}
            options={{
              title: 'Home',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'home'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} />
            <Drawer.Screen name="Reservations" component={Reservations}
            options={{
              title: 'Mis Reservas',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'format-list-numbered'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} /> 
            <Drawer.Screen name="Profile" component={Profile}
            options={{
              title: 'Perfil',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'account-circle'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} />
            <Drawer.Screen name="Logout" component={Logout}
            options={{
              title: 'Cerrar Sesión',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'logout'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} />                  
          </>}
                  
        </>  
      }
      
    </Drawer.Navigator>
  )
}

export default DrawerNavigator;