import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import Loading from '../loading'
import Usernav from '../usernav'
const SignupRequests= ()=>{

   const [data,setdata]=useState([])
   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)

    useEffect(()=>{
        fetch(serverurl+'/usersrequests/req',{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token")
            }
         }).then(res=>res.json())
         .then(result=>{
            setdata(result)
            if(result.length==0) setmsg("no sign up requests")
         })
    },[])

const approve=(id)=>{
    fetch(serverurl+'/users/signup/'+id,{
        method:"post",
        headers:{
        "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token"),
        }
     }).then(res=>res.json())
     .then(result=>{
        if(!result.err){
            let d=data.filter(item=>{
                return item._id!=id;
            });
            setdata(d);
            if(d.length==0) setmsg("no user found")
            else setmsg("")
        }
     })
}
const reject=(id)=>{
    fetch(serverurl+'/usersrequests/'+id,{
        method:"delete",
        headers:{
        "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token"),
        }
     }).then(res=>res.json())
     .then(result=>{
        if(!result.err){
            let d=data.filter(item=>{
                return item._id!=id;
            });
            setdata(d);
            if(d.length==0) setmsg("no user found")
            else setmsg("")
        }
     })
}

return(

   <div className='main'>
       <Usernav />
   <div class='headt'> signup requests </div>
       <div>{msg}</div>
       <div className='list'>
    {
        data?
        data.map(item=>{
            return(
            <div className='product2'>
                <div>name: {item.name}</div>
                <div>mobile number: {item.mobileNumber}</div>
                <div>email: {item.email}</div>
                <div>living in: {item.livingIn}</div>
                <div>
                    <button onClick={()=>approve(item._id)}>approve</button>
                    <button className='redbutton' onClick={()=>reject(item._id)}>reject</button>
                </div>
            </div>
            )
        }):
        <div>
        <Loading />
        </div>
    }</div>
   </div>

)

}

export default SignupRequests