import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link,useHistory} from 'react-router-dom'
import DatePicker from 'react-date-picker'
import Loading from './loading'
import "../stylesheet/checkout.css";

const Checkout= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)
   const [date,setdate]=useState()
   const [dateshow,setdateshow]=useState()
   const [loading,setloading]=useState(false)
   const [time,settime]=useState("")
   const history=useHistory()
   const [msg,setmsg]=useState("")

   useEffect(() => {
      fetch(serverurl+'/sys/getuserinfo',{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         if(!result.data.usershop){
            history.push('/info/shrestrict')
         }
         else if(!result.data.shop){
            history.push('info/shclose')
         }
         else{
            setloading(true)
         }
      }).catch(err=>{
         history.push('/')
      })
   },[])

const getmindate=()=>{
   let dt=new Date();
   dt.setDate(dt.getDate()+1);
   return dt;
}

const getdate=()=>{
   settime("")
   if(!date){
      setmsg("choose date")
      return false
   }else{
      setmsg("")
   }
   setloading(false)

   fetch(`${serverurl}/timeslot/getpickupslotuser`,{
      method:"post",
      headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("token")
      },
      body:JSON.stringify({
         date:date.toDateString()
      })
   }).then(res=>res.json())
   .then(result=>{
       setdata(result.timeslot)
       if(result.timeslot[0]){
         settime(result.timeslot[0]._id)
      }
      setloading(true)
      setdateshow(date)
       console.log(result)
   }).catch(err=>{
      setloading(true)
      console.log(err)
      setmsg("error loading")
   })
} 

const submitorder=()=>{
   if(!time) return 0;
   if(!date){
      setmsg("choose date")
      return false
   }else{
      setmsg("")
   }
   setloading(false)
   fetch(`${serverurl}/orders/placeorder`,{
      method:"post",
      headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("token")
      },
      body:JSON.stringify({
         timeslotid:time
      })
   }).then(res=>res.json())
   .then(result=>{
       console.log(result)
       if(result.err){
         setloading(true)
         setmsg("error posting order")
       }else{

         history.push(`/final/${result.id}`)
       }
   }).catch(err=>{
      console.log(err)
      setloading(true)
      setmsg("error loading")
      settime("")
   })
}

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

return(

   <div className='main-checkout'>
      <h1>Select a time slot to pick order</h1>
      <br></br>
      <div>{msg}</div>
      {loading?<div className="timeslot-checkout-container">
      
  <DatePicker value={date} minDate={getmindate()} onChange={(dt)=>setdate(dt)} />
       <button className='checkout-button' onClick={()=>getdate()}>check</button>
<div className='sel'>{dateshow?dateshow.toDateString():""}</div>
      {data.length!=0? <select className='sel' value={time} onChange={(e)=>settime(e.target.value)}>
          {
             data?
             data.map(item=>{
                return(
                <option value={item._id}>{convert(item.start)}</option>
                )
             })
             :<option></option>
          }
       </select>:<div></div>
         }
       {data.length==0&&loading?<div>no slot availaible on this date</div>:<div></div>}
      {time?<button className='checkout-button' onClick={()=>{if(window.confirm('Are you sure, you want to place the order?')){submitorder()}}}>place order</button>:<span></span>}
      </div>:<Loading />
}
            <br></br>
            <br></br>
            <br></br>
   </div>

)

}

export default Checkout