import axios, { Axios } from 'axios'
import React, { useEffect, useState } from 'react'

const LoginMysql = () => {
  const [username, setusername] = useState('')
  const [passWord, setpassWord] = useState('')
  const [status, setstatus] = useState('')
  const [loginStatus, setloginStatus] = useState('')

  

  const register = () => { 
      console.log(username, passWord, status);
      axios.post('http://localhost:8888/register', {
        username: username,
        password: passWord,
        status: status
      }).then((res)=>{
        console.log(res.data);
        alert('Account has been registered!')
      })
   }
   const login = () => { 
    console.log(username, passWord, status);
    axios.post('http://localhost:8888/login', {
      username: username,
      password: passWord
    }).then((res)=>{
      console.log(res.data);
    })
 }

 useEffect(() => {
  axios.get('http://localhost:8888/login').then((res)=>{
    console.log(res);
    if (res.data.loggedIn == true) {
      setloginStatus('Ok! Logged In')
    }
  })
 }, [])
 

  return (
    <div>
      <div>
      <h1>Reg Test</h1>
      <input onChange={(e)=> setusername(e.target.value)} value={username} placeholder='username'/>
      <input type='password' onChange={(e)=> setpassWord(e.target.value)} value={passWord} placeholder='password'/>
      <select onChange={(e)=> setstatus(e.target.value)}>
        <option value={1}>Select</option>
        <option value={1}>Active</option>
        <option value={2}>Non Active</option>
      </select>
      <button onClick={register}>Register</button>
    </div>
    <div>
      <h1>Login Test</h1>
      <input onChange={(e)=> setusername(e.target.value)} value={username} placeholder='username'/>
      <input type='password' onChange={(e)=> setpassWord(e.target.value)} value={passWord} placeholder='password'/>
      <button onClick={login}>Login</button>
    </div>
    <h1>Status : {loginStatus}</h1>
    </div>
  )
}

export default LoginMysql