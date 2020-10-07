import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import Loading from '../loading'
import Usernav from '../usernav'
import confirm from "reactstrap-confirm";

const Userdetails= ()=>{

   const [data,setdata]=useState({})
   const [msg,setmsg]=useState("")
   const {username}=useParams()
   const {state,dispatch}=useContext(usercontext)
   const [loading,setloading]=useState(false)



    useEffect(()=>{
        fetch(`${serverurl}/users/${username}`,{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token"),
            }
         }).then(res=>res.json())
         .then(result=>{
             
             if(result.err) setmsg("error loading")
             else setdata(result)
             setloading(true)
         }).catch(err=>{
             setmsg("error loading")
             setloading(true)
         })
    },[])


return(

   <div className='main'>

<Usernav />
   <div class='headt'> user details </div>
    {
        data&&loading?<div>
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
        <Loading />
    }
   </div>

)

}

export default Userdetails