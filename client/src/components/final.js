import React, { useState, useEffect} from "react";
import {serverurl} from "../config";
import { useParams } from "react-router-dom";
import "../stylesheet/final.css";
import Loading from "./loading";

const Final= ()=>{

   const [data,setdata]=useState({})
   const [loading,setloading]=useState(false)
   const [msg,setmsg]=useState("")
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
         setloading(true)
          if(result.err){
            setmsg("error loading")
          }else{
            setdata(result)
          }
      }).catch(err=>{
         setloading(true)
         setmsg("error loading")
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

   <div className='main-final'>
      <div className='alert alert-primary' style={{textAlign:'center'}}>{msg}</div>
      <div><h1>your order is placed successfully</h1></div>
      <br></br>
      <div className="order-final-container">
         {
            data.timeslot&&loading?
            <div>
              <div className='timeslot'>
              <div className='tm'>timeslot details</div>
               <div>{data.timeslot.date}</div>
               <div>{convert(data.timeslot.start)}</div>
               </div>
            </div>:
               <Loading />
         }
      </div>
      <br></br>
      <div><h3>instructions for Order Pickup at URC</h3></div>
      <div>
      <ul className="list">
         <li key="1">please carry your canteen card along with you</li>
         <li key="2">the shopping and billing process has to be completed within booked time slot else items will not be billed.</li>
         <li key="3">social distancing norms must be followed by all</li>
         <li key="4">no entry without mask</li>
         <li key="5">canteen staff is authorised by orders of oic urc to cancel your booking if you are found wanting of following above instructions</li>
      </ul>
      </div>
   </div>

)

}

export default Final