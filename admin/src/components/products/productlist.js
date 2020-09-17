import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'
const Productlist= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])
   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)

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
            if(result.length==0) setmsg("no product found")
         })
    },[])


const searchproduct=(query)=>{
    let userpattern=new RegExp(query,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)
    })
    setlist(dd);
    if(dd.length==0) setmsg("no product found")
    else setmsg("")
    console.log(list)
   }

return(

   <div className='main'>
       <ProductNavBar />
       
   <div class='headt'> products list  </div>
       <input type='text' onChange={(e)=>searchproduct(e.target.value)} placeholder='search' />
       <div>{msg}</div>
<div className='list'>
    {
        list?
        list.map(item=>{
            return(
            <div className='product2'><Link to={`/productdetails/${item._id}`} className='ll'>
                <div><img src={item.image} height='100px' width='100px' /></div>
                <div>name: {item.name}</div>
                <div>size: {item.size}</div>
                <div>quantity: {item.quantity}</div>
                <div>price: {item.price}</div>
                <div>max quantity: {item.maxQuantity}</div>
                <div>category: {item.category}</div>
                <div>percent: {item.onlinePercentage}</div></Link>
                <div>
                    <Link to={`/editproduct/${item._id}`}><button>edit product</button></Link>
                </div>
            </div>
            )
        }):
        <div>
            <Loading />
        </div>
    }</div>
   </div>

)

}

export default Productlist