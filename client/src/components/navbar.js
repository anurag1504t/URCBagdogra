import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'
import logo from '../img/logo.jpg'
import '../stylesheet/style.css';

const NavBar=()=> {

    const{state,dispatch}=useContext(usercontext) 
    const history=useHistory()
    const renderlist=()=>{
        if(state){
            return [
                <div className='rout' key="1"><Link to="/profile">account</Link></div>,
                   
                <div className='rout' key="2"><Link to="/cart"> cart</Link></div>,
                <div className='rout' key="3"><Link to="/shop"> shop</Link></div>,
                <div className='rout' key="4">
                    <Link onClick={()=>{
                        localStorage.clear();
                        dispatch({type:"CLEAR"})
                        history.push('/')
                    }}>
                        logout
                    </Link>
                </div>,
                  
            ]
        }else{
            return [
                <div className='rout' key="7"><Link to="/login">login</Link></div>
            ]
        }
    }
    return (
      <nav>
          <div className='logo' >
          <div key='0'><Link exact to='/'><img src={logo} height='60px' width='300px' /></Link></div>,
              <div>
                  {renderlist()}
              </div>
          </div>
      </nav>
    );
  }
  
  export default NavBar;