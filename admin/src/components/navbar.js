import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'
import logo from '../img/logo.png'
import logo2 from '../img/logo2.jpg'
import '../stylesheet/style.css';

const NavBar=()=> {

    const{state,dispatch}=useContext(usercontext) 
    const history=useHistory()
    const renderlist=()=>{
        if(state){
            return [
                <div className='rout' key="1"><Link to="/userlist">users</Link></div>,
                   
                <div className='rout' key="2"><Link to="/productlist">products</Link></div>,
                <div className='rout' key="3"><Link to="/ordertimeslot">timeslots</Link></div>,
                <div className='rout' key="4"><Link to="/orderlist"> orders</Link></div>,
                <div className='rout' key="5"><Link to="/news">news</Link></div>,
                <div className='rout' key="6"><Link to="/sys">shop/slot</Link></div>,
                <div className='rout' key="7">
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
                
                <div className='rout' key="8"><Link to="/login">login</Link></div>
            ]
        }
    }
    return (
      <nav>
          <div className='logo' >
              <div key='11' className='logobar'><img src={logo} height='100px' width='100px' /><Link exact to='/'><img src={logo2} height='60px' width='300px' /></Link></div>,
              <div>
                  {renderlist()}
              </div>
          </div>
      </nav>
    );
  }
  
  export default NavBar;