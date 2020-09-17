import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'

const TimeslotNavBar=()=> {

    return (
      <div>
          <ul>
              <li><Link to='/ordertimeslot'>orders timeslot</Link></li>
              <li><Link to='/bookingtimeslot'>booking timeslot</Link></li>

              
          </ul>
      </div>
    );
  }
  
  export default TimeslotNavBar;