import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'
const Percentchange= ()=>{

   const [data,setdata]=useState([])
   const [msg,setmsg]=useState("")
   const {username}=useParams()
   const {state,dispatch}=useContext(usercontext)
   const [percent,setpercent]=useState("")



const updateproduct=(e)=>{
   e.preventDefault()
    fetch(`${serverurl}/products/percent/update`,{
        method:"put",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           percent:percent
        })
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
     }).catch(err=>{
        console.log(err)
     })
}


return(

   <div className='main'>
       <div>{msg}</div>

    {
        <div>
        <form onSubmit={(e)=>updateproduct(e)}>
            
            <div>online percent <input value={percent} onChange={(e)=>setpercent(e.target.value)} /></div>
    <input type='submit' value='submit' />
    </form>
        </div>
    }
   </div>

)

}

export default Percentchange