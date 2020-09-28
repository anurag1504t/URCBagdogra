import React,{useState,useEffect,useContext} from 'react'
import {usercontext} from '../App'
import {Link} from 'react-router-dom'
import {serverurl} from '../config'
import ReactLoading from 'react-loading';
import { UncontrolledCarousel } from 'reactstrap';
import '../stylesheet/home.css'

const Home= ()=>{

   const [data,setdata]=useState([])
   const {state,dispatch}=useContext(usercontext)
   const [loading,setloading]=useState(false)

   useEffect(()=>{

        fetch(serverurl+'/feeds/',{
            method:"get",
            query:JSON.stringify({})
        }).then(res=>res.json())
        .then(result=>{
            setdata(result)
            setloading(true)
        })
   },[])

return(
    <div>

        <div className="air-force">
            <AirForce />
        </div>
        
        <div className='main-home'>


            <h2 className='news'> NEWS </h2>
            <div>
                {
                    data&&loading ?
                    <div>
                        <marquee onmouseover="stop();" onmouseout="start();" direction="up" scrolldelay="0" scrollamount="3">
                            {
                                data.map(item=>{
                                    return(
                                    <a className='font-alt mb-30 titan-title-size-1' key={item._id}>{item.feeds}</a>
                                    )
                                })
                            }
                       </marquee>
                    </div>
                    :<ReactLoading type='bars' color='floralwhite' height={667} width={375} />
                      }
                      {data.length==0&&loading?
                    <div>
                        No news availaible
                    </div>:<div></div>
                }        
            </div>
        </div>
    </div>
)
}



const items = [
    {
      src: 'https://afcat.cdac.in/AFCAT/assets/images/gallery/Helicopters/helicop9.gif',
      key: '1',
      className: 'air-force-item'
    },
    {
      src: 'https://afcat.cdac.in/AFCAT/assets/images/gallery/Helicopters/helicop3.gif',
      key: '2',
      className: 'air-force-item'
    },
    {
      src: 'https://images.financialexpress.com/2019/10/PIC-5.jpg',
      key: '3',
      className: 'air-force-item'
    }
  ];
  
  const AirForce = () => <UncontrolledCarousel items={items} />;

export default Home