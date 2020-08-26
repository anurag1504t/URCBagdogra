import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link} from 'react-router-dom'

const Profile= ()=>{

   const [data,setdata]=useState([])
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
      })
   },[])
   
return(

   <div className='main'>
        <div>
           <div className='main'>
            <div className='dd'>{data.username}</div>
            <div className='dd'>{data.name}</div>
            <div className='dd'>{data.email}</div>
            <div className='dd'>{data.mobileNumber}</div>
            </div>
            <div className='main'>
           <div className='rout2'><Link to='/lastorders'>see last orders</Link> </div> 
           <div className='rout2'><Link to='/changepwd'>change password</Link></div> 
           </div>
        </div>
   </div>

)

}

export default Profile