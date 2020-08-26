import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link} from 'react-router-dom'

const Checkout= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)


return(

   <div className='main'>
       <div className='rout'>select time slot</div>
      <button> <Link to='/final'>place order</Link></button>
   </div>

)

}

export default Checkout