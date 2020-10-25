import React, {useState, useEffect, useContext} from 'react';
import { Title, TextInput, Button, Text, Avatar, ToggleButton } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { View, StyleSheet, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import {loginUser} from '../../utils/HTTPRequests';
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../App'


const LoginForm = (navigation) => {

  const {state, authContext: {signIn} } = React.useContext(AuthContext);

  const [userType, setUserType] = useState('user');

  const showToastWithGravityAndOffset = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };
  const handleSubmit = async (values, actions) => {
    try {
      const {token} = await loginUser(userType,values)
      signIn({token, userType})
      await AsyncStorage.setItem('token',token)
      await AsyncStorage.setItem('userType',userType) 
      showToastWithGravityAndOffset("Sesión Iniciada")  
      actions.setSubmitting(false)
    } catch(err){
      if (err.response.status === 401) {
        showToastWithGravityAndOffset("Email o contraseña incorrectas")
      } else {
        showToastWithGravityAndOffset("Error de Servidor")  
      }   
    }
    
  } 

  const FormSchema = Yup.object().shape({  
    email: Yup.string().email('Email Inválido').required("Este campo es obligatorio"),
    password: Yup.string().required("Este campo es obligatorio")
  })

  const changeUserType = async (value) => {
    setUserType(value)
    await AsyncStorage.setItem('userType',value) 
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    }, 
    input: {
      height: 60, 
      width: "80%", 
      marginBottom: 20, 
      fontSize: 18
    },
    button: {
      marginTop: 10
    }, 
    title: {
      marginBottom: 40
    },
    toggleButton: {
      flex: 0.25,
      flexDirection: "row", 
      justifyContent: "space-around",
      alignItems: "flex-end"
    },
    buttonUser: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center", 
      borderRadius: 10,
      borderColor: "#20232a"
    },
    buttonAdmin: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  });
  const spinner = 
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>

  return(
    <>
      <View style={styles.toggleButton}> 
        <ToggleButton.Group onValueChange={value => changeUserType(value)} value={userType}  >
          <View style={styles.buttonUser}>
          <Title>Ingresar Usuario</Title>
          <ToggleButton icon="account" disabled={userType=="user" ? true : false} value="user" />
          </View>
          <View style={styles.buttonAdmin}>
          <Title>Ingresar Admin</Title>
          <ToggleButton icon="account-key" disabled={userType=="admin" ? true : false} value="admin" />
          </View>
        </ToggleButton.Group>
      </View> 
      <View style={styles.container}>    
      {userType == "user" ? <Title style={styles.title}>Ingresar Usuario</Title> : <Title style={styles.title}>Ingresar Admin</Title>}   
      
      <Formik
        initialValues={{email: '', password: ''}} 
        onSubmit={handleSubmit} validationSchema={FormSchema} >
        {({handleChange, handleSubmit, handleBlur, values, touched, errors, isSubmitting}) => (
          <>
            <TextInput label="Email" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} outlined placeholder="Ingresa tu email" error={errors.email} style={styles.input} />
            {touched.email && errors.email ? <Text>{errors.email}</Text> : null}
            <TextInput label="Contraseña" value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} secureTextEntry={true} error={errors.password} style={styles.input}  />
            {touched.password && errors.password ? <Text>{errors.password}</Text> : null}
            {isSubmitting ? spinner : null}
            <Button icon="send" mode="contained" disabled={isSubmitting} onPress={handleSubmit} style={styles.button}>Enviar</Button> 
          </>        
        )}
      </Formik>
      
    </View>
    
    </>
  )  
}

export default LoginForm