import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link} from 'react-router-dom'

const Final= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)


return(

   <div className='main'>
       <div className='rout'>instructions for the order pickup</div>
   </div>

)

}

export default Final