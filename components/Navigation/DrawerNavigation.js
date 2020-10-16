import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, IconButton } from 'react-native-paper'
import LoginForm from '../Login/LoginForm';
import RegisterForm from '../Register/RegisterForm';
import Logout from '../Logout/Logout';
import { AuthContext } from '../../App';
import {NonLoggedTabNavigator, LoggedUserTabNavigator, LoggedAdminTabNavigator} from './TabNavigator';
import CourtForm from '../Courts/CourtForm';

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
            title: 'Login',
            drawerIcon: ({ focused, color, size }) => (               
              <IconButton icon={'login'} color={focused ? "#6200EE" : 'black' } size={25} />
            )            
          }} />
          <Drawer.Screen name="Register" component={RegisterForm}
          options={{
            title: 'Register',
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
              title: 'Create Court',
              drawerIcon: ({ focused, color, size }) => (               
                <IconButton icon={'tennis'} color={focused ? "#6200EE" : 'black' } size={25} />
              )            
            }} />   
            <Drawer.Screen name="Logout" component={Logout}
            options={{
              title: 'Logout',
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
            <Drawer.Screen name="Logout" component={Logout}
            options={{
              title: 'Logout',
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