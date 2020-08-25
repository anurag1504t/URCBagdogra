import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {Link} from 'react-router-dom'

const Profile= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
      fetch(`http://localhost:5000/user/${state.username}`,{
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

   <div>
      <img src={} />//logo
      <Link to='/home'>home</Link>
        <div>
            <div>name: {data.username}</div>
            <div>name: {data.name}</div>
            <div>name: {data.email}</div>
            <div>name: {data.mobileNumber}</div>
            <div>name: {data.livingIn}</div>
            //userdata
            <Link to='/lastorders'>see last orders</Link>
            <Link to='/changepwd'>change password</Link>
        </div>
   </div>

)

}

export default Profile