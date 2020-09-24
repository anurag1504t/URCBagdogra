import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link,useHistory} from 'react-router-dom'
import DatePicker from 'react-date-picker'
import Loading from './loading'

const Checkout= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)
   const [date,setdate]=useState()
   const [dateshow,setdateshow]=useState()
   const [loading,setloading]=useState(false)
   const [time,settime]=useState("")
   const history=useHistory()

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
      })
   },[])

const getmindate=()=>{
   let dt=new Date();
   dt.setDate(dt.getDate()+2);
   return dt;
}

const getdate=()=>{
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
       setdateshow(date)
       console.log(result)
   }).catch(err=>{
      console.log(err)
   })
} 

const submitorder=()=>{
   if(!time) return 0;
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
       history.push(`/final/${result.id}`)
   }).catch(err=>{
      console.log(err)
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

   <div className='main'>
      {loading?<div>
       <div className='rout'>select time slot</div>
  <DatePicker value={date} minDate={getmindate()} onChange={(dt)=>setdate(dt)} />
       <button className='d' onClick={()=>getdate()}>check</button>
<div className='sel'>{dateshow?dateshow.toDateString():""}</div>
       <select className='sel' onChange={(e)=>settime(e.target.value)}>
          {
             data?
             data.map(item=>{
                return(
                <option value={item._id}>{convert(item.start)}</option>
                )
             })
             :<option></option>
          }
       </select>
      <button onClick={()=>submitorder()}>place order</button>
      </div>:<Loading />
}
   </div>

)

}

export default Checkout