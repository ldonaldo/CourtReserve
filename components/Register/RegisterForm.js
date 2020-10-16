import React, {useState, useEffect, useContext} from 'react';
import { Title, TextInput, Button, Text, Avatar, Switch, ToggleButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { View, Platform, StyleSheet, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import {userRegister} from '../../utils/HTTPRequests'
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../App'

const RegisterForm = ({navigation}) => {
  const [profilePhoto, setProfilePhoto] = useState('')
  const [userType, setUserType] = useState('user')
  const {state, authContext: {signUp} } = React.useContext(AuthContext)

  /*useEffect(() => {
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
  } */
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
      const {token, user} = await userRegister(userType,values)
      signUp({token, userType: userType})
      await AsyncStorage.setItem('token',token)
      await AsyncStorage.setItem('userType',userType) 
      showToastWithGravityAndOffset("User Registered Succesfully")
      actions.setSubmitting(false)    
    } catch (err){
      showToastWithGravityAndOffset("Error registering user")
    }
  } 

  const FormSchema = Yup.object().shape({  
    name: Yup.string()
    .required("Este campo es obligatorio")
    .min(10,"El número mínimo de campos es 10")
    .max(200, "El número máximo de campos es 200"),
    email: Yup.string().email('Email Inválido').required("Este campo es obligatorio"),
    password: Yup.string().required("Este campo es obligatorio").min(6,"La contraseña debe tener mínimo 6 caracteres"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Las contraseñas deben coincidir").required("Este campo es obligatorio").min(6,"La contraseña debe tener mínimo 6 caracteres"),
    cellphone : Yup.number().test('len', 'El teléfono debe tener 10 caracteres', val => val && val.toString().length === 10 )
  })

  const changeUserType = async (value) => {
    setUserType(value)
    await AsyncStorage.setItem('userType',value) 
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    input: {
      height: 60, 
      width: "80%", 
      marginBottom: 20, 
      fontSize: 18
    },
    toggleButton: {
      flex: 0.25,
      flexDirection: "row", 
      justifyContent: "space-around",
      alignItems: "flex-end"
    },
    button: {
      marginTop: 10
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
    }, 
    home: {
      flex: 0.25,
      flexDirection: "row",
      width: 20,
      height: 5
    }  
  })

  const spinner = 
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>

  return(
    <>
    <View style={styles.toggleButton}>    
    <ToggleButton.Group onValueChange={value =>changeUserType(value)} value={userType}>
      <View style={styles.buttonUser}>
        <Title>Register User</Title>
        <ToggleButton icon="account" disabled={userType=="user" ? true : false} value="user" />
      </View>
      <View style={styles.buttonAdmin}>
        <Title>Register Admin</Title>
        <ToggleButton icon="account-key" disabled={userType=="admin" ? true : false} value="admin" />
      </View>
    </ToggleButton.Group>
    </View> 
    <View style={styles.container}>   
      <Title>{`Register ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}</Title>    
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '', cellphone: ''}} 
        onSubmit={handleSubmit} validationSchema={FormSchema} >
        {({handleChange, handleBlur, handleSubmit, values, errors, isSubmitting}) => (
          <>
            <TextInput label="Name" value={values.name} onChangeText={handleChange('name')} outlined placeholder="Enter your Full Name" error={errors.name} style={styles.input} />
            {errors.name ? <Text>{errors.name}</Text> : null}
            <TextInput label="Email" value={values.email} onChangeText={handleChange('email')}  outlined placeholder="Enter your Email" error={errors.email} style={styles.input} />
            {errors.email ? <Text>{errors.email}</Text> : null}          
            <TextInput label="Password" value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} error={errors.password} style={styles.input}  />
            {errors.password ? <Text>{errors.password}</Text> : null}          
            <TextInput label="Confirm Password" value={values.confirmPassword} onChangeText={handleChange('confirmPassword')}  secureTextEntry={true} error={errors.confirmPassword} style={styles.input} />
            {errors.confirmPassword ? <Text>{errors.confirmPassword}</Text> : null}
            <TextInput label="Cellphone" value={values.cellphone} onChangeText={handleChange('cellphone')} outlined placeholder="Enter your Cellphone" error={errors.cellphone} style={styles.input} />
            {errors.cellphone ? <Text>{errors.cellphone}</Text> : null}  
            {/*<Button icon="camera-image" onPress={chooseFile}>Upload Photo</Button>*/}     
            { isSubmitting ? spinner : null }       
            <Button mode="contained" icon="send" onPress={handleSubmit} disabled={isSubmitting} style={styles.button}>Register</Button>           
          </>        
        )}
      </Formik>   
    </View>   
    {/*profilePhoto ? <Avatar.Image size={300} source={{uri:profilePhoto}} /> : null*/}
    </>
  )  
}

export default RegisterForm
