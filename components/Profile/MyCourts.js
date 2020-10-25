import React, {useEffect, useState} from 'react';
import { ScrollView } from 'react-native';
import { Title, Text, Button, Card, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { getCourtsByUser } from '../../utils/HTTPRequests';
import Courts from '../../components/Courts/Courts';
import { AuthContext } from '../../App';
import { useIsFocused } from '@react-navigation/native';



export default function MyCourts({}) {
  const [myCourts, setMyCourts] = useState([])
  const isFocused = useIsFocused();
  useEffect(() => {
    async function getMyCourts() {
      try{
        const getCourts = await getCourtsByUser()
        console.log(getCourts)
        setMyCourts(getCourts.courts)
      }
      catch(err){
        console.log(err)
      }
    }
    getMyCourts();
  },[isFocused])
  return(
    <>          
      <Courts courts={myCourts} edit={true} />  
    </>
  )
}