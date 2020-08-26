import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {Link} from 'react-router-dom'
import {serverurl} from '../config'
import logo from '../img/logo.jpg'
const Shop= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])
   const [cart,setcart]=useState({})
   const {state,dispatch}=useContext(usercontext)
   const [category,setcategory]=useState([])
   useEffect(()=>{
      fetch(serverurl+'/products/',{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         setdata(result)
         setlist(result)
         let s=new Set()
         for(var r in result){
            s.add(r.category);
         }
         setcategory(s);
      })
   },[])
   useEffect(()=>{
      fetch(serverurl+'/cart/',{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         console.log(result)
         updatecart(result.items)
      })
   },[])
   
   const updatecart=(cartarray)=>{
      let c={}
      for(var i in cartarray){
         c[cartarray[i].item._id]=cartarray[i].quantity
         }
      setcart(c);
   }
   const searchproduct=(query)=>{
    let userpattern=new RegExp(query,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)
    })
    setlist(dd);
    console.log(list)
   }

   const searchcategory=(query)=>{
      let dd=data.filter(val=>{
         return (val.category===query)
      })
      setlist(dd);
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
      
      {/*
      <div class="dropdown">
         <button className="dropbtn">menu</button>
         <div className="dropdown-content">
            <div>
               <button>categories</button>
               <div className='category-content'>
                  {
                     category?
                     category.map(item=>{
                        return(
                           <button onclick={searchcategory(item)}>item</button>
                        )
                     })
                     :"no category"
                  }
               </div>
            </div>
            <div>
               <button>new arrival</button>
            </div>
         </div>
               </div>*/}

        <input type='text' onChange={(e)=>searchproduct(e.target.value)} placeholder='search' />
        <div className='list'>
            {  list?
                list.map(item=>{
                    return(
                        <div className='product'>
                           <div className='t'>{item.name}</div>
                           <div><img src={item.image} height='200px' width='200px' /></div>
                           <div>
                              <button className='add' onClick={()=>addtocart(item._id)}>+</button>
                              <span className='t'>{cart[item._id]?cart[item._id]:0}</span>
                              <button className='remove' onClick={()=>removefromcart(item._id)}>-</button>
                           </div>
                        </div>
                    )
                }):"loading"
            }
        </div>
   </div>

)

}

export default Shop