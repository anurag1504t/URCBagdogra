import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { usercontext } from "../App";
import Tiger from "../img/Tiger.png";
import "../stylesheet/navbar.css";
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse} from 'reactstrap';
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
                            <img src={Tiger} width="50px" ></img>              
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
                                        <span className="fa fa-store">@</span> Shop
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
                                         fetch(serverurl+"/users/logout",{
                                            method:"get",
                                            headers:{
                                                "Content-Type":"application/json",
                                                Authorization:"Bearer "+localStorage.getItem("token")
                                            }
                                        }).then(res=>res.json())
                                        .then(data=>{
                                            localStorage.clear();
                                            dispatch({type:"CLEAR"})
                                            history.push('/')
                                        }).catch(err=>{
                                            localStorage.clear();
                                            dispatch({type:"CLEAR"})
                                            history.push('/')
                                        })
                                    }}>
                                        <span className="fa fa-sign-out"></span> logout
                                    </Link>
                                </NavItem>
                            </Nav> 
                            </Collapse>
                        </div>
                    </Navbar>
                    </React.Fragment>                      
                )
            }
            else{
                return (
                    <React.Fragment>
                    <Navbar dark expand="md" >
                        <div className="container" > 
                            <NavbarToggler onClick={toggleNav} />                                           
                            <NavbarBrand className="rout mr-auto" href="/">
                                <span><img src={Tiger} width="50px"></img></span>
                                URC Bagdogra
                            </NavbarBrand> 
                            <Collapse isOpen={panel} navbar> 
                            <Nav navbar>
                            
                                <NavItem className='rout' key="7" >
                                    <Link className="nav-link" to="/login">
                                        <span className="fa fa-sign-in"></span> login
                                    </Link>
                                </NavItem>
                                <NavItem className='rout' key="8" >
                                    <Link className="nav-link" to="/signup">
                                        <span className="fa fa-user-plus"></span> signup
                                    </Link>
                                </NavItem>
                                
                            </Nav>  
                            </Collapse> 
                        </div>
                    </Navbar>  
                    </React.Fragment>
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
