import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link, useHistory, useParams} from 'react-router-dom'
import "../stylesheet/profile.css"
import ReactLoading from "react-loading";
import Loading from './loadingbar'
import confirm from "reactstrap-confirm";

import Tiger from "../img/Tiger.png";
import Officer from "../img/officer.jpg";


const Profile= ()=>{

   const [data,setdata]=useState([])
   const [pdata,setpdata]=useState({})

   const [loadingo,setloadingo]=useState(false)
   const [loadings,setloadings]=useState(false)
   const [loadingp,setloadingp]=useState(false)
    const history=useHistory()
   const [msg,setmsg]=useState("")
   const [slotdata,setslotdata]=useState([])
   const {state,dispatch}=useContext(usercontext)


   useEffect(()=>{
      fetch(`${serverurl}/users/getuserdetails`,{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
          if(result.err) setmsg("error loading user details")
         else setpdata(result)
         setloadingp(true)
      }).catch(err=>{
         setmsg("error loading user details")
      })
   },[])

   useEffect(()=>{
      fetch(`${serverurl}/orders/getuserorders`,{
         method:"get",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         }
      }).then(res=>res.json())
      .then(result=>{
          if(result.err){
            setmsg("error loading orders")
          }else{
            setdata(result.orders)
          }
          setloadingo(true)
      }).catch(err=>{
         setmsg("error loading orders")
      })
   },[])
   useEffect(()=>{
    fetch(`${serverurl}/windoworders/getuserorders`,{
       method:"get",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        if(result.err){
            setmsg("error loading bookings")

        }else{
          setslotdata(result.orders)
        }
        setloadings(true)

    }).catch(err=>{
       setmsg("error loading bookings")

    })
 },[])

   const convert=(i)=>{
    var c=""
    if(i<12) c="AM"
    else{c="PM";if(i>12) i=i-12;}
    if(i==0.5) return "12.30-1.00 PM"
 if(i*10%10==0){
    return Math.floor(i)+".00-"+(Math.floor(i))+".30"+c
 }else{
    return Math.floor(i)+".30-"+(Math.floor(i)+1)+".00"+c
 }
 }
 const cancelorder=async (id)=>{
     setmsg("")
    let result = await confirm(
        {
            title: ( "dear user"),
            message: "are you sure, you want to cancel the order?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false;
    else{
        setloadingo(false)
    }
   fetch(`${serverurl}/orders/cancelorder/${id}`,{
       method:"delete",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        
        if(result.err) setmsg("error cancelling order")
        else {
            setmsg("order cancelled")
        let d=data.filter(item=>{return item._id!=id})
        setdata(d)
    }
        setloadingo(true)

    }).catch(err=>{
       setmsg("error cancelling order")
       setloadingo(true)

    })
}
const cancelslot=async (id)=>{
    setmsg("")

    let result = await confirm(
        {
            title: ( "dear user"),
            message: "are you sure, you want to cancel the booking?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false;
    else{
        setloadings(false)
    }
   fetch(`${serverurl}/windoworders/${id}`,{
       method:"delete",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        
        if(result.err) setmsg("error cancelling booking")
        else {setmsg("booking cancelled")
        let d=slotdata.filter(item=>{return item._id!=id})
        setslotdata(d)}
        setloadings(true)
        
    }).catch(err=>{
       setmsg("error cancelling slot")
       setloadings(true)
    })
}
const changeslot=async (id)=>{
    setmsg("")

    let result = await confirm(
        {
            title: ( "dear user"),
            message: "are you sure, you want to change the slot?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false;
    else{
        history.push(`/changeslot/${id}`)
    }
    
}
return(

    <div className='main-profile'>
        <div>{msg}</div>
        <div className="row">
            <div className="user-details col-12 col-md-4 mb-4">
                {loadingp?
                    <div className="user-container">
                        <br></br>                        
                        <div>                            
                            <div className='dd'>Hi, <em>{pdata.name}</em></div>
                            <br></br>
                            <img className="profile-image" src={Officer} width="300px" ></img>
                            <div className='dd'>@{pdata.username}</div>
                            <div className='dd'><span className="fa fa-envelope"></span>  {pdata.email}</div>
                            <div className='dd'><span className="fa fa-phone"></span>  {pdata.mobileNumber}</div>
                        </div>
                        <div className='main-profile'>
                            <div className='rout2'><Link to='/changepwd'>change password</Link></div> 
                        </div>
                    </div>:
                    <ReactLoading
                        type="bars"
                        color="floralwhite"
                        height={667}
                        width={375}
                    />
                }
            </div>
            
            <div className="order col-12 col-md-8 mb-4">

                <div>
                    <div className='oh'> slot booked</div>
                    {loadings?
                        <div className='order'>
                            <ul className="ul-order">
                                {slotdata?
                                    slotdata.map((item, index)=>{
                                        return(
                                            <li className='oi' key={index}>
                                                <div className='timeslot2'>
                                                <div className='tm2'>timeslot details</div>
                                                <div>{item.timeSlot.date}</div>
                                                <div>{convert(item.timeSlot.start)}</div>
                                                </div>
                                                <div><button className="profile-button" onClick={()=>{cancelslot(item._id)}}>cancel</button></div>
                                        
                                            </li>
                                        )
                                    }):<div></div>
                                }
                            </ul>
                        </div>:
                        <Loading />
                    }
                    {
                        slotdata.length==0&&loadings?
                        <div>no slot bookings found</div>:
                        <div></div>
                    }
                </div>

                <div>
                    <div className='oh'>orders</div>
                    {
                        loadingo?
                        <div>
                        <ul className="ul-order">
                            {data?
                            data.map((item, index) =>{
                                return(
                                    <li className='oi' key={index}>
                                        <div className='timeslot2'>
                                            {item.timeSlot.date!=0?<div>
                                            <div className='tm2'>timeslot details</div>
                                            <div>{item.timeSlot.date}</div>
                                            <div>{convert(item.timeSlot.start)}</div>
                                            </div>:<div>timeslot cancelled by admin choose new time slot</div>
                                            }
                                        </div>
                                        <div>
                                            <details className='det'>
                                            <summary>order item list</summary>
                                            
                                                <ul>
                                                    {                                                
                                                        item.items.filter(pro=>{return pro.quantity!=0}).map(prod=>{
                                                            return(
                                                                <li className='pi' key={prod.item._id}>{prod.item.name} - {prod.quantity}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            
                                            </details>
                                        </div>
                                        <div><button className="profile-button" onClick={()=>{changeslot(item._id)}}>change slot</button></div>
                                        <div><button className="profile-button" onClick={()=>{cancelorder(item._id)}}>cancel</button></div>
                                    </li>
                                )
                            }):<div></div>
                            }
                        </ul>
                    </div>:
                    <div>
                        <Loading />
                        </div>
                    }
                    {
                       data.length==0&&loadingo?
                       <div>no orders found</div>:
                       <div></div>
                    }
                </div>

            </div>
        </div>
        

        <div className="profile-instruction">        
            <div><h3>instructions for Order Pickup/Shopping at URC</h3></div>
            <div>
            <ul className="list">
                <li key="1">please carry your canteen card along with you</li>
                <li key="2">the shopping and billing process has to be completed within booked time slot else items will not be billed.</li>
                <li key="3">social distancing norms must be followed by all</li>
                <li key="4">no entry without mask</li>
                <li key="5">canteen staff is authorised by orders of oic urc to cancel your booking if you are found wanting of following above instructions</li>
            </ul>
            </div>
        </div>


    </div>   
)

}

export default Profile