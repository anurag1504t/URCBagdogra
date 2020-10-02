import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import OrderNav from '../ordernav'
import Loading from '../loading'

const OrderDetails= ()=>{

   const [data,setdata]=useState({})
    const {orderid}=useParams()
   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)
   const [loading,setloading]=useState(false)

   const getorders=()=>{
    fetch(serverurl+'/orders/'+orderid,{
        method:"get",
        headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("token")
      }
     }).then(res=>res.json())
     .then(result=>{
        setdata(result)
        console.log(result)
        setloading(true)
     }).catch(err=>{
        setloading(true)
        setmsg("error loading")
     })
   }

    useEffect(()=>{
        getorders();
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
      <OrderNav />
   <div class='headt'>  orders details</div>
       <div>{msg}</div>
<div>
    {
        data.items&&loading?
        <div>
            
             <div>   buyer name: {data.buyer.name}</div>
             <div>   buyer username: {data.buyer.username}</div>
             <div>   buyer contact number: {data.buyer.mobileNumber}</div>
             <div> amount: Rs. {data.amount}</div>
            <ul>
                           {data.items.filter(pro=>{return pro.quantity!=0}).map(prod=>{
                                            return(
                                            <li className='pi'>{prod.item.name} - {prod.quantity}</li>
                                            )
                                        })
                                    }</ul>
            
            <div className='timeslot'>
              <div className='tm'>timeSlot details</div>
               <div>{data.timeSlot.date}</div>
               <div>{convert(data.timeSlot.start)}</div>
               </div>
            </div>:
           <Loading />

    }</div>
   </div>

)

}

export default OrderDetails