
import React,{ useState ,useContext  } from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import {usercontext} from '../App'
import {serverurl} from '../config'
import '../stylesheet/style.css';


const Signup= ()=>{
    const{state,dispatch}=useContext(usercontext)
    const history=useHistory()
    const [username,setuid]=useState("")
    const [password,setpassword]=useState("")
    const [email,setemail]=useState("")
    const [mobile,setmobile]=useState(null)
    const [repassword,setrepassword]=useState("")
    const [name,setname]=useState("")
    const [livein,setlivein]=useState(false)
    const [msg,setmsg]=useState("")

    const validate=()=>{
        console.log(password,username,name,email,mobile)
        if(!password||!email||!name||!username||!mobile){
            setmsg("fill all the fields")
            return 0;
        }
        if(name.length<3){
            setmsg("enter correct name (greate than 3 alphabets)")
            return 0;
        }
        if(username.length<5){
            setmsg("choose correct username (greate than 5 alphabets)")
            return 0;
        }
        if(password.length<6){
            setmsg("minimum password length is 6")
            return 0;
        }
        if(password!=repassword){
            setmsg("password do not match")
            return 0;
        }
        if(mobile<6000000000||mobile>9999999999){
            setmsg("enter correct mobile number")
            return 0;
        }
        return 1
    }

    const submitform=(e)=>{
        e.preventDefault();
        if(!validate()) return 0;

        fetch(serverurl+"/usersrequests/req",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password,email,mobileNumber:mobile,
                name,livingIn:livein
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.err){
                setmsg("try changing username or email")
            }
            else{
                history.push(`/signupmsg/${data.name}`)
            }
            
        })
    }


return(

    <div className='main'>
         <div className='message'>{msg}</div>
         <form onSubmit={(e)=>submitform(e)}>
       <div><input type='text' minlength="3" placeholder='name' value={name} onChange={(e)=>setname(e.target.value)} /></div> 
       <div> <input type='email' placeholder='email' value={email} onChange={(e)=>setemail(e.target.value)} /></div> 
       <div> <input type='tel' pattern="[0-9]{10}" minlength="10"  maxlength="10" placeholder='mobile number' value={mobile} onChange={(e)=>setmobile(e.target.value)} /></div> 
       <div>  <input type='text' minlength="5" maxlength="20" placeholder='unique id' value={username} onChange={(e)=>setuid(e.target.value)} /></div> 
       <div><input type='password' minlength="6" maxlength="20" placeholder='password' value={password} onChange={(e)=>setpassword(e.target.value)} /></div> 
       <div> <input type='password' minlength="6" maxlength="20" placeholder='retype password' value={repassword} onChange={(e)=>setrepassword(e.target.value)} /></div> 
        <div>living in
            <select value={livein} onChange={(e)=>setlivein(e.target.value)}>
            <option value='true'>living in</option>
            <option value='false'>not living in</option>
            </select>
        </div>
       <div>  <input type='submit' value='submit' /></div> 
       </form>
    </div>


)

}

export default Signup