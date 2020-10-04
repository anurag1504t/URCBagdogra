import React,{useContext} from 'react'
import '../stylesheet/loading.css'
import ReactLoading from 'react-loading';
const Loading=()=> {

    /*return (
        <div>
            <ReactLoading type='bars' color='black' height={667} width={375} />
        </div>
    );*/

    return (
        <div className="loader-main">
            <span className='loader'>URC Bagdogra</span>
        </div>
    )
  }
  
  export default Loading;