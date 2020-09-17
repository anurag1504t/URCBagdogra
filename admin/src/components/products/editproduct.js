import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'
const EditProduct= ()=>{

   const [data,setdata]=useState([])
   const [msg,setmsg]=useState("")
   const {productid}=useParams()
   const {state,dispatch}=useContext(usercontext)
   const [name,setname]=useState("")
   const [size,setsize]=useState("")
   const [quantity,setquantity]=useState("")
   const [category,setcategory]=useState(false)
   const [max,setmax]=useState(false)
   const [price,setprice]=useState(0)
   const [url,seturl]=useState(false)
   const [percent,setpercent]=useState(100)


    useEffect(()=>{

        fetch(`${serverurl}/products/${productid}`,{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token"),
            }
         }).then(res=>res.json())
         .then(result=>{
            setdata(result)
            setname(result.name)
            setsize(result.size)
            setquantity(result.quantity)
            setcategory(result.category)
            setpercent(result.onlinePercentage)
            seturl(result.image)
            setmax(result.maxQuantity)
            setprice(result.price)
         })
    },[])



const updateproduct=(e)=>{
   e.preventDefault()
    fetch(`${serverurl}/products/${productid}`,{
        method:"put",
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
        console.log(result)
        setmsg("updated successfully")
     }).catch(err=>{
        console.log(err)
     })
}

const delproduct=()=>{
    fetch(`${serverurl}/products/${productid}`,{
        method:"delete",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        }
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
        setmsg("deleted successfully")
     }).catch(err=>{
        console.log(err)
     })
}

return(

   <div className='main'>
   <ProductNavBar />

   
   <div class='headt'> edit product  </div>
       <div>{msg}</div>

    {
        data?<div>
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
    <button className='redbutton' onClick={()=>delproduct()}>delete product</button>
        </div>:
        <div>
        <Loading />
        </div>
    }
   </div>

)

}

export default EditProduct