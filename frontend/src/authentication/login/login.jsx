import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./login.css"
function LogIn() {
    const navigate = useNavigate();
    const [userData,setUserData] = useState({ username: "", password: "" });
   
    const handleChange = (e)=>{
        setUserData({...userData,[e.target.id]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const res=await axios.post("https://chatterbox-o3zv.onrender.com/logIn",{
                username:e.target.username.value,
                password:e.target.password.value
            })
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user))
            alert(res.data.message)
            
           
            navigate("/", { state: { user:res.data.user } })
           
        }
        catch(err){
            if(err.response)
            alert(err.response.data.message,err)
           
            else
            alert("something went wrong")
        }
       

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
                        
                        <label htmlFor="room" className="mt-2">Password :</label>
                        <input
                            type="password"
                            id="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <p> <i>don't have account ? </i> <a href="https://chatterbox-o3zv.onrender.com/signUp">create</a></p>
                    <button type="submit">LogIn</button>
                </form>
                <div className="join-status">
                    <div className="status-dot"></div>
                    <span className="status-text">Server Online</span>
                </div>
            </div>
        </div>
     );
}

export default LogIn;