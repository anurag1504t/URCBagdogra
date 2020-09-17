import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link, useParams} from 'react-router-dom'

const Orders= ()=>{

   const [data,setdata]=useState([])
   const [slotdata,setslotdata]=useState([])
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
      fetch(`${serverurl}/orders/getuserorders`,{
         method:"get",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         }
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
          if(result.err){

          }else{
            setdata(result.orders)
          }
      }).catch(err=>{
         console.log(err)
      })
   },[])
   useEffect(()=>{
    fetch(`${serverurl}/windoworders/getuserorders`,{
       method:"get",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
       console.log(result)
        if(result.err){

        }else{
          setslotdata(result.orders)
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
     {
         data?
         <div className='order'>
             <div className='oh'>orders</div>
             <ul>
             {data.map(item=>{
                 return(
                    <li className='oi'>
                        <div className='timeslot2'>
                        <div className='tm2'>timeslot details</div>
                        <div>{item.timeSlot.date}</div>
                        <div>{convert(item.timeSlot.start)}</div>
                        </div>
                        <div><details className='det'>
                            <summary>order item list</summary>
                            <p>
                                <ul>
                                    {

                                        item.items.filter(pro=>{return pro.quantity!=0}).map(prod=>{
                                            return(
                                            <li className='pi'>{prod.item.name} - {prod.quantity}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </p>
                            </details>
                            </div>
                    </li>
                 )
             })}</ul>
        </div>:
        <div></div>
     }

     {  slotdata?
     <div className='order'>
         <div className='oh'> slot booked</div>
         <div className='order'>
         <ul>
         {slotdata.map(item=>{
            return(
               <li className='oi'>
                   <div className='timeslot2'>
                   <div className='tm2'>timeslot details</div>
                   <div>{item.timeSlot.date}</div>
                   <div>{convert(item.timeSlot.start)}</div>
                   </div>
               </li>
            )
        })}</ul>
        </div>
        </div>:
        <div>loading</div>

     }
   </div>
   
)

}

export default Orders