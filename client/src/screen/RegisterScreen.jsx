import React, { useState ,useEffect} from 'react'
import axios from 'axios'
function RegisterScreen() {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

   async function register(){
        if(password == confirmPassword){
            const user = {
                name,
                email,
                password,
            }
            try {
                const result = await axios.post('/api/users/register',user)
            } catch (error) {
                console.log(error)
            }
            console.log(user)
        }
        else{
            alert("password not matched")
        }
    }
  return (
    <div>
        <div className="row justify-content-center mt-5">
            <div className="col-md-5 mt-5">
                <div className='bs'>
                    <h2>Register</h2>
                    <input type="text" className='form-control' placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}/>
                    <input type="text" className='form-control' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <input type="text" className='form-control' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <input type="text" className='form-control' placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    <button className='btn btn-primary mt-3' onClick={register}>Register</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RegisterScreen