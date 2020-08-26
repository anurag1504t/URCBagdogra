import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link} from 'react-router-dom'

const Cart= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
      fetch(serverurl+'/cart/',{
         method:"get",
         query:JSON.stringify({}),
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
        let cc=result.items.filter(val=>{
            return val.quantity!=0
        })
         setdata(cc)
      })
   },[])
   let total=0

return(

   <div className='main'>
       <ul>
        {data?
            data.map(item=>{
                //total+=item.item.price*item.quantity;
                return (
                    <li className='cartobj'>{item.item.name} - {item.quantity}</li>
                )
            })
            :"loading"
        }
        </ul>
        <div>
            {//total amount: {total} INR;
            }
        </div>
        <div>
           <button><Link to='/checkout'>checkout</Link></button> 
        </div>
   </div>

)

}

export default Cart