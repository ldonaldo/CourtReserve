import React from "react";
import Court from './Court';
import { ScrollView } from 'react-native';
import {Title} from 'react-native-paper';

const Courts = ({ courts, edit }) => {
  const renderingCourts = courts.length > 0 ? courts.map( court => (
    <Court key={court._id} court={court} edit={edit} />
  )) : <Title>No tiene espacios creados</Title>
  return (
    <>
      <ScrollView>
        { edit ? <Title>Estos son sus espacios</Title> :  <Title>Vea todas las canchas existentes:</Title>}
        {renderingCourts}
      </ScrollView>
    </>  
  )
}

export default Courts;