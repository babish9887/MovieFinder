import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
import login from './css/login.module.css';
import { useState } from 'react';
import toast from 'react-hot-toast';

function Signup() {
    const [passwordmatch, setpasswordmatch]=useState(true);
    const navigate=useNavigate();


    async function handleSubmit(e){
        const password=document.getElementById('password').value;
        const confirmpassword=document.getElementById('confirmpassword').value;
        if(password!==confirmpassword){
            setpasswordmatch(false);
            return;
        }
        try{
        e.target.textContent="Signing Up..."
        const name=document.getElementById('name').value;
        const email=document.getElementById('email').value;
        const response=await fetch('http://localhost:4000/api/signup',{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
            },body: JSON.stringify({name: name, email: email, password: password})
        })

        const resdata=await response.json();
        console.log(resdata);
        if(resdata.status==='Fail'){
            return toast.error(resdata.message);
            
        }
        toast.success(resdata.message," Redirecting to Login page");
        setTimeout(()=>{
            navigate('/login');
        },1000)
        } catch(e){
            toast.error(e.message)
        } finally{
            e.target.textContent="Signup"
        }
    }
    function handlepasschange(){
        setpasswordmatch(true);
    }       
    
    

    return (
        <div className={login.main}>
        <div className={login.container}>
            <h1>User Signup</h1>
            <input type='text' placeholder='Name' id='name' required/>
            <input type='text' placeholder='Email' id='email' required/>
            <input type='password' placeholder="Password" id='password'  required/>
            <input type='password' placeholder="Confirm Password" id='confirmpassword' onChange={handlepasschange} required/>
            {!passwordmatch && <p style={{color:'red',alignSelf: 'start'}} >Password doesnot match</p>}
            <button className={login.submit} onClick={handleSubmit}>Signup</button>
            <span style=
        {{fontSize: '1.2rem'}}>Already have an account? <Link to="/login"><button id="signup" className={login.signup} style=
        {{fontSize: '1.2rem'}}>Login</button> </Link></span>
        </div>
        </div>
      )
}

export default Signup