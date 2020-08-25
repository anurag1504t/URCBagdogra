import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {Link} from 'react-router-dom'

const Checkout= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)


return(

   <div><Link to='shop'>shop</Link>
       //select time slot
       <Link to='/final'>place order</Link>
   </div>

)

}

export default Checkout