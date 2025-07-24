import './join.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Join() {
    const navigate=useNavigate()
    const [username,setUsername]=useState("")
    const [room,setRoom]=useState("")
    const handleSubmit=(e)=>{
        e.preventDefault();
        
            
        navigate('/chat',{state:{username,room}});
    }
    const handleChange=(e)=>{
        
       setUsername(e.target.value)
     
      
       
    }
    const handleChangeroom=(e)=>{
        setRoom(e.target.value)
        console.log(room,username)
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
                             <label htmlFor="room" className='mt-2'>room id: </label>
                            <input 
                                type="text" 
                                name="room" 
                                id="room" 
                                value={room} 
                                onChange={handleChangeroom} 
                                required
                            />
                        </div>
                        
                        <button type="submit">Enter</button>
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
