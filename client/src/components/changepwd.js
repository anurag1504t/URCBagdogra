import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link} from 'react-router-dom'

import Loading from './loading'

const Pwdchange= ()=>{

   const [data,setdata]=useState({})
   const [msg,setmsg]=useState("")
   const [pass,setpass]=useState("")
   const [newpass,setnewpass]=useState("")
   const [newpass2,setnewpass2]=useState("")

   const {state,dispatch}=useContext(usercontext)

const submitpwd=()=>{
    if(newpass!=newpass2){
        setmsg("password do not match");return false
    }
    if(newpass.length<6){
        setmsg("password length should me atleast 6");return false
    }
    fetch(serverurl+"/changepwd",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            pass,
            newpass
        })
    }).then(res=>res.json())
    .then(data=>{
        console.log(data)
        if(data.err){
            setmsg(data.err)
        }
        else{
            setmsg("password changed successfully")
        }
    })
}
   
return(

   <div className='main'>
       <div>{msg}</div>
      <div><input type='password' value={pass} onChange={(e)=>setpass(e.target.value)} placeholder='old password' /></div>
      <div><input type='password' minlength="6" maxLength="20"  value={newpass} onChange={(e)=>setnewpass(e.target.value)} placeholder='new password' /></div>
      <div><input type='password' minlength="6" maxLength="20"  value={newpass2} onChange={(e)=>setnewpass2(e.target.value)} placeholder='re-enter new password' /></div>

<div><button onClick={()=>submitpwd()}>submit</button></div>
   </div>

)

}

export default Pwdchange