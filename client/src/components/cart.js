import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {serverurl} from '../config'
import {Link,useHistory} from 'react-router-dom'
import Loading from './loading'
import '../stylesheet/cart.css'
import confirm from "reactstrap-confirm";


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
      setmsg("")

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
      setmsg("")

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
const emptycart=async ()=>{
   setmsg("")
   let result = await confirm(
      {
          title: ( "dear user"),
          message: "are you sure you want to empty the cart?",
          confirmText: "ok",
          confirmColor: "primary",
          cancelText: "cancel"
      }
  ); 
  if(result==false) return false;
  else setloading(false)

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
      setloading(true)
   }).catch(err=>{
      setloading(true)
      console.log(err)
      setmsg("error emptying the cart")
   })
}
return(

   <div className='main-cart'>
   {/* <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br> */}
 
      <div>{msg}</div>
      <div className='main-cart'>
       <ul className='cartlist row'>
        {data&&loading?
            data.map(item=>{
                total+=item.item.price*item.quantity;
                return (
                    <li className='col-12 col-md-3 m-1 m-lg-5 mb-1  cartobj'>
                        <div className="row cart-card">
                            <div className="col-12 col-md-6 mb-3 cart-image">
                                <img width="100%" height="100%" src={item.item.image} alt={item.item.name} />
                            </div>
                            <div className = "col-12 col-md-6 mb-3 cart-content">
                                <div>                                
                                    <h4>{item.item.name}</h4>
                                    Current Quantity:<button className='add cart-button' disabled={item.item.quantity>0?((item.quantity>=item.item.maxQuantity||item.quantity>=item.item.quantity)?true:false):true} onClick={()=>addtocart(item.item._id)}>+</button>
                                    {item.quantity}
                                    <button className='remove cart-button' disabled={false}  onClick={()=>removefromcart(item.item._id)}>-</button>
                                </div>
                                <div>
                                    Price: ₹ {item.item.price}<br></br>
                                    Subtotal: ₹ {item.item.price*item.quantity}
                                </div>
                            </div>
                        </div>
                        
                    </li>
                )
            })
            :
            <Loading />
        }
        </ul>
        
        {loading?(
        data.length==0?
        <div className="empty-cart">
        <h3>Your Shopping Cart is empty</h3>
        <p>To add items go to the shop page</p></div>:
        <div>
        <div className='ta'>
            total amount: {total} INR
        </div>
        <div className="inline">
        <Link to='/checkout'> <button className="cart-button">checkout</button></Link> 
        
           <button className="cart-button" onClick={()=>{emptycart()}}>empty cart</button>
           </div>
        </div>):<div></div>
        
}
</div>

 
   </div>

)

}

export default Cart