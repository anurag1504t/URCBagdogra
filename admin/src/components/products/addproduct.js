import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'

const AddProduct= ()=>{

   const [data,setdata]=useState({})
   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)
   const [name,setname]=useState("")
   const [size,setsize]=useState("")
   const [price,setprice]=useState("")
   const [quantity,setquantity]=useState("")
   const [category,setcategory]=useState("")
   const [max,setmax]=useState("")
   const [loading,setloading]=useState(true)
   const [url,seturl]=useState("")
   const [percent,setpercent]=useState("")


const updateproduct=(e)=>{
   setloading(false)
   e.preventDefault()
    fetch(`${serverurl}/products/`,{
        method:"post",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           name:name,size:size,quantity:quantity,maxQuantity:max,
           image:url,category:category,onlinePercent:percent,price:price
        })
     }).then(res=>res.json())
     .then(result=>{
        setloading(true)
        console.log(result)
        if(!result.err){
           setmsg("product added successfully")
        }
     }).catch(err=>{
        setloading(true)
        console.log(err)
        setmsg("error adding product")
     })
}


return(

   <div className='main'>
      <ProductNavBar />
   <div class='headt'> add products  </div>
       <div>{msg}</div>

    {loading?
        <div>
        <form onSubmit={(e)=>updateproduct(e)}>
            <div>name: <input value={name} onChange={(e)=>setname(e.target.value)} /></div>
            <div>size <input value={size} onChange={(e)=>setsize(e.target.value)} /></div>
            <div>price <input value={price} onChange={(e)=>setprice(e.target.value)} /></div>
            <div>quantity <input value={quantity} onChange={(e)=>setquantity(e.target.value)} /></div>
            <div>category <input value={category} onChange={(e)=>setcategory(e.target.value)} /></div>
            <div>max quantity <input value={max} onChange={(e)=>setmax(e.target.value)} /></div>
            <div>image url <input value={url} onChange={(e)=>seturl(e.target.value)} /></div>
            <div>online percent <input value={percent} onChange={(e)=>setpercent(e.target.value)} /></div>
    <input type='submit' value='submit' />
    </form>
        </div>:<Loading />
    }
   </div>

)

}

export default AddProduct