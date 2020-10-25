import React, {useState} from 'react';
import { Title, TextInput, Button, Text, Avatar, Switch, ToggleButton } from 'react-native-paper';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import moment from "moment"
import { View, Platform, StyleSheet, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView } from 'react-native';
import {createCourt, updateCourt, submitPhotosCloudinary} from '../../utils/HTTPRequests'
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../App';

const CourtForm = ({route, navigation}) => {
  
  const { court = {}, edit = false } = route.params || {}
  const {_id, title, address, pricePerHour, courtPhotos, openingTime, closingTime} = court
  const [openingHour, setOpeningHour] = useState( moment().toDate());  
  const [closingHour, setClosingHour] = useState( moment().add(1,'hours').toDate());  
  const [showOpening, setShowOpening] = useState(false);
  const [showClosing, setShowClosing] = useState(false);
  const [permission, setPermission] = useState('denied');

  const selectPhotos = async(setFieldValue) => {
    try {
    if (Platform.OS !== 'web'){
      const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted'){        
        setFieldValue('photos', '')
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
        setFieldValue('photos', '')
        return;
      }
      setFieldValue('photos', pickerResult)
    }
    } catch(err){
      setFieldValue('photos', '')  
    }
  } 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50,
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
      let {url} = await submitPhotosCloudinary(values.photos)
      values.courtPhotos = url
      values.openingTime = `${openingHour.getHours()}:${minutesOpening}`
      values.closingTime = `${closingHour.getHours()}:${minutesClosing}`
      values._id = _id
      const newCourt = edit ? await updateCourt(values) : await createCourt(values) 
      console.log("new Court",newCourt)
      edit ? showToastWithGravityAndOffset("Cancha actualizada con éxito") : showToastWithGravityAndOffset("Cancha registrada con éxito")
      actions.setSubmitting(false)
      navigation.navigate('Home')
    } catch (err){
      showToastWithGravityAndOffset("Ocurrió un error creando la cancha")
      actions.setSubmitting(false)
    }
  }  
    
  const handleChange = (event, selectedDate, modal) => {    
    let currentDate = selectedDate; 
    if (modal === "opening") {
      setShowOpening(false);
      event.type === "set" ? setOpeningHour(currentDate) : null
    } else {  
      setShowClosing(false); 
      event.type === "set" ? setClosingHour(currentDate) : null  
    }
  }

  const spinner = 
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>

  const offset = new Date().getTimezoneOffset() * -60;

  const showPicker = (modal) => {
    modal === "opening" ? setShowOpening(true) : setShowClosing(true)
  }

  const FormSchema = Yup.object().shape({  
    title: Yup.string()
    .required("Este campo es obligatorio")
    .min(5,"El número mínimo de campos es 5")
    .max(60, "El número máximo de campos es 60"),
    address: Yup.string().required("Este campo es obligatorio").min(6,"La dirección debe tener mínimo 6 caracteres"),
    pricePerHour : Yup.number().typeError('El valor debe ser numérico').required("Este campo es obligatorio").test('len', 'El precio debe tener más de 2 caracteres', val => val && val.toString().length >= 4  && val.toString() >= 5000 ),
    photos: Yup.string().required("Este campo es obligatorio").min(15, "Una foto es requerida")/*,
    openingTime: Yup.string().test('not empty', 'La hora de apertura no puede ser vacía', function(value){
      return !!value
    }).test("openingTime_test","La hora de apertura debe ser menor a la de cierre", function(value){
      const { end_time } = this.parent;
      return isSameOrBefore(value, end_time);
    }),
    closingTime: Yup.string().required("Este campo es obligatorio")*/

  })

  const isSameOrBefore = (startTime, endTime) => {
    return moment(startTime, 'HH:mm').isSameOrBefore(moment(endTime, 'HH:mm'));
  }

  let minutesOpening = (openingHour.getMinutes() < 10 ? '0' : '') + openingHour.getMinutes()
  let openingDate = <Text>{`Hora de Apertura: ${openingHour.getHours()}:${minutesOpening}`}</Text>
  let minutesClosing = (closingHour.getMinutes() < 10 ? '0' : '') + closingHour.getMinutes()
  let closingDate = <Text>{`Hora de Salida: ${closingHour.getHours()}:${minutesClosing}`}</Text>
  return(
    <>
    <ScrollView>
      <View style={styles.container}> 
      { edit ? <Title style={styles.title}>Actualiza tu Espacio</Title> : <Title style={styles.title}>Crear un nuevo espacio</Title>}   
      <Button mode="contained" icon="clock-start" onPress={() => showPicker("opening")} title="Show Opening">Seleccionar Hora Entrada</Button>
      {showOpening && <DateTimePicker
        testID="dateTimePickerOpening"
        value={openingHour || moment().toDate()}
        mode="time"
        is24Hour={true}
        display="clock"
        onChange={(e,v) => handleChange(e,v,"opening")}
        timeZoneOffsetInSeconds={offset}  
        minuteInterval={59}
      />  }    
      {openingDate}
      <Button mode="contained" icon="clock-end" onPress={() => showPicker("closing")} title="Show Closing">Seleccionar Hora Salida</Button>
          
      {showClosing && <DateTimePicker
        testID="dateTimePickerClosing"
        value={closingHour || moment().add(1,'hours').toDate()}
        mode="time"
        is24Hour={true}
        display="clock"
        onChange={(e,v) => handleChange(e,v,"closing")}
        timeZoneOffsetInSeconds={offset}   
        minuteInterval={59}   
      />  }    
      {closingDate}
      <Formik
        initialValues={{ title: title || '', address: address || '', pricePerHour: pricePerHour ? pricePerHour.toString() : '0', photos: courtPhotos || ''}} 
        onSubmit={handleSubmit} validationSchema={FormSchema} enableReinitialize={true} >
        {({handleChange, handleSubmit, handleBlur, values, touched, errors, setFieldValue, isSubmitting}) => (
          <>
            <TextInput label="Título" value={values.title} onChangeText={handleChange('title')} onBlur={handleBlur('title')} outlined placeholder="Ingresa el título" error={errors.title} style={styles.input} />
            {touched.title && errors.title ? <Text>{errors.title}</Text> : null}
            <TextInput label="Dirección" value={values.address} onChangeText={handleChange('address')} onBlur={handleBlur('address')} outlined placeholder="Ingresa la dirección" error={errors.address} style={styles.input} />
            {touched.address && errors.address ? <Text>{errors.address}</Text> : null}          
            <TextInput label="Precio por Hora" value={values.pricePerHour} onChangeText={handleChange('pricePerHour')} onBlur={handleBlur('pricePerHour')} error={errors.pricePerHour} style={styles.input}  />
            {touched.pricePerHour && errors.pricePerHour ? <Text>{errors.pricePerHour}</Text> : null}
            <TouchableOpacity onPress={() => selectPhotos(setFieldValue)}>
              <Text>
                Subir Imagen
              </Text>
            </TouchableOpacity>    
            {edit ? 
              (typeof values.photos === 'object' ? 
              <Image source={{ uri: values.photos.uri }} style={{ width: 150, height: 150 }} /> : <Image source={{ uri: values.photos }} style={{ width: 150, height: 150 }} />)
            : 
              (typeof values.photos === 'object' ? 
              <Image source={{ uri: values.photos.uri }} style={{ width: 150, height: 150 }} /> 
              : <Image source={{ uri: values.photos }} style={{ width: 150, height: 150 }} />)}
            {errors.photos ? <Text>{errors.photos}</Text> : null} 
            { isSubmitting ? spinner : null}         
            { edit ? <Button icon="send" mode="contained" disabled={isSubmitting} onPress={handleSubmit} style={styles.button}>Actualizar</Button>: <Button icon="send" mode="contained" disabled={isSubmitting} onPress={handleSubmit} style={styles.button}>Crear Cancha</Button>}            
          </>
          
        )}
      </Formik>    
      </View> 
    </ScrollView>
    </>
  )  
}

export default CourtForm;