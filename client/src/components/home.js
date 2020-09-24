import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {Link} from 'react-router-dom'
import {serverurl} from '../config'
import Loading from './loading'

const Home= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)
   const [loading,setloading]=useState(false)

   useEffect(()=>{

      fetch(serverurl+'/feeds/',{
         method:"get",
         query:JSON.stringify({})
      }).then(res=>res.json())
      .then(result=>{
         setdata(result)
         setloading(true)
      })
   },[])
   

return(
    <div className='main'>
        <div className='news'> NEWS </div>
        <div>
            {
                data&&loading ?
                <div>
                   {
                      data.map(item=>{
                         return(
                         <div className='newsdata' key={item._id}>{item.feeds}</div>
                         )
                      })
                   }
                </div>
                :<Loading />
                  }
                  {data.length==0&&loading?
                <div>
                    No news availaible
                </div>:<div></div>
            }        
        </div>
    </div>
)
}

export default Home