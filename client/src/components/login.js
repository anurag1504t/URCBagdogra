
import React,{ useState ,useContext  } from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'

import {usercontext} from '../App'
import {serverurl} from '../config'
import '../stylesheet/login.css';

import Loading from './loading'

const Login= ()=>{
    const{state,dispatch}=useContext(usercontext)
    const history=useHistory()
    const [username,setuid]=useState("")
    const [password,setpassword]=useState("")
    const [msg,setmsg]=useState("")

    const postdata = () => {
        fetch(serverurl+"/users/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.err){
                setmsg(data.err.message)
            }
            else{
                localStorage.setItem("token",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                console.log(data.user)
                history.push('/')
                
            }
        })
    }

    return(
        <div className="container">
            <div className='inside'>
                <div>
                    <h1>Sign in</h1>
                    <span>to use your account</span>
                </div>
                <div className="main">                    
                    <div className='message'>{msg}</div>
                    <div><input type='text' placeholder='unique id' value={username} onChange={(e)=>setuid(e.target.value)} /></div> 
                    <div><input type='password' placeholder='password' value={password} onChange={(e)=>setpassword(e.target.value)} /></div> 
                    <a href="#">Forgot your password?</a>
                    <Button onClick={()=>postdata()}> login</Button>
                    <p>Not Registered yet?
                        <br></br>Apply for Registration</p>
                    <Link to="/signup"><Button > Register</Button></Link>
                </div>
            </div>
        </div>
    )
}

export default Login