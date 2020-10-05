import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link, useParams} from 'react-router-dom'
import "../stylesheet/profile.css"
import ReactLoading from "react-loading";
import Loading from './loadingbar'

import Tiger from "../img/Tiger.png";
import Officer from "../img/officer.jpg";


const Profile= ()=>{

   const [data,setdata]=useState([])
   const [pdata,setpdata]=useState({})

   const [loadingo,setloadingo]=useState(false)
   const [loadings,setloadings]=useState(false)
   const [loadingp,setloadingp]=useState(false)

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
         setpdata(result)
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
         console.log(result)
          if(result.err){

          }else{
            setdata(result.orders)
          }
          setloadingo(true)
      }).catch(err=>{
         console.log(err)
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
       console.log(result)
        if(result.err){

        }else{
          setslotdata(result.orders)
        }
        setloadings(true)

    }).catch(err=>{
       console.log(err)
       setmsg("error loading orders")

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
 const cancelorder=(id)=>{
   fetch(`${serverurl}/orders/cancelorder/${id}`,{
       method:"delete",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        let d=data.filter(item=>{return item._id!=id})
        setdata(d)
        setmsg("order cancelled")

    }).catch(err=>{
       console.log(err)
       setmsg("error cancelling order")

    })
}
const cancelslot=(id)=>{
   fetch(`${serverurl}/windoworders/${id}`,{
       method:"delete",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        let d=slotdata.filter(item=>{return item._id!=id})
        setmsg("slot cancelled")

        setslotdata(d)
    }).catch(err=>{
       console.log(err)
       setmsg("error cancelling slot")

    })
}
return(

    <div className='main-profile'>
        <div className="row">{msg}</div>
        <div className="row">
            <div className="user-details col-12 col-md-4 mb-4">
                {loadingp?
                    <div className="user-container">
                        <br></br>                        
                        <div>                            
                            <div className='dd'>Hi, <em>{pdata.name}</em></div>
                            <br></br>
                            <img src={Officer} width="300px" ></img>
                            <div className='dd'>@{pdata.username}</div>
                            <div className='dd'><span className="fa fa-envelope"></span>  {pdata.email}</div>
                            <div className='dd'><spam className="fa fa-phone"></spam>  {pdata.mobileNumber}</div>
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
                                                <div><button className="profile-button" onClick={()=>{if(window.confirm('are you sure, you want to cancel the booking?')){cancelslot(item._id)}}}>cancel</button></div>
                                        
                                            </li>
                                        )
                                    }):<div></div>
                                }
                            </ul>
                        </div>:
                        <Loading />
                    }
                    {
                        data.length==0&&loadings?
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
                                            <div className='tm2'>timeslot details</div>
                                            <div>{item.timeSlot.date}</div>
                                            <div>{convert(item.timeSlot.start)}</div>
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
                                        <div><button className="profile-button" onClick={()=>{if(window.confirm('are you sure, you want to cancel the order?')){cancelorder(item._id)}}}>cancel</button></div>
                                    </li>
                                )
                            }):<div></div>
                            }
                        </ul>
                    </div>:
                        <Loading />
                    }
                    {
                       data.length==0&&loadingo?
                       <div>no orders found</div>:
                       <div></div>
                    }
                </div>

            </div>
        </div>
    </div>   
)

}

export default Profile