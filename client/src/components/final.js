import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link, useParams} from 'react-router-dom'

import Loading from './loading'

const Final= ()=>{

   const [data,setdata]=useState({})
   const {state,dispatch}=useContext(usercontext)
   const {id}=useParams()

   useEffect(()=>{
      fetch(`${serverurl}/orders/getorderdetails`,{
         method:"post",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         },
         body:JSON.stringify({
            orderid:id
         })
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
          if(result.err){

          }else{
            setdata(result)
          }
      }).catch(err=>{
         console.log(err)
      })
   },[])

   const convert=(i)=>{
      var c=""
      if(i<12) c="AM"
      else{c="PM";if(i>12) i=i-12;}
      if(i==0.5) return "12.30-1.00 PM"
   if(i*10%10==0){
      return Math.floor(i)+".00-"+(Math.floor(i))+".30"+c
   }else{
      return Math.floor(i)+".30-"+(Math.floor(i)+1)+".00"+c
   }
   }

return(

   <div className='main'>
      <div>
         {
            data.timeslot?
            <div className='rout'>
              <div>your order is placed successfully</div>
              <div className='timeslot'>
              <div className='tm'>timeslot details</div>
               <div>{data.timeslot.date}</div>
               <div>{convert(data.timeslot.start)}</div>
               </div>
            </div>:
               <div></div>
         }
      </div>
       <div className='rout'>instructions for the order pickup</div>
   </div>

)

}

export default Final