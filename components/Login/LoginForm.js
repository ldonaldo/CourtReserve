import React, {useState, useEffect, useContext} from 'react';
import { Title, TextInput, Button, Text, Avatar, ToggleButton } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { View, Platform } from 'react-native';
import {loginUser} from '../../utils/HTTPRequests';
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../App'


const LoginForm = (navigation) => {

  const {state, authContext: {signIn} } = React.useContext(AuthContext)

  const [userType, setUserType] = useState('user')
  
  const handleSubmit = async (values) => {
    try {
      const {token} = await loginUser("user",values)
      console.log(token)
      signIn({token, userType})
      await AsyncStorage.setItem('token',token)
      await AsyncStorage.setItem('userType',userType) 
      
    } catch(err){
      console.log(err)
    }
    
  } 

  const FormSchema = Yup.object().shape({  
    email: Yup.string().email().typeError('invalid Email').required("Required Field"),
    password: Yup.string().required("Required Field")
  })

  const changeUserType = async (value) => {
    setUserType(value)
    await AsyncStorage.setItem('userType',value) 
  }

  return(
    <>
    <Title>{`Login ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}</Title> 
    <ToggleButton.Group onValueChange={value => changeUserType(value)} value={userType}>
      <Title>Login User</Title>
      <ToggleButton icon="account" disabled={userType=="user" ? true : false} value="user" />
      <Title>Login Admin</Title>
      <ToggleButton icon="account-key" disabled={userType=="admin" ? true : false} value="admin" />
    </ToggleButton.Group>
    <Formik
      initialValues={{email: '', password: ''}} 
      onSubmit={handleSubmit} validationSchema={FormSchema} >
      {({handleChange, handleSubmit, values, errors}) => (
        <>
          <TextInput label="Email" value={values.email} onChangeText={handleChange('email')}  outlined placeholder="Enter your Email" error={errors.email} />
          {errors.email ? <Text>{errors.email}</Text> : null}
          <TextInput label="Password" value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} error={errors.password}  />
          {errors.password ? <Text>{errors.password}</Text> : null}
          <Button icon="send" mode="contained" onPress={handleSubmit}>Submit</Button> 
        </>        
      )}
    </Formik>
    </>
  )  
}

export default LoginForm