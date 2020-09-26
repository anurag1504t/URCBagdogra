import React,{useContext, useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'
import '../stylesheet/style.css';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse} from 'reactstrap';

import {serverurl} from '../config'
const NavBar=()=> {

    const{state,dispatch}=useContext(usercontext) 
    const [panel, setPanel] = useState(false);
    const history=useHistory()

    function toggleNav () {
        if(!panel) setPanel(true);
        else setPanel(false);
        }

    const renderlist=()=>{

            if(state){
                return (
                    <React.Fragment>
                    <Navbar dark expand="md">
                        <div className="container"> 
                            <NavbarToggler onClick={toggleNav} />               
                            <NavbarBrand className="rout mr-auto" href="/">URC Bagdogra</NavbarBrand> 
                            <Collapse isOpen={panel} navbar>                            
                            <Nav navbar>
                                <NavItem className='rout' key="1">
                                    <Link className="nav-link" to="/profile">
                                        <span className="fa fa-home fa-lg"></span> Account
                                    </Link>
                                </NavItem>                    
                                <NavItem className='rout' key="3">
                                    <Link className="nav-link" to="/shop">
                                        <span className="fa fa-store"></span> Shop
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
                                <NavItem className='rout' key="2">
                                    <Link className="nav-link" to="/cart">
                                        <span className="fa fa-shopping-cart"></span> cart
                                    </Link>
                                </NavItem>
                                <NavItem className='rout' key="6">
                                    <Link className="nav-link" onClick={()=>{
                                        localStorage.clear();
                                        dispatch({type:"CLEAR"})
                                        history.push('/')
                                    }}>
                                        <span className="fa fa-sign-out"></span> logout
                                    </Link>
                                </NavItem>
                            </Nav> 
                            </Collapse>
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
                    <Navbar dark expand="md" >
                        <div className="container" > 
                            <NavbarToggler onClick={toggleNav} />                
                            <NavbarBrand className="rout mr-auto" href="/">URC Bagdogra</NavbarBrand> 
                            <Collapse isOpen={panel} navbar> 
                            <Nav navbar>
                            
                                <NavItem className='rout' key="7" >
                                    <Link className="nav-link" to="/login">
                                        login
                                    </Link>
                                </NavItem>
                                <NavItem className='rout' key="8" >
                                    <Link className="nav-link" to="/signup">
                                        signup
                                    </Link>
                                </NavItem>
                                
                            </Nav>  
                            </Collapse> 
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
