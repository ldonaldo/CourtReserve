import React, { useEffect, useState } from 'react';
import { Title, Text, Card, Paragraph, Divider, IconButton} from 'react-native-paper';
import { ScrollView, View, StyleSheet } from 'react-native';
import { getReservationsByUser } from '../../utils/HTTPRequests';
import moment from 'moment';
import 'moment/locale/es';
import { useIsFocused } from '@react-navigation/native';

const Reservations = () => {
  const [reservationsUser, setReservationsUser] = useState([]);
  const isFocused = useIsFocused();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#ecf0f1',
      flexDirection: 'column',
      marginTop: 50,
      marginLeft: 5,
      marginRight: 5,
      width: "90%"
    },
    card: {
      flexDirection: 'row',
      borderWidth: 0,
      borderBottomLeftRadius: 20, 
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20, 
      borderTopRightRadius: 20,
      padding: 10,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5   
    },
    cardInitial: {
      flex: 1,
      flexDirection: 'column',
      borderColor: 'black',
      borderWidth: 3
    }, 
    cardEnd: {
      flex: 1,
      flexDirection: 'column',
      borderColor: 'black',
      borderWidth: 3
    },
    arrow: {
      justifyContent: 'center',
      flexDirection: 'column',
      alignSelf: 'center'
    }
  })
  useEffect(() => {
    const getResults = async () => {
      const allReservations = await getReservationsByUser()
      console.log("allReservations", allReservations)
      if (allReservations) {
        setReservationsUser(allReservations.reservations)
      }
      
    }
    getResults();
  },[isFocused])

  const reservationsList = reservationsUser.length > 0 ? reservationsUser.map(element => {
    const day = moment(element.date).locale("es").format('dddd').charAt(0).toUpperCase() + moment(element.date).locale("es").format('dddd').slice(1) ;
    const month = moment(element.date).locale("es").format('MMM').charAt(0).toUpperCase() + moment(element.date).locale("es").format('MMM').slice(1);
    return(      
      <View>
        <Title>{element.courtId.title}</Title>
        <View style={styles.card}>          
          <View style={styles.cardInitial}>
            <Card key={`start-${element._id}`}>
              <Card.Title title={`${moment(element.date).locale("es").format('DD')}`}></Card.Title>
              <Card.Content><Text>{`${day} ${month}`}</Text></Card.Content>
              <Divider />
              <Card.Content><Text>Hora: {element.startTime}</Text></Card.Content>
            </Card>
          </View>
          <IconButton icon="arrow-right-circle" style={styles.arrow} />
          <View style={styles.cardEnd}>
            <Card key={`end-${element._id}`}>
              <Card.Title title={`${moment(element.date).locale("es").format('DD')}`}></Card.Title>
              <Card.Content><Text>{`${day} ${month}`}</Text></Card.Content>
              <Divider />
              <Card.Content><Text>Hora: {element.endTime}</Text></Card.Content>
            </Card>
          </View>
        </View>
      </View>
    )    
  }) : <Text>No tienes reservas</Text>;

  return (  
    <ScrollView> 
      <View style={styles.container}>
        <Title style={{alignSelf: 'center'}}>Reservas</Title>
        {reservationsList}
      </View>
    </ScrollView>
  )
}

export default Reservations;