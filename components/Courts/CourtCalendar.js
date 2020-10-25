import React, {useState, useEffect} from 'react';
import { Title, Text, Button, RadioButton, Card, Paragraph, Provider, Portal, FAB} from 'react-native-paper';
import { Agenda} from 'react-native-calendars';
import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import moment from 'moment';
import ModalPayment from './ModalPayment';
import { createReservation, getReservationsofDate, getMonthlyReservations } from '../../utils/HTTPRequests';
import { AuthContext } from '../../App';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  agenda: {
    marginBottom: 5
  },
  reserve: {
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 50,
    flex: 1,
    minHeight: 1000
  },
  fab: {
    margin: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'center',
    elevation: 1    
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0  
  }
})

const CourtCalendar = ({ route }) => {
  const { state } = React.useContext(AuthContext)
  const navigation = useNavigation();
  const { court } = route.params
  const [selectedDate, setSelectedDate] = useState({
    dateString: moment().utcOffset('GMT-05:00').format("YYYY-MM-DD"),
    day: moment().utcOffset('GMT-06:00').format("DD"),
    month: moment().format("MM"),
    year: moment().format("YYYY")
  })
  const [selectedMonth, setSelectedMonth] = useState({
    year: moment().format("YYYY")
  })
  const [events, setEvents] = useState({})

  useEffect(() => {
    const { year} = selectedMonth
    async function getEvents(){
      const events = await getMonthlyReservations(court._id, year)
      const newEvents = {};
      if (events.reservations && events.reservations.length > 0 ) {
        events.reservations.map(element => newEvents[element.date] = {marked: true}  )
      }
      setEvents(newEvents)
    }
    getEvents();
  }, [selectedMonth])
  return (
    <>
      <Provider>
        <Portal>
          <Text>Seleccione el día para ver las reservaciones</Text>      
          <Agenda 
            loadItemsForMonth={(item) => {setSelectedMonth({month: item.month, year: item.year})}}
            onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
            onDayPress={(day)=>{setSelectedDate({dateString: day.dateString, day: day.day, month: day.month, year: day.year})}}
            onDayLongPress={(day) => {setSelectedDate({dateString: day.dateString, day: day.day, month: day.month, year: day.year})}}
            onDayChange={(day)=>{setSelectedDate({dateString: day.dateString, day: day.day, month: day.month, year: day.year})}}
            hideExtraDays={true}
            pastScrollRange={2}
            futureScrollRange={10}
            renderItem={(item, firstItemInDay) => {return (<AgendaView selectedDate={selectedDate} court={court} />);}}
            renderDay={(totalDay, item) => {return (<AgendaView selectedDate={selectedDate} court={court} />);}}
            renderEmptyDate={() => {return (<AgendaView selectedDate={selectedDate} court={court} />);}}
            renderKnob={() => {return (<Button size={60} icon="chevron-double-down" />);}}
            renderEmptyData = {() => {return (<AgendaView selectedDate={selectedDate} court={court} />);}}
            rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
            hideKnob={false}
            markedDates={events}
            disabledByDefault={true}
            onRefresh={() => console.log('refreshing...')}
            refreshing={false}
            refreshControl={null}  
            theme={{
              backgroundColor: 'white',
              calendarBackground: '#060615',
              arrowColor: 'white',
              textSectionTitleColor: 'white',
              monthTextColor: 'white',
              indicatorColor: 'white',
            }}  
            style={styles.agenda} 
          />
        </Portal>
      </Provider>   
    </>
  )
} 

function AgendaView({selectedDate, court}) {
  const { state } = React.useContext(AuthContext)
  const {dateString, day, month, year} = selectedDate
  const { _id, openingTime, closingTime, pricePerHour} = court  

  const [selectedTime, setSelectedTime] = useState(openingTime.split(":")[0])  
  const [dailyReservations, setDailyReservations] = useState([])
  const [displayButton, setDisplayButton] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect( () => {
    async function getReservations(){
      let result = await getReservationsofDate(_id, dateString)
      setDailyReservations(result.reservations)
    }
    getReservations()
  },[selectedDate])

  const openingTimeMoment = moment().set({ hour: openingTime.split(":")[0], minute: openingTime.split(":")[1], second: 0, millisecond: 0});
  const closingTimeMoment = moment().set({ hour: closingTime.split(":")[0], minute: closingTime.split(":")[1], second: 0, millisecond: 0});
  const difference = closingTimeMoment.diff(openingTimeMoment,'hours')

  let arrayOfHours= [];
  for (let i=0; i < difference; i++){
    let actualHour = parseInt(openingTime.split(":")[0])+i;
    let nextHour = parseInt(openingTime.split(":")[0])+1+i;
    let isReserved = dailyReservations.some(element => element.startTime.split(":")[0] == actualHour)
    isReserved ? 
      arrayOfHours.push(<RadioButton.Item disabled key={i} label={`${actualHour}:00-${nextHour}:00 (Reserved)`} value={actualHour} /> )
    : 
      arrayOfHours.push(<RadioButton.Item key={i} label={`${actualHour}:00-${nextHour}:00`} value={actualHour} />)
  }
  let showReservations = dailyReservations.length > 0 ? dailyReservations.map(element => {
    return(      
      <Card key={element.startTime}>
        <Card.Title title={`${element.startTime}-${element.endTime}`}></Card.Title>
        <Card.Content>
          <Paragraph>Cancha Reservada</Paragraph>
        </Card.Content>
      </Card>
    )    
  }) : null

  const showRadioButtons = state.userType === "user" ? 
  <>
    <Title>Seleccione la hora</Title>
    <RadioButton.Group onValueChange={value => {setShowButton(true);setSelectedTime(value)}} value={selectedTime}>
      {arrayOfHours}
    </RadioButton.Group> 
  </>  : <Title>Ingrese como usuario para reservar</Title>
  const hideModal = () => {
    setDisplayButton(false)
  }

  const showPaymentButton = displayButton && state.userType === "user" ?
  <>
    <ModalPayment selectedDate={selectedDate} court={court} selectedTime={selectedTime} displayButton={displayButton} hideModal={hideModal} />
  </> : null;
  return (
    <>
      <ScrollView>  
        <View style={styles.reserve}>       
          <Title>Reservaciones del día: {day}-{month}-{year}</Title> 
          {dailyReservations.length > 0 ? null : <Text>No hay reservaciones para este día</Text> }
          { state.userType === "user" ? showRadioButtons : showReservations}    
          {showButton && state.userType === "user" ? 
            <FAB small  icon="plus"  animated={true} onPress={() => setDisplayButton(true)} style={styles.fab}></FAB>
          : 
          state.userType === "user" ? 
            <Title>Selecciona una hora para reservar</Title>
          : 
            <Title>Ingrese como usuario para reservar</Title>}    
          {showPaymentButton}  
        </View>    
      </ScrollView>
    </>

  )
}

export default CourtCalendar;

