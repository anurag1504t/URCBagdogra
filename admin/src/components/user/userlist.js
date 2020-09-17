import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import Loading from '../loading'
import Usernav from '../usernav'
const Userlist= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])
   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)

    useEffect(()=>{
        fetch(serverurl+'/users/',{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token"),
            }
         }).then(res=>res.json())
         .then(result=>{
            setdata(result)
            setlist(result)
            if(result.length==0) setmsg("no user registered")
         })
    },[])


const searchuser=(query)=>{
    let userpattern=new RegExp(query,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)
    })
    setlist(dd);
    if(dd.length==0) setmsg("no user found")
    else setmsg("")
    console.log(list)
   }

return(

   <div className='main'>
       <Usernav />
   <div class='headt'> users list </div>
       <input type='text' onChange={(e)=>searchuser(e.target.value)} placeholder='search' />
       <div>{msg}</div>
       <div className='list'>
    {
        list?
        list.map(item=>{
            return(
            <div className='product2'>
                <Link to={`/userdetails/${item.username}`} className='ll'>
                <div>name: {item.name}</div>
                <div>username: {item.username}</div>
                <div>email: {item.email}</div>
                <div>mobile number: {item.mobileNumber}</div>
                <div>slot booking : {item.slotbooking?"enabled":"disabled"}</div>
                <div>shopping : {item.shopping?"enabled":"disabled"}</div>
                </Link>
                <div>
                    <Link to={`/edituser/${item.username}`}><button>edit user</button></Link>
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

export default Userlist