import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import Loading from '../loading'
import Usernav from '../usernav'
import { scryRenderedDOMComponentsWithClass } from 'react-dom/test-utils'
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
   const [loading,setloading]=useState(false)
    const [pass,setpass]=useState("")

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
            setloading(true)
         }).catch(err=>{
             setloading(true)
             setmsg("error loading")
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
    setloading(false)
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
        setloading(true)
        setmsg("user updated successfully")
     }).catch(err=>{
        console.log(err)
        setloading(true)
        setmsg("error updating user")
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
        setmsg("user deleted successfully")
     }).catch(err=>{
        console.log(err)
        setmsg("error deleting user")
     })
}
const resetpass=()=>{
    if(pass.length<8){
        setmsg("password length should be 8")
        return false;
    }
    fetch(`${serverurl}/users/resetpwd`,{
        method:"post",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           username:username,pass:pass
        })
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
        setmsg("password reset successfully")
     }).catch(err=>{
        console.log(err)
        setmsg("error resetting password")
     })
}

return(

   <div className='main'>
   <Usernav />
<div class='headt'> edit user details </div>
       <div>{msg}</div>

    {
        data&&loading?<div>
            <div>name: <input value={name} onChange={(e)=>setname(e.target.value)} /></div>
            <div>email <input value={email} onChange={(e)=>setemail(e.target.value)} /></div>
            <div>mobile <input value={mobile} onChange={(e)=>setmobile(e.target.value)} /></div>
    <div>live in <button onClick={()=>togglelive()} className={live?"greenbutton":"redbutton"}>{live?"yes":"no"}</button></div>
    <div>slot booking <button onClick={()=>toggleslot()} className={slot?"greenbutton":"redbutton"}>{slot?"allowed":"not allowed"}</button></div>
    <div>online order <button onClick={()=>toggleorder()} className={shop?"greenbutton":"redbutton"}>{shop?"allowed":"not allowed"}</button></div>
    <div><input type='text' value={pass} onChange={(e)=>setpass(e.target.value)} placeholder='reset password' />
    <button onClick={()=>resetpass()}>reset password</button>
    </div>
    <div><button onClick={()=>edituser()}>submit</button></div>
    <div><button className='redbutton' onClick={()=>{if(window.confirm('are you sure, you want to delete this user?')){deluser()}}}>delete user</button></div>
        </div>:
        <Loading />
    }
   </div>

)

}

export default UserEdit