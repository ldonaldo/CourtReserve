import React, {useState} from 'react';
import { Title, TextInput, Button, Text, ToggleButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { View, Platform, StyleSheet, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView } from 'react-native';
import {userRegister, submitPhotosCloudinary} from '../../utils/HTTPRequests'
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../App'

const RegisterForm = ({navigation}) => {
  const [userType, setUserType] = useState('user')
  const [permission, setPermission] = useState('denied');
  const {state, authContext: {signUp} } = React.useContext(AuthContext)

  const selectPhoto = async(setFieldValue) => {
    try {
    if (Platform.OS !== 'web'){
      const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted'){        
        setFieldValue('profilePhoto', '')
        alert('Se necesitan los permisos');
        setPermission('denied')
        return
      } else {
        setPermission('granted')
      }
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true
      });
      if (pickerResult.cancelled === true) {
        setFieldValue('profilePhoto', '')
        return;
      }
      setFieldValue('profilePhoto', pickerResult)
    }
    } catch(err){
      setFieldValue('profilePhoto', '')  
    }
  } 
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
      let {url} = await submitPhotosCloudinary(values.profilePhoto)
      values.profilePhoto = url
      const {token, user} = await userRegister(userType,values)
      signUp({token, userType: userType})
      await AsyncStorage.setItem('token',token)
      await AsyncStorage.setItem('userType',userType) 
      showToastWithGravityAndOffset("Usuario registrado exitosamente")
      actions.setSubmitting(false)    
    } catch (err){
      showToastWithGravityAndOffset("Error registrando usuario")
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
    cellphone : Yup.number().test('len', 'El teléfono debe tener 10 caracteres', val => val && val.toString().length === 10 ),
    profilePhoto: Yup.string().required("Este campo es obligatorio").min(15, "Una foto es requerida")
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
      marginBottom: 20
    },
    input: {
      height: 60, 
      width: "80%", 
      marginBottom: 20, 
      fontSize: 18
    },
    toggleButton: {
      marginTop: 50,
      flex: 1,
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
      flex: 0.5,
      flexDirection: "row",
    }  
  })

  const spinner = 
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>

  return(
    <>
    <ScrollView>
    <View style={styles.toggleButton}>    
    <ToggleButton.Group onValueChange={value =>changeUserType(value)} value={userType}>
      <View style={styles.buttonUser}>
        <Title>Registrar Usuario</Title>
        <ToggleButton icon="account" disabled={userType=="user" ? true : false} value="user" />
      </View>
      <View style={styles.buttonAdmin}>
        <Title>Registrar Admin</Title>
        <ToggleButton icon="account-key" disabled={userType=="admin" ? true : false} value="admin" />
      </View>
    </ToggleButton.Group>
    </View>     
    <View style={styles.container}>   
    
    {userType == "user" ? <Title>Registrar Usuario</Title> : <Title>Registrar Admin</Title>}  
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '', cellphone: '', profilePhoto: ''}} 
        onSubmit={handleSubmit} validationSchema={FormSchema} enableReinitialize={true} >
        {({handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue}) => (
          <>
            <TextInput label="Nombre" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} outlined placeholder="Ingresa tu nombre" error={errors.name} style={styles.input} />
            {touched.name && errors.name ? <Text>{errors.name}</Text> : null}
            <TextInput label="Email" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')}  outlined placeholder="Ingresa tu correo" error={errors.email} style={styles.input} />
            {touched.email && errors.email ? <Text>{errors.email}</Text> : null}          
            <TextInput label="Contraseña" value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('name')} secureTextEntry={true} error={errors.password} style={styles.input}  />
            {touched.password && errors.password ? <Text>{errors.password}</Text> : null}          
            <TextInput label="Confirmar Contraseña" value={values.confirmPassword} onChangeText={handleChange('confirmPassword')} onBlur={handleBlur('name')} secureTextEntry={true} error={errors.confirmPassword} style={styles.input} />
            {touched.confirmPassword && errors.confirmPassword ? <Text>{errors.confirmPassword}</Text> : null}
            <TextInput label="Telefono" value={values.cellphone} onChangeText={handleChange('cellphone')} onBlur={handleBlur('name')} outlined placeholder="Ingresa tu contraseña" error={errors.cellphone} style={styles.input} />
            {touched.cellphone && errors.cellphone ? <Text>{errors.cellphone}</Text> : null}  
            <TouchableOpacity onPress={() => selectPhoto(setFieldValue)}>
              <Text>
                Imagen de Perfil
              </Text>
            </TouchableOpacity>     
            { isSubmitting ? spinner : null }   
            {values.profilePhoto ? 
            <Image source={{ uri: values.profilePhoto.uri }} style={{ width: 150, height: 150 }} />: null}
            {errors.profilePhoto ? <Text>{errors.profilePhoto}</Text> : null} 
            <Button mode="contained" icon="send" onPress={handleSubmit} disabled={isSubmitting} style={styles.button}>Registrar</Button>           
          </>        
        )}
      </Formik>   
    </View>  
    </ScrollView>    
    </>
  )  
}

export default RegisterForm
