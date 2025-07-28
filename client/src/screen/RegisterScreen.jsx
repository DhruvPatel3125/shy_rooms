import React, { useState ,useEffect} from 'react'
import axios from 'axios'
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from '../components/Success';
function RegisterScreen() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [success,setSuccess] = useState();
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

                setLoading(true);
                const result = await axios.post('/api/users/register',user)
                setLoading(false)
                setSuccess(true)
                setName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                window.location.href = '/login'

            } catch (error) {
                console.log(error)
                setLoading(false)
                setError(true)
            }
            console.log(user)
        }
        else{
            alert("password not matched")
        }
    }
  return (
    <div>
        {loading && (<Loader/>)}
        {error && (<Error/>)}
        <div className="row justify-content-center mt-5">
            <div className="col-md-5 mt-5">
            {success && (<Success message= 'Registration successfully'/>)}

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