import React from 'react';
import { Title, Text, Button, Card, Paragraph, Chip} from 'react-native-paper';
import moment from 'moment';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Court = ({court}) => {
  const {title, address, pricePerHour, openingTime, closingTime} = court;  
  const openingTimeMoment = moment().set({ hour: openingTime.split(":")[0], minute: openingTime.split(":")[1], second: 0, millisecond: 0});
  const closingTimeMoment = moment().set({ hour: closingTime.split(":")[0], minute: closingTime.split(":")[1], second: 0, millisecond: 0});
  const actualTime = moment()
  const isOpen = actualTime.isBetween(openingTimeMoment, closingTimeMoment)
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      width: "100%"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    }, 
    card:{
      borderWidth: 3,
      borderBottomLeftRadius: 20, 
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20, 
      borderTopRightRadius: 20,
      borderColor: '#6200EE',
      padding: 10,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5
    },
    content: {
      width: "90%"
    },
    button: {
      alignSelf: 'center'
    }, 
    cover: {
      width: "90%",
      alignSelf: 'center'
    }
  });

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={title} subtitle={address} />
        <Card.Content style={styles.content}>
          <Paragraph>Disponible de  {openingTime} a {closingTime}</Paragraph>   
          <Paragraph>Precio por Hora: {pricePerHour}</Paragraph> 
          {isOpen ? <Chip  icon="bookmark-check">Abierto</Chip> : <Chip icon="close">Actualmente Cerrada</Chip> }
        </Card.Content>
        <Card.Actions style={styles.button}>
          <Button icon="tennis-ball" mode="contained" onPress={() => navigation.navigate('CourtCalendar',{
            court: court
          })}>Reservar!</Button>
        </Card.Actions>
        <Card.Cover style={styles.cover} source={{ uri: 'https://i.ibb.co/vPg8jzm/parqueraquetas.jpg' }} />
      </Card>
    </View>
  )
}

export default Court