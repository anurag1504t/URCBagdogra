import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {Link} from 'react-router-dom'
import {serverurl} from '../config'
const Home= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
      fetch(serverurl+'/feeds/',{
         method:"get",
         query:JSON.stringify({})
      }).then(res=>res.json())
      .then(result=>{
         setdata(result)
      })
   },[])
   

return(

   <div className='main'>
      <div className='news'> NEWS </div>
        <div>
            {
               data ?
               <div>
                  {
                     data.map(item=>{
                        return(
                        <div className='newsdata' key={item._id}>{item.feeds}</div>
                        )
                     })
                  }
               </div>
                  :
                  <div>
                     No news availaible
                  </div>
            }

        </div>
   </div>

)

}

export default Home