import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import NavBar from "./components/navbar"

import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/home'
import Profile from './components/profile'
import Login from './components/login'
import Signup from './components/signup'
import Signupmsg from './components/signupmsg'
import Cart from './components/cart'
import Checkout from './components/checkout'
import Shop from './components/shop'
import Final from './components/final'
import WindowFinal from './components/windowfinal'
import WindowSlotBook from './components/windowslot'
import Orders from './components/orders'


import {initialstate,reducer} from './reducers/userreducer'
import { Header } from './components/header';
export const usercontext=createContext()

const Routing=()=>{
  const history=useHistory() 
  const {state,dispatch}=useContext(usercontext)
  useEffect(()=>{
    const user=JSON.parse(JSON.stringify(localStorage.getItem("user")))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      //history.push('/')
    }
  },[])
  return (
<Switch>
    <Route exact path='/'>
      <Home />
    </Route>
    <Route path='/login'>
      <Login />
    </Route>
    <Route path='/shop'>
      <Shop />
    </Route>
    <Route path='/signup'>
      <Signup />
    </Route>
    <Route path='/signupmsg/:name'>
      <Signupmsg />
    </Route>
    <Route exact path='/profile'>
      <Profile />
    </Route>
    <Route path='/cart'>
      <Cart />
    </Route>
    <Route path='/checkout'>
      <Checkout />
    </Route>
    <Route path='/final/:id'>
      <Final />
    </Route>
    <Route path='/orders'>
      <Orders />
    </Route>

    <Route path='/windowfinal/:id'>
      <WindowFinal />
    </Route>
    <Route path='/windowslotbooking'>
      <WindowSlotBook />
    </Route>

  
    </Switch>
  )
}

function App() {

    const [state,dispatch]=useReducer(reducer,initialstate)

    return (
        <usercontext.Provider value={{state,dispatch}}>
            <BrowserRouter>
            <Header />
                <div className = 'inside'>
                    <NavBar/>
                    <Routing />
                </div>                
            </BrowserRouter>
        </usercontext.Provider>
    );
}

export default App;
