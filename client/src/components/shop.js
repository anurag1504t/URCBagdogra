import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {Link} from 'react-router-dom'

const Shop= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])
   const [cart,setcart]=useState({})
   const {state,dispatch}=useContext(usercontext)
   const [category,setcategory]=useState([])
   useEffect(()=>{
      fetch('http://localhost:5000/products',{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         setdata(result)
         setlist(result)
         let s=new Set()
         for(r in result){
            s.add(r.category);
         }
         setcategory(s);
      })
   },[])
   useEffect(()=>{
      fetch('http://localhost:5000/cart',{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         updatecart(result.items)
      })
   },[])
   
   const updatecart=(cartarray)=>{
      let c={}
      for(i in cartarray){
         c[cartarray[i].item]=cartarray[i].quantity;
      }
      setcart(c);
   }
   const searchproduct=(query)=>{
    let userpattern=new RegExp(query)
    let dd=data.filter(val=>{
        userpattern.test(val.name)
    })
    setlist(dd);
   }

   const searchcategory=(query)=>{
      let dd=data.filter(val=>{
         return (val.category===query)
      })
      setlist(dd);
   }

   const addtocart=(id)=>{
      fetch('http://localhost:5000/addtocart',{
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
         updatecart(result);
      }).catch(err=>{
         console.log(err)
      })
   }

   const removefromcart=()=>{
      fetch('http://localhost:5000/removefromcart',{
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
         updatecart(result);
      }).catch(err=>{
         console.log(err)
      })
   }

return(

   <div>
      <div>
         
         <Link to='/home'><img src={} />//logo</Link>
         <Link to='/profile'>account</Link>
      </div>

      <div class="dropdown">
         <button className="dropbtn">menu</button>
         <div className="dropdown-content">
            <div>
               <button>categories</button>
               <div className='category-content'>
                  {
                     category.map(item=>{
                        return(
                           <button onclick={searchcategory(item)}>item</button>
                        )
                     })
                  }
               </div>
            </div>
            <div>
               <button>new arrival</button>
            </div>
         </div>
      </div>

        <input type='text' onChange={(e)=>searchproduct(e.target.value)} placeholder='search' />
        <Link to='/cart'>cart</Link>
        <div>
            {
                list.map(item=>{
                    return(
                        <div>
                           <div>{item.name}</div>
                           <div><img src={item.image} /></div>
                           <div>
                              <button onclick={addtocart(item._id)}>+</button>
                              {cart[item._id]}
                              <button onclick={removefromcart(item._id)}>-</button>
                           </div>
                        </div>
                    )
                })
            }
        </div>
   </div>

)

}

export default Shop