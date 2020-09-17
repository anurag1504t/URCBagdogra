import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import Loading from '../loading'
import Usernav from '../usernav'
const Userdetails= ()=>{

   const [data,setdata]=useState({})
   const [msg,setmsg]=useState("")
   const {username}=useParams()
   const {state,dispatch}=useContext(usercontext)



    useEffect(()=>{
        fetch(`${serverurl}/users/${username}`,{
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

<Usernav />
   <div class='headt'> user details </div>
    {
        data?<div>
            <div>name: {data.name}</div>
                <div>username: {data.username}</div>
                <div>email: {data.email}</div>
                
                <div>mobile number: {data.mobileNumber}</div>
                <div>living in : {data.livingIn?"Yes":"No"}</div>
                <div>slot booking : {data.slotbooking?"enabled":"disabled"}</div>
                <div>shopping : {data.shopping?"enabled":"disabled"}</div>
                <div>
                    <Link to={`/edituser/${data.username}`}><button>edit user</button></Link>
                </div>
        </div>:
        <div>
        <Loading />
        </div>
    }
   </div>

)

}

export default Userdetails