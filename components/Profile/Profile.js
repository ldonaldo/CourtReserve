import React, {useEffect, useState} from 'react';
import {Paragraph, Text, TextInput, Title, Button, Dialog, Portal, Provider} from 'react-native-paper';
import { View, StyleSheet, ScrollView, Image, ToastAndroid, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { getPerson, updatePerson, deletePerson} from '../../utils/HTTPRequests';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../App';

const Profile = ({navigation}) => {
  const {state, authContext: {signOut} } = React.useContext(AuthContext)
  const [person, setPerson] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect( () => {
    const fetchData = async () => {
      const user = await getPerson();
      setPerson(user)
    }
    fetchData();
  },[])

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
    toggleButton: {
      flex: 0.25,
      flexDirection: "row", 
      justifyContent: "space-around",
      alignItems: "flex-end"
    },
    button: {
      marginTop: 10,
      justifyContent: "center",
      alignItems: "center", 
      borderRadius: 10,
    }, 
    buttonDelete: {
      backgroundColor: '#ef5350'
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

  const FormSchema = Yup.object().shape({  
    name: Yup.string()
    .required("Este campo es obligatorio")
    .min(10,"El número mínimo de campos es 10")
    .max(200, "El número máximo de campos es 200"),    
    cellphone : Yup.number().typeError('Solo se permiten números').test('len', 'El teléfono debe tener 10 caracteres', val => val && val.toString().length === 10 )
  })

  const showToastWithGravityAndOffset = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  const spinner = 
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>

  const handleSubmit = async (values, actions) => {
    try {      
      const update = await updatePerson(values) 
      showToastWithGravityAndOffset("Usuario actualizado exitosamente")
      navigation.navigate('Home')
      actions.setSubmitting(false) 
    } catch (err){
      showToastWithGravityAndOffset("Ocurrió un error con la transacción")
      actions.setSubmitting(false)
    }
  } 
  const handleSubmitDelete = async () => {
    try {
      setLoading(true);
      const deletedUser = await deletePerson();
      signOut()
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('userType')      
      setLoading(false);
      showToastWithGravityAndOffset("Usuario eliminado exitosamente")
      navigation.navigate('Home')        
    } catch(err){
      setLoading(false);
      showToastWithGravityAndOffset("Error eliminando usuario")    
    }
  }  

  return (
    <>
    <Provider>
    <View style={styles.container}>
      <Title>Mi perfil</Title>   
      <Formik
      initialValues={{ name: person.name, email: person.email, cellphone: person.cellphone}} 
      onSubmit={handleSubmit} validationSchema={FormSchema} enableReinitialize={true} >
      {({handleChange, handleBlur, handleSubmit, values, touched, errors, isSubmitting}) => (
        <>
          <TextInput label="Nombre" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} outlined placeholder="Ingrese su nombre" error={errors.name} style={styles.input} />
          {touched.name && errors.name ? <Text>{errors.name}</Text> : null}
          <TextInput label="Email" value={values.email} disabled onChangeText={handleChange('email')} onBlur={handleBlur('email')}  outlined placeholder="Ingrese su email" error={errors.email} style={styles.input} />
          {touched.email && errors.email ? <Text>{errors.email}</Text> : null}              
          <TextInput label="Telefono" value={values.cellphone} onChangeText={handleChange('cellphone')} onBlur={handleBlur('cellphone')} outlined placeholder="Ingrese su telefono" error={errors.cellphone} style={styles.input} />
          {touched.cellphone && errors.cellphone ? <Text>{errors.cellphone}</Text> : null}  
          {person.profilePhoto ? 
            <Image source={{ uri: person.profilePhoto}} style={{ width: 150, height: 150 }} />: null}  
          { isSubmitting ? spinner : null }       
          <Button mode="contained" icon="update" onPress={handleSubmit} disabled={isSubmitting} style={styles.button}>Actualizar</Button>           
        </>        
      )}
      </Formik> 
      <Button mode="contained" icon="account-remove" onPress={() => setModalVisible(true)} style={[styles.button, styles.buttonDelete]}>Eliminar Perfil</Button>   
    </View>  
    <View>      
      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>Estás Seguro de eliminar tu perfil?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Se borrarán todos los recursos asociados a tu cuenta (canchas, reservas, etc)</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            {isLoading ? spinner : null}
            <Button disabled={isLoading} onPress={handleSubmitDelete}>Confirmar</Button>
            <Button disabled={isLoading} onPress={() => setModalVisible(false)}>Cancelar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
    </Provider>
    </> 
  )
}

export default Profile;