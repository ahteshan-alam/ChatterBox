import './join.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Join() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", room: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/chat", { state: { formData } });
        console.log("submit request", formData);
    };

    return (
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
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="room" className="mt-2">Room ID:</label>
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
    );
}

export default Join;
