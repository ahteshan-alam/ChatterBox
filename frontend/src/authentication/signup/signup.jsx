import { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './signup.css'
function SignUp() {
    const navigate = useNavigate();
    const [userData,setUserData] = useState({ username: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e)=>{
        setUserData({...userData,[e.target.id]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setIsLoading(true)
        try{
            const res=await axios.post("https://chatterbox-o3zv.onrender.com/signUp",{
                            username: userData.username,
                            email: userData.email,
                            password: userData.password
                       })
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.newUser))
            alert(res.data.message)
            navigate("/", { state: { user:res.data.newUser } })
            
        }
        catch(err){
                  console.error("Signup failed:", err); 
                  
                 
                  if (err.response && err.response.data && err.response.data.message) {
                    alert(err.response.data.message);
                 } else {
                    
                    alert("Signup failed. Please try again.");
                  }
                }
        finally{
            setIsLoading(false)
        }
       

    }
    if(isLoading){
        return (
            <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div className="loader"></div>
          </div>
        )
    }
    return ( 
        <div className="join">
            <div className="join-container">
                <div className="join-header">
                    <h2>ChatterBox</h2>
                </div>
                <form className="join-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username :</label>
                        <input
                            type="text"
                            id="username"
                            value={userData.username}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="room" className="mt-2">Email :</label>
                        <input
                            type="text"
                            id="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="room" className="mt-2">Password :</label>
                        <input
                            type="password"
                            id="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <p> <i> already have account ? </i> <Link to="/login">login</Link></p>
                    <button type="submit">Enter</button>
                </form>
                <div className="join-status">
                    <div className="status-dot"></div>
                    <span className="status-text">Server Online</span>
                </div>
            </div>
        </div>
     );
}

export default SignUp;