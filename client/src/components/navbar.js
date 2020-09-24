import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'
import '../stylesheet/style.css';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';

import {serverurl} from '../config'
const NavBar=()=> {

    const{state,dispatch}=useContext(usercontext) 
    const history=useHistory()

    const renderlist=()=>{

            if(state){
                return (
                    <React.Fragment>
                    <Navbar dark expand="md">
                        <div>                
                            {/* <NavbarBrand className="mr-auto" href="/">URC Bagdogra</NavbarBrand>  */}
                            <Nav navbar>
                                <NavItem className='rout' key="1">
                                    <Link className="nav-link" to="/profile">
                                        Account
                                    </Link>
                                </NavItem>
                                <NavItem className='rout' key="2">
                                    <Link className="nav-link" to="/cart">
                                        cart
                                    </Link>
                                </NavItem>

                                <NavItem className='rout' key="3">
                                    <Link className="nav-link" to="/shop">
                                        shop
                                    </Link>
                                </NavItem>

                                <NavItem className='rout' key="4">
                                    <Link className="nav-link" to="/windowslotbooking">
                                        slot booking 
                                    </Link>
                                </NavItem>

                                <NavItem className='rout' key="5">
                                    <Link className="nav-link" to="/orders">
                                        orders
                                    </Link>
                                </NavItem>
                                <NavItem className='rout' key="6">
                                    <Link className="nav-link" onClick={()=>{
                                        localStorage.clear();
                                        dispatch({type:"CLEAR"})
                                        history.push('/')
                                    }}>
                                        logout
                                    </Link>
                                </NavItem>
                            </Nav> 
                        </div>
                    </Navbar>
                    </React.Fragment>
                    // <div className='rout' key="1"><Link to="/profile">account</Link></div>,
                       
                    // <div className='rout' key="2"><Link to="/cart"> cart</Link></div>,
                    // <div className='rout' key="3"><Link to="/shop"> shop</Link></div>,
                    // <div className='rout' key="4"><Link to="/windowslotbooking"> slot booking</Link></div>,
                    // <div className='rout' key="5"><Link to="/orders"> orders</Link></div>,
                    // <div className='rout' key="6">
                    //     <Link onClick={()=>{
                    //         localStorage.clear();
                    //         dispatch({type:"CLEAR"})
                    //         history.push('/')
                    //     }}>
                    //         logout
                    //     </Link>
                    // </div>,
                      
                )
            }
            else{
                return (
                    <React.Fragment>
                    <Navbar dark expand="sd" diaply="inline">
                        <div className="navu" display="inline">                
                            {/* <NavbarBrand className="mr-auto" href="/">URC Bagdogra</NavbarBrand>  */}
                            <Nav navbar display="inline">
                            
                                <NavItem className='rout' key="7" display="inline">
                                    <Link className="nav-link" to="/login">
                                        login
                                    </Link>
                                </NavItem>
                                <NavItem className='rout' key="8" display="inline">
                                    <Link className="nav-link" to="/signup">
                                        signup
                                    </Link>
                                </NavItem>
                                
                            </Nav>   
                        </div>
                    </Navbar>  
                    </React.Fragment>      
                    // <div className='rout' key="7"><Link to="/login">login</Link></div>,
                    // <div className='rout' key="8"><Link to="/signup">signup</Link></div>,
                )
            }
       
    }
    return (
        <div>
            {renderlist()}
        </div>      
    );
}
  
export default NavBar;
