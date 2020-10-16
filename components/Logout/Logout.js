import React, {useState} from 'react';
import { Title, Paragraph, Button, Text, Dialog, Portal, Provider } from 'react-native-paper';
import { View, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import {logoutUser} from '../../utils/HTTPRequests';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../App';

const Logout = (navigation) => {
  const {state, authContext: {signOut} } = React.useContext(AuthContext)
  const [modalVisible, setModalVisible] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async() => {
    setLoading(true)
    console.log("logged out")
    const token = state.userToken
    console.log(token)
    const userType = state.userType
    await logoutUser(userType,{token})
    signOut()
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('userType')
    setLoading(false);
    showToastWithGravityAndOffset("Sesión cerrada exitosamente")  
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
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

  const hideDialog = () => setModalVisible(false);
  const showDialog = () => setModalVisible(true);

  const spinner = 
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  return (
    <>
      <View style={styles.container}>
        <Provider>        
        <Portal>
          <Dialog visible={modalVisible} onDismiss={hideDialog}>
            <Dialog.Title>Estás Seguro?</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Desea cerrar sesión?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              {isLoading ? spinner : null}
              <Button disabled={isLoading} onPress={handleSubmit}>Confirmar</Button>
              <Button disabled={isLoading} onPress={hideDialog}>Cancelar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        </Provider>
        <Button icon="send" mode="contained" onPress={showDialog}>Logout</Button>
      </View>
    </>
  )
}

export default Logout