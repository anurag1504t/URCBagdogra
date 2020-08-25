import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {Link} from 'react-router-dom'

const Cart= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)

   useEffect(()=>{
      fetch('http://localhost:5000/cart',{
         method:"get",
         query:JSON.stringify({})
      }).then(res=>res.json())
      .then(result=>{
         setdata(result.items)
      })
   },[])
   let total=0

return(

   <div><Link to='shop'>shop</Link>
       <div>
        {
            data.map(item=>{
                total+=item.item.price*item.quantity;
                return (
                    <div>{item.item.name} price:{item.item.price} quantity:{item.quantity}</div>
                )
            })
        }
        </div>
        <div>
            total amount: {total} INR;
        </div>
        <div>
            <Link to='/order'>checkout</Link>
        </div>
   </div>

)

}

export default Cart