import React, {useState, useEffect, useContext} from 'react';
import { Title, TextInput, Button, Text, Avatar, Switch, ToggleButton } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { View, Platform } from 'react-native';
import {userRegister} from '../../utils/HTTPRequests'
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../App'

const RegisterForm = ({navigation}) => {
  const [profilePhoto, setProfilePhoto] = useState('')
  const [userType, setUserType] = useState('user')
  const {state, authContext: {signUp} } = React.useContext(AuthContext)

  useEffect(() => {
    const askPermissions = async() => {
      if (Platform.OS !== 'web'){
        const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted'){
          alert('Sorry we need camera roll permissions to make this work');
        }
      }
    } 
    askPermissions();
  })

  let chooseFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result)
    if (!result.cancelled) {
      setProfilePhoto(result.uri);
    } 
  } 
  const handleSubmit = async (values) => {
    const {token, user} = await userRegister(userType,values)
    signUp({token, userType: userType})
    await AsyncStorage.setItem('token',token)
    await AsyncStorage.setItem('userType',userType) 
    
  } 

  const FormSchema = Yup.object().shape({  
    name: Yup.string()
    .required("Este campo es obligatorio")
    .min(10,"El número mínimo de campos es 10")
    .max(200, "El número máximo de campos es 200"),
    email: Yup.string().email().typeError('Email inválido').required("Este campo es obligatorio"),
    password: Yup.string().required("Este campo es obligatorio").min(6,"La contraseña debe tener mínimo 6 caracteres"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Las contraseñas deben coincidir").required("Este campo es obligatorio").min(6,"La contraseña debe tener mínimo 6 caracteres"),
    cellphone : Yup.number().test('len', 'El teléfono debe tener 10 caracteres', val => val && val.toString().length === 10 )
  })
  console.log(state)

  const changeUserType = async (value) => {
    setUserType(value)
    await AsyncStorage.setItem('userType',value) 
  }

  return(
    <>
    <Button title="Home" onPress={() => navigation.navigate('Home')}>Home</Button>
    <Title>{`Register ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}</Title>    
    <Formik
      initialValues={{ name: '', email: '', password: '', confirmPassword: '', cellphone: ''}} 
      onSubmit={handleSubmit} validationSchema={FormSchema} >
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <>
          <TextInput label="Name" value={values.name} onChangeText={handleChange('name')} outlined placeholder="Enter your Full Name" error={errors.name} />
          {errors.name ? <Text>{errors.name}</Text> : null}
          <TextInput label="Email" value={values.email} onChangeText={handleChange('email')}  outlined placeholder="Enter your Email" error={errors.email} />
          {errors.email ? <Text>{errors.email}</Text> : null}          
          <TextInput label="Password" value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} error={errors.password}  />
          {errors.password ? <Text>{errors.password}</Text> : null}          
          <TextInput label="Confirm Password" value={values.confirmPassword} onChangeText={handleChange('confirmPassword')}  secureTextEntry={true} error={errors.confirmPassword} />
          {errors.confirmPassword ? <Text>{errors.confirmPassword}</Text> : null}
          <TextInput label="Cellphone" value={values.cellphone} onChangeText={handleChange('cellphone')} outlined placeholder="Enter your Cellphone" error={errors.cellphone} />
          {errors.cellphone ? <Text>{errors.cellphone}</Text> : null}  
          <Button icon="camera-image" onPress={chooseFile}>Upload Photo</Button>
          <ToggleButton.Group onValueChange={value => changeUserType(value)} value={userType}>
            <Title>Register User</Title>
            <ToggleButton icon="account" disabled={userType=="user" ? true : false} value="user" />
            <Title>Register Admin</Title>
            <ToggleButton icon="account-key" disabled={userType=="admin" ? true : false} value="admin" />
          </ToggleButton.Group>
          <Button icon="send" onPress={handleSubmit}>Register</Button>  
          
        </>
        
      )}
    </Formik>          
    {profilePhoto ? <Avatar.Image size={300} source={{uri:profilePhoto}} /> : null}
    </>
  )  
}

export default RegisterForm
