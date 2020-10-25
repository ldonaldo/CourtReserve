import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Buffer } from 'buffer'
import base64 from 'react-native-base64';
const localUrl = "http://192.168.1.8:4000";
const urlEpayco = "https://apify.epayco.io/test";

export const userRegister = async (typeUser,values) => {
  try{
      const response = await axios ({
        method: "POST",
        url: `${localUrl}/${typeUser}`,
        data: values,
      }) 
      return response.data
  }
   catch(err){
      console.log(err)
  }
}

export const getPerson = async () => {
  try{
    const typeUser = await AsyncStorage.getItem('userType')
    const token = await AsyncStorage.getItem('token')
    const response = await axios ({
        method: "GET",
        url: `${localUrl}/${typeUser}`,
        headers:{
          Authorization: 'Bearer '+ token ,
          'usertype' : typeUser
      }
    }) 
    return response.data
  }
   catch(err){
      console.log(err)
  }
}

export const updatePerson = async (values) => {
  try{
    const typeUser = await AsyncStorage.getItem('userType')
    const token = await AsyncStorage.getItem('token')
    const response = await axios ({
        method: "POST",
        url: `${localUrl}/${typeUser}/update`,
        headers:{
          Authorization: 'Bearer '+ token ,
          'usertype' : typeUser
        },
        data: values
    }) 
    return response.data
  }
   catch(err){
      console.log(err)
  }
}

export const deletePerson = async (values) => {
  try{
    const typeUser = await AsyncStorage.getItem('userType')
    const token = await AsyncStorage.getItem('token')
    const response = await axios ({
        method: "DELETE",
        url: `${localUrl}/${typeUser}/delete`,
        headers:{
          Authorization: 'Bearer '+ token ,
          'usertype' : typeUser
        }
    }) 
    return response.data
  }
   catch(err){
      console.log(err)
  }
}

export const loginUser = async(typeUser, values) => {    
  try{
      const response = await axios({
          method:"POST",
          url: `${localUrl}/${typeUser}/login`,
          data:values
      })
      return response.data
  }
  catch(err){
    throw(err)
  }
}

export const logoutUser = async(typeUser, token ) => {    
  try{
      const response = await axios({
          method:"POST",
          url: `${localUrl}/${typeUser}/logout`,
          data:token
      })
      return response.data
  }
  catch(err){
    console.log(err)
  }
}

export const submitPhotosCloudinary = async(pickerResult) => {
  try {
    let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dyqiizh2u/upload';
    let base64Img = `data:image/jpg;base64,${pickerResult.base64}`;
    let data = {
      "file": base64Img,
      "upload_preset": "courtreserve_preset",
    }
    const response = await axios({
      method: "POST",
      url: `${CLOUDINARY_URL}`,
      data: data,
      headers:{
        'content-type': 'application/json'
      }
    })
    return response.data
  } catch(err){
    console.log(err)
  }
}

export const createCourt = async(values) => {    
  try{
      delete values.photos
      const token = await AsyncStorage.getItem('token')
      const response = await axios({
          method: "POST",
          url: `${localUrl}/court`,
          data:values,
          headers:{
              Authorization: 'Bearer '+ token ,
              'usertype' : "admin"
          }
      })
      return response.data
  }
  catch(err){
      console.log(err)
  }
}

export const updateCourt = async(values) => {    
  try{
      delete values.photos
      const token = await AsyncStorage.getItem('token')
      const response = await axios({
          method: "PUT",
          url: `${localUrl}/court/update`,
          data:{
            courtId: values._id,
            fields: {...values}
          },
          headers:{
              Authorization: 'Bearer '+ token ,
              'usertype' : "admin"
          }
      })
      return response.data
  }
  catch(err){
      console.log(err)
  }
}

export const getAllCourts = async () => {
  try {
    const response = await axios({
      method: "GET",
      url:`${localUrl}/court`
    })
    return response.data
    
  } catch(err) {
    console.log(err)
  }
}

export const getCourtsByUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token')
    const response = await axios({
      method: "GET",
      url: `${localUrl}/court/admin`,
      headers:{
        Authorization: 'Bearer '+ token ,
        'usertype' : "admin"
      }
    })
    return response.data
    
  } catch(err) {
    console.log(err)
  }
}

export const createReservation = async( values) => {    
  try{
      const token = await AsyncStorage.getItem('token')
      const response = await axios({
          method: "POST",
          url: `${localUrl}/reservation`,
          data:values,
          headers:{
              Authorization: 'Bearer '+ token ,
              'usertype' : "user"
          }
      })
      return response.data
  }
  catch(err){
      console.log(err)
  }
}

export const getReservationsofDate = async (courtId, date) => {
  try {
    const response = await axios({
      method: "GET",
      url:`${localUrl}/reservation?courtId=${courtId}&date=${date}`
    })
    return response.data
    
  } catch(err) {
    console.log(err)
  }
}

export const getMonthlyReservations = async (courtId, year) => {
  try {
    const response = await axios({
      method: "GET",
      url:`${localUrl}/reservation/month?courtId=${courtId}&year=${year}`
    })
    return response.data
    
  } catch(err) {
    console.log(err)
  }
}

export const getReservationsByUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token')
    const response = await axios({
      method: "GET",
      url:`${localUrl}/reservation/user`,
      headers:{
        Authorization: 'Bearer '+ token ,
        'usertype' : "user"
      }
    })
    return response.data    
  } catch(err) {
    console.log(err)
  }
}

export const getToken = async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${localUrl}/payment`,
      data: ''
    })
    return response.data
  } catch(err){
    console.log(err)
  }
}

export const payReservation = async (values) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${localUrl}/payment/reserve`,
      data: values
    })
    return response.data
  } catch(err){
    console.log(err)
  }
}

