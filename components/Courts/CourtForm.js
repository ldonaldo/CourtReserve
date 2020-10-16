import React, {useState} from 'react';
import { Title, TextInput, Button, Text, Avatar, Switch, ToggleButton } from 'react-native-paper';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import moment from "moment"
import { View, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import {createCourt} from '../../utils/HTTPRequests'
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../App';

const CourtForm = ({navigation}) => {
  const {state, authContext: {updateCourts} } = React.useContext(AuthContext)
  const [openingHour, setOpeningHour] = useState( moment().toDate());  
  const [closingHour, setClosingHour] = useState( moment().add(1,'hours').toDate());  
  const [showOpening, setShowOpening] = useState(false);
  const [showClosing, setShowClosing] = useState(false);

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
      values.openingTime = `${openingHour.getHours()}:${minutesOpening}`
      values.closingTime = `${closingHour.getHours()}:${minutesClosing}`
      const newCourt = await createCourt(values) 
      showToastWithGravityAndOffset("Cancha registrada con éxito")
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
    pricePerHour : Yup.number().typeError('El valor debe ser numérico').required("Este campo es obligatorio").test('len', 'El precio debe tener más de 2 caracteres', val => val && val.toString().length >= 2 )/*,
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
  let openingDate = <Text>{`Opening Hour: ${openingHour.getHours()}:${minutesOpening}`}</Text>
  let minutesClosing = (closingHour.getMinutes() < 10 ? '0' : '') + closingHour.getMinutes()
  let closingDate = <Text>{`Closing Hour: ${closingHour.getHours()}:${minutesClosing}`}</Text>
  return(
    <>
    <View style={styles.container}> 
    <Title style={styles.title}>Create a new court</Title>   
    <Button mode="contained" icon="clock-start" onPress={() => showPicker("opening")} title="Show Opening">Select Opening Hour</Button>
    {showOpening && <DateTimePicker
      testID="dateTimePickerOpening"
      value={openingHour}
      mode="time"
      is24Hour={true}
      display="clock"
      onChange={(e,v) => handleChange(e,v,"opening")}
      timeZoneOffsetInSeconds={offset}  
      minuteInterval={59}
    />  }    
    {openingDate}
    <Button mode="contained" icon="clock-end" onPress={() => showPicker("closing")} title="Show Closing">Select Closing Hour</Button>
        
    {showClosing && <DateTimePicker
      testID="dateTimePickerClosing"
      value={closingHour}
      mode="time"
      is24Hour={true}
      display="clock"
      onChange={(e,v) => handleChange(e,v,"closing")}
      timeZoneOffsetInSeconds={offset}   
      minuteInterval={59}   
    />  }    
    {closingDate}
    <Formik
      initialValues={{ title: '', address: '', pricePerHour: '0'}} 
      onSubmit={handleSubmit} validationSchema={FormSchema} >
      {({handleChange, handleSubmit, values, errors, setFieldValue, isSubmitting}) => (
        <>
          <TextInput label="Title" value={values.title} onChangeText={handleChange('title')} outlined placeholder="Enter your Title" error={errors.title} style={styles.input} />
          {errors.title ? <Text>{errors.title}</Text> : null}
          <TextInput label="Address" value={values.address} onChangeText={handleChange('address')}  outlined placeholder="Enter your address" error={errors.address} style={styles.input} />
          {errors.address ? <Text>{errors.address}</Text> : null}          
          <TextInput label="Price per Hour" value={values.pricePerHour} onChangeText={handleChange('pricePerHour')} error={errors.pricePerHour} style={styles.input}  />
          {errors.pricePerHour ? <Text>{errors.pricePerHour}</Text> : null} 
          { isSubmitting ? spinner : null}         
          <Button icon="send" mode="contained" disabled={isSubmitting} onPress={handleSubmit}>Create Court</Button>            
        </>
        
      )}
    </Formik>
    
        
    
    </View> 
    </>
  )  
}

export default CourtForm;