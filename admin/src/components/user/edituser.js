import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import Loading from '../loading'
import Usernav from '../usernav'
const UserEdit= ()=>{

   const [data,setdata]=useState({})
   const [msg,setmsg]=useState("")
   const {username}=useParams()
   const {state,dispatch}=useContext(usercontext)
   const [name,setname]=useState("")
   const [mobile,setmobile]=useState("")
   const [email,setemail]=useState("")
   const [live,setlivein]=useState(false)
   const [slot,setslot]=useState(false)
   const [shop,setshop]=useState(false)


    useEffect(()=>{
        console.log(username)
        fetch(`${serverurl}/users/${username}`,{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token"),
            }
         }).then(res=>res.json())
         .then(result=>{
             setdata(result)
             console.log(result)
            setname(result.name)
            setemail(result.email)
            setmobile(result.mobileNumber)
            setlivein(result.livingIn)
            setshop(result.shopping)
            setslot(result.slotbooking)
         })
    },[])

const togglelive=()=>{
    if(live){
        setlivein(false)
    }else{
        setlivein(true)
    }
}
const toggleslot=()=>{
    if(slot){
        setslot(false)
    }else{
        setslot(true)
    }
}
const toggleorder=()=>{
    if(shop){
        setshop(false)
    }else{
        setshop(true)
    }
}

const edituser=()=>{
    fetch(`${serverurl}/users/${username}`,{
        method:"put",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           name:name,email:email,mobileNumber:mobile,
           liveIn:live,slotbooking:slot,shopping:shop
        })
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
     }).catch(err=>{
        console.log(err)
     })
}

const deluser=()=>{
    fetch(`${serverurl}/users/${username}`,{
        method:"delete",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        }
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
     }).catch(err=>{
        console.log(err)
     })
}

return(

   <div className='main'>
   <Usernav />
<div class='headt'> edit user details </div>
       <div>{msg}</div>

    {
        data?<div>
            <div>name: <input value={name} onChange={(e)=>setname(e.target.value)} /></div>
            <div>email <input value={email} onChange={(e)=>setemail(e.target.value)} /></div>
            <div>mobile <input value={mobile} onChange={(e)=>setmobile(e.target.value)} /></div>
    <div>live in <button onClick={()=>togglelive()} className={live?"greenbutton":"redbutton"}>{live?"yes":"no"}</button></div>
    <div>slot booking <button onClick={()=>toggleslot()} className={slot?"greenbutton":"redbutton"}>{slot?"allowed":"not allowed"}</button></div>
    <div>online order <button onClick={()=>toggleorder()} className={shop?"greenbutton":"redbutton"}>{shop?"allowed":"not allowed"}</button></div>
    <div><button onClick={()=>edituser()}>submit</button></div>
    <div><button className='redbutton' onClick={()=>deluser()}>delete user</button></div>
        </div>:
        <div>
        <Loading />
        </div>
    }
   </div>

)

}

export default UserEdit