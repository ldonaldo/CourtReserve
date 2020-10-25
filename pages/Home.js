import React, {useEffect} from 'react';
import { getAllCourts } from '../utils/HTTPRequests';
import Courts from '../components/Courts/Courts';
import { AuthContext } from '../App';
import { useIsFocused } from '@react-navigation/native';


export default function Home({}) {
  const {state, authContext: {updateCourts} } = React.useContext(AuthContext)
  const isFocused = useIsFocused();
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
  },[isFocused])
  
  return(
    <>      
        <Courts courts={state.courts} edit={false} />      
    </>
  )
}
