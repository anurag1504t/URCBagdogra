import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link, useParams} from 'react-router-dom'

import Loading from './loadingbar'

const Profile= ()=>{

   const [data,setdata]=useState([])
   const [pdata,setpdata]=useState({})

   const [loadingo,setloadingo]=useState(false)
   const [loadings,setloadings]=useState(false)
   const [loadingp,setloadingp]=useState(false)

   const [msg,setmsg]=useState("")
   const [slotdata,setslotdata]=useState([])
   const {state,dispatch}=useContext(usercontext)


   useEffect(()=>{
      fetch(`${serverurl}/users/${state.username}`,{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         setpdata(result)
         setloadingp(true)
      }).catch(err=>{
         setmsg("error loading user details")
      })
   },[])

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
          setloadingo(true)
      }).catch(err=>{
         console.log(err)
         setmsg("error loading orders")
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
        setloadings(true)

    }).catch(err=>{
       console.log(err)
       setmsg("error loading orders")

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
 const cancelorder=(id)=>{
   fetch(`${serverurl}/orders/cancelorder/${id}`,{
       method:"delete",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        let d=data.filter(item=>{return item._id!=id})
        setdata(d)
        setmsg("order cancelled")

    }).catch(err=>{
       console.log(err)
       setmsg("error cancelling order")

    })
}
const cancelslot=(id)=>{
   fetch(`${serverurl}/windoworders/${id}`,{
       method:"delete",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        let d=slotdata.filter(item=>{return item._id!=id})
        setmsg("slot cancelled")

        setslotdata(d)
    }).catch(err=>{
       console.log(err)
       setmsg("error cancelling slot")

    })
}
return(

   <div className='main'>
      <div>{msg}</div>
         <div><div>user details</div>
               {loadingp?
               <div>
                  <div className='main'>
                     <div className='dd'>username: {pdata.username}</div>
                     <div className='dd'>name: {pdata.name}</div>
                     <div className='dd'>email: {pdata.email}</div>
                     <div className='dd'>mobile number: {pdata.mobileNumber}</div>
                     </div>
                     <div className='main'>
                  <div className='rout2'><Link to='/changepwd'>change password</Link></div> 
                  </div>
               </div>:<Loading />
         }
            </div>
         <div className='order'>
             <div className='oh'>orders</div>
             {
               loadingo?
               <div>
             <ul>
             {data?
             data.map(item=>{
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
                            <div><button onClick={()=>{if(window.confirm('are you sure, you want to cancel the order?')){cancelorder(item._id)}}}>cancel</button></div>
                    </li>
                 )
             }):<div></div>
            }</ul>
        </div>:
        <Loading />
     }
     {
        data.length==0&&loadingo?
        <div>no orders found</div>:
        <div></div>
     }
     </div>


     <div className='order'>
         <div className='oh'> slot booked</div>
         {  loadings?
         <div className='order'>
         <ul>
         {slotdata?
         slotdata.map(item=>{
            return(
               <li className='oi'>
                   <div className='timeslot2'>
                   <div className='tm2'>timeslot details</div>
                   <div>{item.timeSlot.date}</div>
                   <div>{convert(item.timeSlot.start)}</div>
                   </div>
                   <div><button onClick={()=>{if(window.confirm('are you sure, you want to cancel the booking?')){cancelslot(item._id)}}}>cancel</button></div>

               </li>
            )
        }):<div></div>
      }</ul>
        </div>:
        <Loading />
   }
   {
        data.length==0&&loadings?
        <div>no slot bookings found</div>:
        <div></div>
     }
        </div>

   </div>
   
)

}

export default Profile