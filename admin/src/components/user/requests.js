import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import Loading from '../loading'
import Usernav from '../usernav'
const SignupRequests= ()=>{

   const [data,setdata]=useState([])
   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)
   const [page,setpage]=useState(1)
   const [loading,setloading]=useState(false)
   const [pages,setpages]=useState([1])
   const [pagenum,setpagenum]=useState(1)

    useEffect(()=>{
        getresult(1)
    },[])

    const getresult=(pg)=>{
        setloading(false)
        fetch(serverurl+'/usersrequests/allreq',{
            method:"post",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("token")
            },
            body:JSON.stringify({
               pgnum:pg
            })
         }).then(res=>res.json())
         .then(result=>{
            console.log(result)
            setdata(result.usersreq)
            setpage(pg)
        let l=pg-1>5?5:pg-1;
        let r=result.pages-pg>5?5:result.pages
        l=r<5?l+5-r:l;
        r=l<5?r+5-l:r;
      let d=[]
        for(var i=pg-l;i<=pg+r;i++){
           if(i<1) i=1;
           if(i>result.pages) break;
         d.push(i)
        }
        setpages(d)
        setpagenum(result.pages)
            setloading(true)
         }).catch(err=>{
             setloading(true)
             setmsg("error loading")
            console.log(err)
         })
     }

const approve=(id)=>{
    fetch(serverurl+'/users/signup/'+id,{
        method:"post",
        headers:{
        "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token"),
        }
     }).then(res=>res.json())
     .then(result=>{
        if(!result.err){
            let d=data.filter(item=>{
                return item._id!=id;
            });
            setdata(d);
            setmsg("sign up request approed successfully")
        }
     }).catch(err=>{
         setmsg("error approving user")
     })
}
const reject=(id)=>{
    fetch(serverurl+'/usersrequests/'+id,{
        method:"delete",
        headers:{
        "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token"),
        }
     }).then(res=>res.json())
     .then(result=>{
        if(!result.err){
            let d=data.filter(item=>{
                return item._id!=id;
            });
            setdata(d);
            setmsg("user request rejected")
        }
     }).catch(err=>{
        setmsg("error rejecting user")
    })
}

return(

   <div className='main'>
       <Usernav />
   <div class='headt'> signup requests </div>
       <div>{msg}</div>
       <div className='list'>
    {
        data&&loading?
        data.map(item=>{
            return(
            <div className='product2'>
                <div>name: {item.name}</div>
                <div>mobile number: {item.mobileNumber}</div>
                <div>email: {item.email}</div>
                <div>living in: {item.livingIn}</div>
                <div>
                    <button onClick={()=>{if(window.confirm('are you sure, you want to approve this user request?')){approve(item._id)}}}>approve</button>
                    <button className='redbutton' onClick={()=>{if(window.confirm('are you sure, you want to reject this user request?')){reject(item._id)}}}>reject</button>
                </div>
            </div>
            )
        }):
        <Loading />
    }</div>
    {
       data.length==0&&loading?
       <div>no signup requests found</div>:
       <div></div>
    }
      <div>
            {
                pages?
                pages.map(item=>{
                    return(
                        <button disabled={item==page?true:false} onClick={()=>getresult(item)}>{item}</button>
                    )
                }):"loading"
            }
            <div>... total {pagenum} pages</div>
        </div>
   </div>

)

}

export default SignupRequests