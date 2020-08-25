import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {Link} from 'react-router-dom'

const Final= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)


return(

   <div><Link to='shop'>shop</Link>
       //instructions for the order pickup
   </div>

)

}

export default Final