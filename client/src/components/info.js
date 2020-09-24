import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {Link, useParams} from 'react-router-dom'

import Loading from './loading'

import {serverurl} from '../config'
const Info= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)
   const {code}=useParams()

const rendervalue=()=>{
    console.log(code)
    if(code=="shclose"){
        return (<div>shop is closed</div>)
    }
    if(code=="shrestrict"){
        return (<div>you are restricted for the shopping.contact admin of URC Bagdogra</div>)
    }
    if(code=="slclose"){
        return (<div>slot booking is closed</div>)

    }
    if(code=="slrestrict"){
        return (<div>you are restricted for the slot booking.contact admin of URC Bagdogra</div>)

    }
}
   

return(
    <div className='main'>
        {rendervalue()}
    </div>
)
}

export default Info