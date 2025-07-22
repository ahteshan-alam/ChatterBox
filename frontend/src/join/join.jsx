import './join.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Join() {
    const navigate=useNavigate()
    const [username,setUsername]=useState("")
    const handleSubmit=(e)=>{
        e.preventDefault();
        
            
        navigate('/chat',{state:{username}});
    }
    const handleChange=(e)=>{
        
       setUsername(e.target.value)
     
      
       
    }
    return ( 
    <>
   <div className="join">
                <div className="join-container">
                    <div className="join-header">
                        <h2>ChatterBox</h2>
                    </div>
                    <form className="join-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">username: </label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                value={username} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        <button type="submit">enter</button>
                    </form>
                    <div className="join-status">
                        <div className="status-dot"></div>
                        <span className="status-text">Server Online</span>
                    </div>
                </div>
            </div>
    </> 
    );
}

export default Join;
