
import React,{ useState ,useContext  } from 'react'
import {Link} from 'react-router-dom'
import { useHistory,useParams } from 'react-router-dom'
import {usercontext} from '../App'
import {serverurl} from '../config'
import '../stylesheet/style.css';


const Signupmsg= ()=>{
    const {name}=useParams()



return(

    <div className='main signmsg'>
      <div>Dear { name}</div>
       <div>Your sign up request is posted successfully.</div>
       <div>It would be verified by the admin.</div>
    </div>


)

}

export default Signupmsg