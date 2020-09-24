import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link,useHistory} from 'react-router-dom'
import Loading from './loading'


const Cart= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)
   const [loading,setloading]=useState(false)
   const history=useHistory()


   useEffect(() => {
      fetch(serverurl+'/sys/getuserinfo',{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         if(!result.data.usershop){
            history.push('/info/shrestrict')
         }
         else if(!result.data.shop){
            history.push('info/shclose')
         }
         else{
            load()
         }
      })
   },[])

const load=()=>{
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
         console.log(result)
         setloading(true)
      })
   }
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
        {data&&loading?
            data.map(item=>{
                total+=item.item.price*item.quantity;
                return (
                    <li className='cartobj'>{item.item.name} - 
                              <button className='add' disabled={item.item.quantity>0?(item.quantity>=item.item.maxQuantity?true:false):true} onClick={()=>addtocart(item.item._id)}>+</button>
                              {item.quantity}
                              <button className='remove' disabled={false}  onClick={()=>removefromcart(item.item._id)}>-</button>
                              <div>max quantity - {item.item.maxQuantity}</div>
                              <div>price - Rs.{item.item.price}</div>
                    </li>
                )
            })
            :
            <Loading />
        }
        </ul>
        {loading?(
        data.length==0?
        <div>cart is empty</div>:
        <div>
        <div className='ta'>
            total amount: {total} INR
        </div>
        <div>
           <button><Link to='/checkout'>checkout</Link></button> 
        </div>
        </div>):<div></div>
}
   </div>

)

}

export default Cart