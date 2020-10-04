import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {useHistory} from 'react-router-dom'
import {serverurl} from '../config'
import Loading from './loading'
import { Card, CardImg, CardSubtitle, CardTitle } from 'reactstrap'
import '../stylesheet/shop.css'

const Shop= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])
   const [cart,setcart]=useState({})
   const [query,setquery]=useState("")
   const [page,setpage]=useState(1)
   const [loading,setloading]=useState(false)
   const [pages,setpages]=useState([1])
   const [pagenum,setpagenum]=useState(1)
   const [prod,setprod]=useState({type:'category',value:'all'})
   const {state,dispatch}=useContext(usercontext)
   const [category,setcategory]=useState([])
   const [msg,setmsg]=useState("")
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
    }).catch(err=>{
       history.push('/')
    })
 },[])
 const load=()=>{
    fetch(serverurl+'/products/getcategory',{
        method:"get",
        headers:{
           Authorization:"Bearer "+localStorage.getItem("token")
        }
     }).then(res=>res.json())
     .then(result=>{
        console.log("categories "+result.category)
       let d=[]
       for(var i=0;i<result.category.length;i++){
        d.push(result.category[i].name)
       }
       setcategory(d);
     }).catch(err=>{
        setmsg("error loading the page")
     })
    fetch(serverurl+'/cart/',{
       method:"get",
       headers:{
          Authorization:"Bearer "+localStorage.getItem("token"),
       }
    }).then(res=>res.json())
    .then(result=>{
       console.log(result)
       updatecart(result.items)
    }).catch(err=>{
      setmsg("error loading the page")
   })
    getresult(1)
 }
 useEffect(() => {
     getresult(1)
 }, [prod])
   
   const updatecart=(cartarray)=>{
      let c={}
      for(var i in cartarray){
         c[cartarray[i].item._id]=cartarray[i].quantity
         }
      setcart(c);
   }
   const filterproduct=(quer)=>{
       setquery(quer)
    let userpattern=new RegExp(quer,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)
    })
    setlist(dd);
    console.log(list)
   }

   const searchcategory=(quer)=>{
      let d={type:'category',value:quer}
      setprod(d);
   }
   const searchproduct=(quer)=>{
    let d={type:'search',value:query}
    setprod(d);
 }
 const getresult=(pg)=>{
    console.log("with pg "+pg)
    setloading(false)
     let url=''
    if(prod.type=='category'){
        if(prod.value=='all'){
            url='/products/allproducts'
        }else{
        url='/products/category'
    }
    }else{
        url='/products/search'
    }
    fetch(serverurl+url,{
        method:"post",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           query:prod.value,
           pgnum:pg
        })
     }).then(res=>res.json())
     .then(result=>{
        console.log(result)
        setdata(result.products)
        setlist(result.products)
        setpage(pg)
        let l=pg-1>5?5:pg-1;
        let r=result.pages-pg>5?5:result.pages
        l=r<5?l+5-r:l;
        r=l<5?r+5-l:r;
      let d=[]
        for(var i=pg-l;i<=pg+r;i++){
           if(i<1) i=1;
           if(i>result.pages) break;
         d.push(i)
        }
        setpages(d)
        setpagenum(result.pages)
        setloading(true)
        setmsg("")
        setquery("")
     }).catch(err=>{
        console.log(err)
        setmsg("error loading the page")
     })
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
         setmsg("error removing from the cart")
         console.log(err)
      })
   }


return(
    <div>

   <div className='main'>
<div>{msg}</div>
      {
      loading?
      <div className='main'>
            <div className="row">
                <div className='dropdown category col-3'>
                    <div><button className='dropbtn'>categories</button></div>
                    <div className='dropdown-content'>
                        <span onClick={()=>searchcategory("all")}>All</span>
                        {
                           category?
                           category.map(item=>{
                              return(
                                 <span onClick={()=>searchcategory(item)}>{item}</span>
                              )
                           })
                           :
                           <span>No Category</span>
                        }
                    </div>
                </div>
            
                <div className="category col-6">
                    <input type='text' value={query} onChange={(e)=>filterproduct(e.target.value)} placeholder='search' />
                </div>
                <div className="category col-3">
                    <button className="search-btn fa fa-search" onClick={()=>searchproduct()}></button>
                </div>
            </div>
        <div className='row'>
        
            {  list?
                list.map(item=>{
                    return(   
                        <div className="col-6 col-md-2 mb-3">
                            <Card className={cart[item._id]?"product1":"product2"}>
                                <CardTitle className='t'>{item.name}</CardTitle>
                                <CardSubtitle>{item.size}</CardSubtitle>
                                <CardImg width="100%" height="100%" src={item.image} alt={item.name} />
                                {/* <div><img src={item.image} height='200px' width='200px' /></div> */}
                                <div className='t'>price : Rs.{item.price}</div>
                                <div>
                                    <button className='add' disabled={item.quantity>0?((cart[item._id]>=item.maxQuantity||cart[item._id]>=item.quanity)?true:false):true} onClick={()=>addtocart(item._id)}>+</button>
                                    <span className='t'>{cart[item._id]?cart[item._id]:0}</span>
                                    <button className='remove' disabled={cart[item._id]?(cart[item._id]>0?false:true):true} onClick={()=>removefromcart(item._id)}>-</button>
                                </div>
                                    <div>max quantity : {item.maxQuantity}</div>
                                <div>total quantity : {item.quantity}</div>
                            </Card>
                        </div>
                    )
                }):
                <Loading />
            }
       
        </div>
        <div>
            {
                pages?
                pages.map(item=>{
                    return(
                        <button disabled={item==page?true:false} onClick={()=>getresult(item)}>{item}</button>
                    )
                }):"loading"
            }
            <div>... total {pagenum} pages</div>
        </div>
   </div>:
    <Loading />
}
   </div>
   <br></br><br></br>
   </div>
)

}

export default Shop