import React,{useState} from 'react';

function Registration() {
  const [email,setEmail] = useState()
  const [firstname,setFirstname] = useState()
  const [lastname,setLastname] = useState()
  const [password,setPassword] = useState()
  const [confirmpassword,setConfirmpassword] = useState()
  const [error,setError] = useState({flag:false,msg:""})
  const [loading,setLoading] = useState()
  
  function onchangeData(e){
    if(e.target.name === "email"){
      setEmail(e.target.value)
    }else if(e.target.name === "firstname"){
      setFirstname(e.target.value)
    }else if(e.target.name === "lastname"){
      setLastname(e.target.value)
    }else if(e.target.name === "password"){
      setPassword(e.target.value)
    }else if(e.target.name === "confirmpassword"){
      setConfirmpassword(e.target.value)
    }
  }

  async function submit(e){
    e.preventDefault()
    const res = await fetch("http://127.0.0.1:8000/user/r1/",{
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        email:email,
        firstname:firstname,
        lastname:lastname,
        password:password,
        confirmpassword:confirmpassword
      })
    });
    setLoading(true)

    const data = await res.json();
    console.log(data)
    if(!data.status){
      setLoading(false)
      setError({flag:false,msg:"Invalid Email and Password"})

      setTimeout(()=>{
       setError({flag:false,msg:""})
      },2000)
    }else{
      setLoading(false)
      setError({flag:true,msg:"Registration Successfull"});

      setTimeout(()=>{
        setError({flag:false,msg:""})
       },2000)
    }
  }

  return (
    <div className='container p-5'>
      <h1>Register</h1>
      <p className='error'>{error.flag ? <p style={{"color":"green"}}>{error.msg}</p> : <p style={{"color":"red"}}>{error.msg}</p>}</p>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onchangeData}/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Firstname</label>
          <input type="text" name="firstname" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onchangeData}/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label" >Lastname</label>
          <input type="text" name="lastname" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onchangeData}/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" name="password" className="form-control" id="exampleInputPassword1" onChange={onchangeData}/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
          <input type="password" name="confirmpassword" className="form-control" id="exampleInputPassword1" onChange={onchangeData}/>
        </div>
        <button type="submit" onClick={submit} className="btn btn-primary">Register</button>
    </form>
    </div>
  )
}

export default Registration