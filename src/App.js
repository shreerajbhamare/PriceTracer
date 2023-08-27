import React, {useState, useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./Component/Login";
import SignUp from "./Component/Signup";
import Home from "./Component/Home";
import AddProduct from './Component/AddProduct';
import UserContext from './context/userContext';
import { BACKEND } from "./config";
import axios from "axios";
import Check from "./Component/Check";
import Header from "./Component/Header";
import Land from './Component/Land';
import ProtectedRoute from './Component/ProtectedRoute';
import About from './Component/About';
import RecProducts from './Component/RecProducts';
import Graphs from './Component/Graphs';
import Profile from './Component/Profile';
import Unauthorised from './Component/Unauthorised';
import EditThreshold from './Component/EditThreshold';

function App() {

  
  const [isUserValid, setIsUserValid] = useState(true);
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");

      if(token === null){
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenResponse = await axios.post(BACKEND + '/users/tokenIsValid', null, {headers: {"x-auth-token": token}});
      if (tokenResponse.data) {
       
        setIsUserValid(true);
      }
      else {
        setIsUserValid(false);

      }

    }
    checkLoggedIn();
  }, []);

  const graphsWithId = ({ match }) => {
    return (
      <div>
        <Graphs id={match.params.id} />
      </div>
    );
  };


  return (<Router>
    <UserContext.Provider value={{ isUserValid, setIsUserValid }}>

    <div className="App">
      <Header/>
      <Switch>
        <Route exact path='/' component={Land} />
        <Route exact path="/signin" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/unauthorised" component={Unauthorised} />

         {/* <Route exact path="/check" component={Check} /> */}
         
         <ProtectedRoute exact path= '/check' user= {isUserValid} component= {Check} />
         <ProtectedRoute exact path='/home' user={isUserValid} component={Home} />
         <ProtectedRoute exact path="/products/addproduct" user={isUserValid} component={AddProduct} />
         <ProtectedRoute exact path="/about" user={isUserValid} component={About} />
         <ProtectedRoute exact path="/products/getRecommendation" user={isUserValid} component={RecProducts}/>
         <ProtectedRoute exact path="/graphs/:id" user={isUserValid} component={graphsWithId} />
         <ProtectedRoute exact path="/products/editThreshold/:id" user={isUserValid} component={EditThreshold} />
         <ProtectedRoute exact path="/profile" user={isUserValid} component={Profile} />

         {/* <Route path="/home" component={Home} /> */}
         {/* <Route exact path="/products/addproduct" component={AddProduct}/> */}
      </Switch>

    </div>
    </UserContext.Provider>
    
    </Router>
      );
}

export default App;