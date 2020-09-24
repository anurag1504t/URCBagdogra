import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'

const Sys= ()=>{

   const [data,setdata]=useState({})
   const [feeddata,setfeed]=useState("")
   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)
   const [slot,setslot]=useState(false)
   const [shop,setshop]=useState(false)

    useEffect(()=>{
        fetch(serverurl+'/sys/',{
            method:"get"
         }).then(res=>res.json())
         .then(result=>{
            setdata(result)
            console.log(result)
            setshop(result.data.shop)
            setslot(result.data.slot)
         })
    },[])
    
    const toggleslot=()=>{
        if(slot){
            setslot(false)
        }else{
            setslot(true)
        }
    }
    const toggleshop=()=>{
        if(shop){
            setshop(false)
        }else{
            setshop(true)
        }
    }

const submitdata=()=>{
    fetch(`${serverurl}/sys`,{
        method:"put",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           shop:shop,slot:slot
        })
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
        setmsg("successfully changed status")
     }).catch(err=>{
        console.log(err)
     })
}

return(

   <div className='main'>
       <div>{msg}</div>
       {
           data?
           <div>
                <div>slot booking <button onClick={()=>toggleslot()} className={slot?"greenbutton":"redbutton"}>{slot?"allowed":"not allowed"}</button></div>
    <div>online order <button onClick={()=>toggleshop()} className={shop?"greenbutton":"redbutton"}>{shop?"allowed":"not allowed"}</button></div>
    <div><button onClick={()=>submitdata()}>submit</button></div>
            </div>:
            <div></div>
       }
   </div>

)

}

export default Sys