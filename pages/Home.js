import React, {useEffect} from 'react';
import { ScrollView } from 'react-native';
import { Title, Text, Button, Card, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { getAllCourts } from '../utils/HTTPRequests';
import Courts from '../components/Courts/Courts';
import { AuthContext } from '../App';


export default function Home({navigation}) {
  const {state, authContext: {updateCourts} } = React.useContext(AuthContext)

  useEffect(() => {
    async function getCourts() {
      try{
        const getCourts = await getAllCourts()
        updateCourts({ courts: getCourts.courts })
      }
      catch(err){
        console.log(err)
      }
    }
    getCourts();
  },[])
  
  return(
    <>      
        <Courts courts={state.courts} />      
    </>
  )
}
