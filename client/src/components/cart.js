import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link,useHistory} from 'react-router-dom'
import Loading from './loading'
import '../stylesheet/cart.css'


const Cart= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)
   const [loading,setloading]=useState(false)
   const history=useHistory()
   const [msg,setmsg]=useState("")


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
      }).catch(err=>{
         history.push("/")
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
         console.log(JSON.stringify(result));
         setloading(true)
      }).catch(err=>{
         setloading(true)
         setmsg("error loading the cart")
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
         setmsg("error adding to the cart")
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
         setmsg("error removing from the cart")
      })
   }
const emptycart=()=>{
   fetch(`${serverurl}/cart/emptycart`,{
      method:"get",
      headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("token")
      }
   }).then(res=>res.json())
   .then(result=>{
      console.log(result)
      updatecart(result.items);
   }).catch(err=>{
      console.log(err)
      setmsg("error emptying the cart")
   })
}
return(

   <div className='main-cart'>
   <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 
      <div>{msg}</div>
      <div className="yoyo">
       <ul className='cartlist'>
        {data&&loading?
            data.map(item=>{
                total+=item.item.price*item.quantity;
                return (
                    <li className='cartobj'>{<h3>{item.item.name}</h3>}    Current Quantity:<button className='add cart-button' disabled={item.item.quantity>0?((item.quantity>=item.item.maxQuantity||item.quantity>=item.item.quantity)?true:false):true} onClick={()=>addtocart(item.item._id)}>+</button>
                              {item.quantity}
                              <button className='remove cart-button' disabled={false}  onClick={()=>removefromcart(item.item._id)}>-</button>
                              <div>max quantity - {item.item.maxQuantity}</div>
                              <div>total quantity - {item.item.quantity}</div>

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
        <div>
        <h3>Your Shopping Cart is empty</h3>
        <p>To add items go to the shop page</p></div>:
        <div>
        <div className='ta'>
            total amount: {total} INR
        </div>
        <div className="inline">
           <button className="cart-button"><Link to='/checkout'>checkout</Link></button> 
        
           <button className="cart-button" onClick={()=>{if(window.confirm('are you sure, you want to empty the cart?')){emptycart()}}}>empty cart</button>
           </div>
        </div>):<div></div>
        
}
</div>

 
   </div>

)

}

export default Cart