import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {Link} from 'react-router-dom'
import {serverurl} from '../config'
const Home= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)
   

return(

   <div className='main'>
      <div>admin console</div>
      <div>unit run canteen app</div>

      <div>indian air force station, bagdogra</div>

   </div>

)

}

export default Home