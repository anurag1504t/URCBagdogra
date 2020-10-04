import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link} from 'react-router-dom'

import Loading from './loading'

const Profile= ()=>{

   const [data,setdata]=useState({})
   const [loading,setloading]=useState(false)
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
      fetch(`${serverurl}/users/${state.username}`,{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         setdata(result)
         setloading(true)
      })
   },[])
   
return(

   <div className='main'>
      {loading?
        <div>
           <div className='main'>
            <div className='dd'>username: {data.username}</div>
            <div className='dd'>name: {data.name}</div>
            <div className='dd'>email: {data.email}</div>
            <div className='dd'>mobile number: {data.mobileNumber}</div>
            </div>
            <div className='main'>
           <div className='rout2'><Link to='/changepwd'>change password</Link></div> 
           </div>
        </div>:<Loading />
}
   </div>

)

}

export default Profile