import React from 'react';
import { View, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import { Modal, IconButton, Text, Button, Colors, TextInput, Title, Card } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getToken, payReservation, createReservation } from '../../utils/HTTPRequests';
import { AuthContext } from '../../App';
import { useNavigation } from '@react-navigation/native';

const ModalPayment = ({selectedDate, court, selectedTime, displayButton, hideModal}) => {
  const navigation = useNavigation();
  const { state } = React.useContext(AuthContext)
  const {dateString, day, month, year} = selectedDate;
  const { _id, openingTime, closingTime, pricePerHour} = court; 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    modal: {
      backgroundColor: 'black',
      width: "80%",
      alignSelf: "center",
      elevation: 3,
      marginBottom: 200
    },
    input: {
      width: "80%",
      alignSelf: "center",
      marginBottom: 5
    },
    title: {
      justifyContent: 'center',
      marginBottom: 5,
      width: "80%",
      alignSelf: "center"
    },
    button: {
      width: "40%",
      alignSelf: 'center',
      justifyContent: 'center'
    },
    card:{
      borderWidth: 3,
      borderBottomLeftRadius: 20, 
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20, 
      borderTopRightRadius: 20,
      borderColor: 'black',
      padding: 10
    },
    close: {
      backgroundColor: 'white',
      alignSelf: 'flex-end'
    }
  })
  
  const dismissModal = hideModal;

  const FormSchema = Yup.object().shape({  
    email: Yup.string().email('Ingrese un email válido').required("Este campo es obligatorio"),
    card_number: Yup.number().typeError('Solo se permiten números').test('len', 'La tarjeta debe tener 16 caracteres', val => val && val.toString().length === 16 ),
    card_cvc: Yup.number().typeError('Solo se permiten números').test('len', 'El CVC debe tener 3 caracteres', val => val && val.toString().length === 3 ),
    dues: Yup.number().typeError('Solo se permiten números').test('len', 'Máximo 12 cuotas', val => val && val.toString() <= 12 ).required("Este campo es obligatorio"),
    name: Yup.string().min(1,"Este campo es obligatorio").required("Este campo es obligatorio"),
    last_name: Yup.string().min(1,"Este campo es obligatorio").required("Este campo es obligatorio"),
    card_exp_month: Yup.number().typeError('Solo se permiten números').test('len', 'Escoja un mes válido', val => val && val.toString() >= 1 && val.toString() <= 12 ).required("Este campo es obligatorio"),
    card_exp_year: Yup.number().typeError('Solo se permiten números').test('len', 'Escoja un año válido', val => val && val.toString().length === 4 ),
    cell_phone: Yup.number().typeError('Solo se permiten números').test('len', 'El Celular debe tener 10 caracteres', val => val && val.toString().length === 10 ),
    city: Yup.string().min(1,"Este campo es obligatorio").required("Este campo es obligatorio"),
    address: Yup.string().min(1,"Este campo es obligatorio").required("Este campo es obligatorio"),
    doc_number: Yup.number().typeError('Solo se permiten números').test('len', 'Minimo 7 caracteres', val => val && val.toString().length  >= 7 ).required("Este campo es obligatorio")
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
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>

  const handleSubmit = async (values, actions) => {
    try {
      values.description = "Pay Court";
      values.value = pricePerHour;
      /*const token = await getToken()
      console.log("token",token)*/
      const paymentResponse = await payReservation(values)
      console.log("paymentResponse",paymentResponse)
      if (paymentResponse.payment.status) {
        let reserveValues = {};
        reserveValues.courtId = _id;
        reserveValues.date = dateString;
        reserveValues.startTime = `${selectedTime}:00`;
        reserveValues.endTime = `${parseInt(selectedTime)+1}:00`;
        reserveValues.month = month;
        reserveValues.year = year;
        reserveValues.status = "reserved";
        reserveValues.totalPrice = pricePerHour
        reserveValues.paidReserve = true;
        const result = await createReservation(reserveValues)
        actions.setSubmitting(false) 
        showToastWithGravityAndOffset("Pago exitoso, Reserva confirmada") 
        dismissModal();
        navigation.push('Home')
      } else {
        actions.setSubmitting(false) 
        showToastWithGravityAndOffset("Ocurrió un error durante la transacción, Reserva cancelada")
        dismissModal();
        throw Error(paymentResponse.payment.data.errors[0].errorMessage)        
      }
    } catch(err){
      console.log(err)
      actions.setSubmitting(false) 
      showToastWithGravityAndOffset("Ocurrió un error durante la transacción, Reserva cancelada")
      dismissModal();

    }
  }
  return (    
      <Modal visible={displayButton} color={Colors.primary} onDismiss={dismissModal} style={styles.modal} > 
        {/*<View style={styles.modal}>*/}
        <Card style={styles.card}>
        <IconButton onPress={dismissModal} style={styles.close} size={24} icon="close-circle" />
        <View style={styles.title}>
          <Title>Ingrese sus datos para el pago de la reserva</Title>
        </View>
        <Formik
          initialValues={{ email: '', card_number: '4575623182290326', card_cvc: '123', dues: '', name:'', last_name:'', card_exp_month: '12', card_exp_year: '2025', cell_phone: '', city: '', address: '', doc_number: ''}} 
          onSubmit={handleSubmit} validationSchema={FormSchema} >
          {({handleChange, handleSubmit, handleBlur, values, touched, errors, isSubmitting}) => (
            <>
              <TextInput label="Email" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} outlined placeholder="Ingrese el email" error={errors.email} style={styles.input} />
              {touched.email && errors.email ? <Text>{errors.email}</Text> : null}
              <TextInput label="Nombre" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} outlined placeholder="Ingrese su nombre" error={errors.name} style={styles.input} />
              {touched.name && errors.name ? <Text>{errors.name}</Text> : null}     
              <TextInput label="Apellidos" value={values.last_name} onChangeText={handleChange('last_name')} onBlur={handleBlur('last_name')} outlined placeholder="Ingrese sus apellidos" error={errors.last_name} style={styles.input} />
              {touched.last_name && errors.last_name ? <Text>{errors.last_name}</Text> : null}   
              <TextInput label="Número de Tarjeta" value={values.card_number} onChangeText={handleChange('card_number')} onBlur={handleBlur('card_number')} outlined placeholder="Ingrese su tarjeta" error={errors.card_number} style={styles.input} />
              {touched.card_number && errors.card_number ? <Text>{errors.card_number}</Text> : null} 
              <TextInput label="Mes de Vencimiento" value={values.card_exp_month} onChangeText={handleChange('card_exp_month')} onBlur={handleBlur('card_exp_month')} outlined placeholder="Ingrese el número de tarjeta" error={errors.card_exp_month} style={styles.input} />
              {touched.card_exp_month && errors.card_exp_month ? <Text>{errors.card_exp_month}</Text> : null}    
              <TextInput label="Año de Vencimiento" value={values.card_exp_year} onChangeText={handleChange('card_exp_year')} onBlur={handleBlur('card_exp_year')} outlined placeholder="Ingrese el número de tarjeta" error={errors.card_exp_year} style={styles.input} />
              {touched.card_exp_year && errors.card_exp_year ? <Text>{errors.card_exp_year}</Text> : null}         
              <TextInput label="CVC" value={values.card_cvc} onChangeText={handleChange('card_cvc')} onBlur={handleBlur('card_cvc')} placeholder="Ingrese el CVC" error={errors.card_cvc} outlined style={styles.input}  />
              {touched.card_cvc && errors.card_cvc ? <Text>{errors.card_cvc}</Text> : null}
              <TextInput label="Cuotas" value={values.dues} onChangeText={handleChange('dues')} onBlur={handleBlur('dues')} outlined placeholder="Ingrese el número de Cuotas" error={errors.dues} style={styles.input} />
              {touched.dues && errors.dues ? <Text>{errors.dues}</Text> : null}     
              <TextInput label="Número de Móvil" value={values.cell_phone} onChangeText={handleChange('cell_phone')} onBlur={handleBlur('cell_phone')} outlined placeholder="Ingrese el numero de su móvil" error={errors.cell_phone} style={styles.input} />
              {touched.cell_phone && errors.cell_phone ? <Text>{errors.cell_phone}</Text> : null} 
              <TextInput label="Ciudad" value={values.city} onChangeText={handleChange('city')} onBlur={handleBlur('city')} outlined placeholder="Ingrese el numero de su móvil" error={errors.city} style={styles.input} />
              {touched.city && errors.city ? <Text>{errors.city}</Text> : null}     
              <TextInput label="Dirección" value={values.address} onChangeText={handleChange('address')} onBlur={handleBlur('address')} outlined placeholder="Ingrese el numero de su móvil" error={errors.address} style={styles.input} />
              {touched.address && errors.address ? <Text>{errors.address}</Text> : null}   
              <TextInput label="Número de Documento" value={values.doc_number} onChangeText={handleChange('doc_number')} onBlur={handleBlur('doc_number')} outlined placeholder="Ingrese el numero de su móvil" error={errors.doc_number} style={styles.input} />
              {touched.doc_number && errors.doc_number ? <Text>{errors.doc_number}</Text> : null}
              { isSubmitting ? spinner : null }  
              {state.userType === "user" ? <Button disabled={isSubmitting} icon="send" mode="contained" onPress={handleSubmit} style={styles.button}>Pagar</Button> : null}            
            </>            
          )}
          </Formik>  
          </Card>
          {/*</View>*/}       
      </Modal>    
      
  )
}

export default ModalPayment;