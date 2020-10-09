import React from 'react';
import { Title, TextInput, Button, Text, Avatar } from 'react-native-paper';
import { View, Platform } from 'react-native';
import {logoutUser} from '../../utils/HTTPRequests';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../App';

const Logout = (navigation) => {
  const {state, authContext: {signOut} } = React.useContext(AuthContext)

  const handleSubmit = async() => {
    console.log("logged out")
    const token = state.userToken
    console.log(token)
    const userType = state.userType
    await logoutUser(userType,{token})
    signOut()
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('userType')
  }
  return (
      <Button icon="send" onPress={handleSubmit}>Logout</Button>
  )
}

export default Logout