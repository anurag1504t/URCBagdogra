import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'

const OrderNavBar=()=> {

    return (
      <div>
          <ul>
              <li><Link to='/orderlist'>orders list</Link></li>
              <li><Link to='/bookinglist'>booking list</Link></li>

              
          </ul>
      </div>
    );
  }
  
  export default OrderNavBar;