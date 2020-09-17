import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import DatePicker from 'react-date-picker'
import TimeslotNav from '../timeslotnav'
import Loading from '../loading'
const SlotBookingTime= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState({})
   const [msg,setmsg]=useState("")
   const [date,setdate]=useState(new Date())
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
    updatelist()
   },[data])

const getdate=()=>{
    fetch(`${serverurl}/timeslot/getpickupslot`,{
        method:"post",
        headers:{
           "Content-Type":"application/json"
        },
        body:JSON.stringify({
           date:date.toDateString()
        })
     }).then(res=>res.json())
     .then(result=>{
         setdata(result.arr)
     }).catch(err=>{
        console.log(err)
     })
}

const setslot=()=>{
    var arr=[]
    for(var i=8.5;i<18;i=i+0.5){
        if(list[i]==true) arr.push(i)
    }
    fetch(`${serverurl}/timeslot/setpickupslot`,{
        method:"post",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           date:date.toDateString(),arr:arr
        })
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
     }).catch(err=>{
        console.log(err)
     })
}

const updatelist=()=>{
    var a={}
    console.log(data)
    for(var i=8.5;i<18;i=i+0.5){
        a[i]=false;
    }
    for(var i=0;i<data.length;i++){
        a[data[i]]=true
        console.log(data[i])
    }
    setlist(a);

}
const toggle=(d)=>{
    var a={}
    console.log(d)
    for(var i=8.5;i<18;i=i+0.5){
        if(i!=d)
        a[i]=list[i];
        else{
            a[i]=list[i]?false:true;
        }
    }
    setlist(a)
}

return(
   <div className='main'>
   <TimeslotNav />
   <div class='headt'> order pickup time </div>
       <div>{msg}</div>
       <DatePicker value={date} format="y-MM-dd" minDate={new Date()} onChange={(dt)=>setdate(dt)} />
       <button onClick={()=>getdate()}>check</button>

    {
        list?
        <div>
            <div>
            <div onClick={(e)=>toggle(8.5)} className={list[8.5]?"selected":"notselected"}>8.30-9.00 PM</div>
            <div onClick={(e)=>toggle(9)} className={list[9]?"selected":"notselected"}>9.00-9.30 PM</div>
            <div onClick={(e)=>toggle(9.5)} className={list[9.5]?"selected":"notselected"}>9.30-10.00 PM</div>
            <div onClick={(e)=>toggle(10)} className={list[10]?"selected":"notselected"}>10.00-10.30 PM</div>
            <div onClick={(e)=>toggle(10.5)} className={list[10.5]?"selected":"notselected"}>10.30-11.00 PM</div>
            <div onClick={(e)=>toggle(11)} className={list[11]?"selected":"notselected"}>11.00-11.30 PM</div>
            <div onClick={(e)=>toggle(11.5)} className={list[11.5]?"selected":"notselected"}>11.30-12.00 PM</div>
            <div onClick={(e)=>toggle(12)} className={list[12]?"selected":"notselected"}>12.00-12.30 PM</div>
            <div onClick={(e)=>toggle(12.5)} className={list[12.5]?"selected":"notselected"}>12.30-01.00 PM</div>
            <div onClick={(e)=>toggle(13)} className={list[13]?"selected":"notselected"}>1.00-1.30 PM</div>
            <div onClick={(e)=>toggle(13.5)} className={list[13.5]?"selected":"notselected"}>1.30-2.00 PM</div>
            <div onClick={(e)=>toggle(14)} className={list[14]?"selected":"notselected"}>2.00-2.30 PM</div>
            <div onClick={(e)=>toggle(14.5)} className={list[14.5]?"selected":"notselected"}>2.30-3.00 PM</div>
            <div onClick={(e)=>toggle(15)} className={list[15]?"selected":"notselected"}>3.00-3.30 PM</div>
            <div onClick={(e)=>toggle(15.5)} className={list[15.5]?"selected":"notselected"}>3.30-4.00 PM</div>
            <div onClick={(e)=>toggle(16)} className={list[16]?"selected":"notselected"}>4.00-4.30 PM</div>
            <div onClick={(e)=>toggle(16.5)} className={list[16.5]?"selected":"notselected"}>4.30-5.00 PM</div>
            <div onClick={(e)=>toggle(17)} className={list[17]?"selected":"notselected"}>5.00-5.30 PM</div>
            <div onClick={(e)=>toggle(17.5)} className={list[17.5]?"selected":"notselected"}>5.30-6.00 PM</div>
            </div>
            <div><button onClick={()=>setslot()}>submit</button></div>
        </div>:
        <div>
            <Loading />
        </div>
    }
   </div>

)

}

export default SlotBookingTime