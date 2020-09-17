import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'

import OrderNav from '../ordernav'
import Loading from '../loading'
const Orders= ()=>{

   const [data,setdata]=useState([])

   const [feeddata,setfeed]=useState("")
   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)

   const getorders=()=>{
    fetch(serverurl+'/orders/',{
        method:"get",
        headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("token")
      }
     }).then(res=>res.json())
     .then(result=>{
        setdata(result)
        if(result.length==0) setmsg("no orders are there")

        console.log(result)
     })
   }

    useEffect(()=>{
        getorders();
    },[])
    
    const cancelorder=(id)=>{
        fetch(`${serverurl}/orders/${id}`,{
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
             if(d.length==0) setmsg("no orders found")
               else setmsg("")
         }).catch(err=>{
            console.log(err)
         })
    }

    const completeorder=(id)=>{
        fetch(`${serverurl}/orders/${id}`,{
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
             if(d.length==0) setmsg("no orders found")
               else setmsg("")
         }).catch(err=>{
            console.log(err)
         })
    }
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
   <div class='headt'>  orders </div>
       <div>{msg}</div>
<div className='list'>
    {
        data?
        data.map(item=>{
            return(
            <div className='product2'><Link to={`/orderdetail/${item._id}`} className='ll'>
                <div>buyer name: {item.buyer.name}</div>
                <div>amount: Rs. {item.amount}</div>
                <div className='timeslot'>
              <div className='tm'>timeSlot details</div>
               <div>{item.timeSlot.date}</div>
               <div>{convert(item.timeSlot.start)}</div>
               </div></Link>
                <div><button onClick={()=>completeorder(item._id)}>completed</button></div>
                <div><button onClick={()=>cancelorder(item._id)}>cancel</button></div>

            </div>
            )
        }):
        <div>
           <Loading />
        </div>
    }</div>
   </div>

)

}

export default Orders