import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../../App'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'
const UpdateQuantity= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])

   const [quantitylist,setquantity]=useState({})
   const [pricelist,setprice]=useState({})
   const [maxquantitylist,setmaxquantity]=useState({})

   const [msg,setmsg]=useState("")
   const {state,dispatch}=useContext(usercontext)
   let quantity={}
   let price={}
   let maxquantity={}



   useEffect(()=>{
    setvalues()
   },[data])

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

const setvalues=()=>{
    for(var i=0;i<data.length;i++){
        quantity[data[i]._id]=data[i].quantity
        price[data[i]._id]=data[i].price
        maxquantity[data[i]._id]=data[i].maxQuantity
    }
    setquantity(quantity)
    setprice(price)
    setmaxquantity(maxquantity)
}

const setq=(id,pq)=>{
    quantity[id]=pq
    setquantity(quantity)
}
const setp=(id,pp)=>{
    price[id]=pp
    setprice(price)
}
const setmxq=(id,pmxq)=>{
    maxquantity[id]=pmxq
    setmaxquantity(maxquantity)
}

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

const updateq=(id)=>{

    fetch(`${serverurl}/products/productvalues/update`,{
        method:"put",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           id:id,
           quantity:quantitylist[id],
           price:pricelist[id],
           maxquantity:maxquantitylist[id]
        })
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
        setmsg("updated successfully")
     }).catch(err=>{
        console.log(err)
     })
}

return(

   <div className='main'>
   <ProductNavBar />
   
   <div class='headt'> update product quantity and price  </div>
       <input type='text' onChange={(e)=>searchproduct(e.target.value)} placeholder='search' />
       <div>{msg}</div>
<div className='list'>
    {
        list?
        list.map(item=>{
            return(
            <div className='product2'>
                <div><img src={item.image} height='100px' width='100px' /></div>
                <div>name: {item.name}</div>
                <div>size: {item.size}</div>
                <div>price: {item.price}</div>
                <div>quantity<input className='ip' id={item.id} value={quantitylist[item._id]} onChange={(e)=>setq(item._id,e.target.value)} /></div>
                <div>price<input className='ip' id={item.id} value={pricelist[item._id]} onChange={(e)=>setp(item._id,e.target.value)} /></div>
                <div>max quantity<input className='ip' id={item.id} value={maxquantitylist[item._id]} onChange={(e)=>setmxq(item._id,e.target.value)} /></div>
                <div>
                    <button onClick={()=>updateq(item._id)}>submit</button>
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

export default UpdateQuantity