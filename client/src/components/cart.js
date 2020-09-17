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
        console.log(cc)
         setdata(cc)
      })
   },[])
   let total=0

   const updatecart=(cartarray)=>{
      let c=[]
      cartarray=cartarray.filter(item=>{
         return item.quantity!=0
      })
      console.log(cartarray)
      for(var i in cartarray){
         c.push(cartarray[i])
         }
      setdata(c);
   }

   const addtocart=(id)=>{
      fetch(`${serverurl}/cart/add/${id}`,{
         method:"put",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         },
         body:JSON.stringify({
            productid:id
         })
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
         updatecart(result.items);
      }).catch(err=>{
         console.log(err)
      })
   }

   const removefromcart=(id)=>{
      fetch(`${serverurl}/cart/remove/${id}`,{
         method:"put",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         },
         body:JSON.stringify({
            productid:id
         })
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
         updatecart(result.items);
      }).catch(err=>{
         console.log(err)
      })
   }

return(

   <div className='main'>
       <ul>
        {data?
            data.map(item=>{
                total+=item.item.price*item.quantity;
                return (
                    <li className='cartobj'>{item.item.name} - 
                              <button className='add' onClick={()=>addtocart(item.item._id)}>+</button>
                              {item.quantity}
                              <button className='remove' onClick={()=>removefromcart(item.item._id)}>-</button>
                    </li>
                )
            })
            :"loading"
        }
        </ul>
        <div className='ta'>
            total amount: {total} INR
        </div>
        <div>
           <button><Link to='/checkout'>checkout</Link></button> 
        </div>
   </div>

)

}

export default Cart