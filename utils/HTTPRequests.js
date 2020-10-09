import axios from 'axios'
const localUrl = "http://192.168.1.8:4000/"

export const userRegister = async (typeUser,values) => {
  try{
      const response = await axios ({
          method: "POST",
          url: `${localUrl}${typeUser}`,
          data: values,
      }) 
      return response.data
  }
   catch(error){
      console.log(error)
  }
}

export const loginUser = async(typeUser, values) => {    
  try{
      const response = await axios({
          method:"POST",
          url: `${localUrl}${typeUser}/login`,
          data:values
      })
      return response.data
  }
  catch(err){
      throw err
  }
}

export const logoutUser = async(typeUser, token ) => {    
  try{
      console.log(token)
      const response = await axios({
          method:"POST",
          url: `${localUrl}${typeUser}/logout`,
          data:token
      })
      return response.data
  }
  catch(err){
      throw err
  }
}