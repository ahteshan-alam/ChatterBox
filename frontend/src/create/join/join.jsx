import './join.css';
import { useNavigate,useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';


function Create() {
    const navigate = useNavigate();
    const location=useLocation()
    const user= location.state?.user || JSON.parse(localStorage.getItem("user"));
    const [formData, setFormData] = useState({ username: "", room: "" });



   const handleChange=(e)=>{
    setFormData({room:e.target.value})
   }

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/chat", { state: { formData } });
        console.log("submit request", formData);
    };
   
    

    return (
        <div><Navbar name={user.username}/>
        <div className="join">
            
            <div className="join-container">
                <div className="join-header">
                    <h2>ChatterBox</h2>
                </div>
                <form className="join-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username:</label>
                        <input
                        type="text"
                        id="username"
                        value={formData.username}
                        readOnly
                         />

                        <label htmlFor="username">RoomId:</label>
                        <input
                        type="text"
                        id="room"
                        value={formData.room}
                        onChange={handleChange}
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
        </div>
    );
}

export default Create;
