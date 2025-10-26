import './create.css';
import { useNavigate,useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';
import { FiCopy } from "react-icons/fi";

function Create() {
    const navigate = useNavigate();
    const location=useLocation()
    const user= location.state?.user || JSON.parse(localStorage.getItem("user"));
    const [formData, setFormData] = useState({ username: "", room: "" });
    const [copied, setCopied] = useState(false);


   

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/chat", { state: { formData } });
        console.log("submit request", formData);
    };
   
    
    useEffect(()=>{

        const generateRoomId=()=>{
            const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
           let roomId='';
            for(let i=0;i<8;i++){
                const randomIndex = Math.floor(Math.random() * characters.length);
                roomId += characters[randomIndex];

            }
            setFormData({username:user.username,room:roomId})
        }

        generateRoomId();

    },[])
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

                       <div style={{width:"100%"}}>
                       <label htmlFor="room" className="mt-2" style={{display:"block",marginBottom:"5px"}}>Room ID:     </label>
                        <div className="room-id-container">
                        <input
                            type="text"
                            id="room"
                            value={formData.room}
                            readOnly
                        />
                        <FiCopy
                            className="copy-icon"
                            onClick={() => {
                            navigator.clipboard.writeText(formData.room);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                            }}
                        />
                        </div>
                        {copied && <span className="copy-message">Copied!</span>}
                       </div>
                      

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
