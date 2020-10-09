import React, {useState} from 'react';
import { BottomNavigation, Text} from 'react-native-paper';
import Home from '../../pages/Home';
import Login from '../Login/LoginForm';
import Logout from '../Logout/Logout';
import Register from '../Register/RegisterForm';
import { AuthContext } from '../../App';

const Navigation = () => {
  const {state } = React.useContext(AuthContext)
  const [index, setIndex] = useState(0);
  console.log(state)
  const [ routes ] = useState( state.userToken === null ? 
    [      
      { key: 'login', title: 'Login', icon: 'login'},
      { key: 'register', title: 'Register', icon: 'account-plus'}
    ] : 
    [   
      { key: 'login', title: 'Login', icon: 'login'},
      { key: 'register', title: 'Register', icon: 'account-plus'},
      { key: 'logout', title: 'Logout', icon: 'logout'}   
    ]
  );

  const loginRoute = () => <Login />
  const registerRoute = () => <Register />
  const logoutRoute = () => <Logout />

  const renderScene = 
    BottomNavigation.SceneMap({
      login: loginRoute,
      register: registerRoute,
      logout: logoutRoute
    })
  

  return (
    <BottomNavigation 
      navigationState={{ index, routes}}
      onIndexChange={setIndex} renderScene={renderScene}
    />
  )
}

export default Navigation;