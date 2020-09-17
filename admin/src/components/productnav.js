import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'

const ProductNavBar=()=> {

    return (
        <nav>
      <div>
          <ul>
              <li><Link to='/addproduct'>add product</Link></li>
              <li><Link to='/productlist'>products list</Link></li>
              <li><Link to='/productvalueupdate'>products update</Link></li>

              
          </ul>
      </div></nav>
    );
  }
  
  export default ProductNavBar;