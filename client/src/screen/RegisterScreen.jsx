import React, { useState ,useEffect} from 'react'
import axios from 'axios'
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from '../components/Success';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
function RegisterScreen() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [success,setSuccess] = useState();
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

   async function register(){
        // Basic client-side validation
        if(!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()){
           Swal.fire({
               icon:'warning',
               title:'Please fill all fields'
           })
            return;
        }
        if(password !== confirmPassword){
           Swal.fire({
               icon:'warning',
               title:'Passwords do not match'
           })
            return;
        }
        const user = {
            name: name.trim(),
            email: email.trim(),
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
  return (
    <div>
        {loading && (<Loader/>)}
        <div className="row justify-content-center mt-5">
            <div className="col-md-5 mt-5">
        {error && (<Error message= 'Something went wrong!'/>)}
            {success && (<Success message= 'Registration successfully'/>)}

                <div className='bs'>
                    <h2>Register</h2>
                    <input type="text" className='form-control' placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)} required/>
                    <input type="text" className='form-control' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                    <input type="text" className='form-control' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}required/>
                    <input type="text" className='form-control' placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required/>
                    <button className='btn btn-primary mt-3 w-100'type='submit' onClick={register}>Register</button>
                    <div className='text-center mt-3'>
                      <small className='text-muted'>Already have an account? </small>
                      <Link to='/login'>Login</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RegisterScreen