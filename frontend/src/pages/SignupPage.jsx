import React from 'react'
import Signup from "../components/Signup/Signup";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(()=>{
      if(isAuthenticated === true){
        Navigate("/");
      }
  }, [])
  return (
    <div>
        <Signup/>
    </div>
  )
}

export default SignupPage