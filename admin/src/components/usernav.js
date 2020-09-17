import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'

const UserNavBar=()=> {

    return (
        <nav>
      <div>
          <ul>
              <li><Link to='/signuprequests'>requests</Link></li>
              <li><Link to='/userlist'>users list</Link></li>
              
          </ul>
      </div>
      </nav>
    );
  }
  
  export default UserNavBar;