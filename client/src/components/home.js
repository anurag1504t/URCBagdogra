import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {Link} from 'react-router-dom'

const Home= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
      fetch('http://localhost:5000/news',{
         method:"get",
         query:JSON.stringify({})
      }).then(res=>res.json())
      .then(result=>{
         setdata(result)
      })
   },[])
   

return(

   <div>
        <img src={} />//logo
        <Link to='/login'>Login</Link>
        <div>
            {
               data ?
               <div>
                  {
                     data.map(item=>{
                        return(
                        <div key={item._id}>{item.feeds} posted on : {item.dateposted}</div>
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