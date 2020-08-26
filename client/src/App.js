import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import NavBar from "./components/navbar"

import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/home'
import Profile from './components/profile'
import Login from './components/login'
import Cart from './components/cart'
import Checkout from './components/checkout'
import Shop from './components/shop'
import Final from './components/final'
import {initialstate,reducer} from './reducers/userreducer'
export const usercontext=createContext()

const Routing=()=>{
  const history=useHistory() 
  const {state,dispatch}=useContext(usercontext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      history.push('/')
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
    <Route exact path='/profile'>
      <Profile />
    </Route>
    <Route path='/cart'>
      <Cart />
    </Route>
    <Route path='/checkout'>
      <Checkout />
    </Route>
    <Route path='/final'>
      <Final />
    </Route>
    </Switch>
  )
}

function App() {

  const [state,dispatch]=useReducer(reducer,initialstate)

  return (
    <usercontext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <NavBar/>
    <Routing />
    </BrowserRouter>
    </usercontext.Provider>

  );
}

export default App;
