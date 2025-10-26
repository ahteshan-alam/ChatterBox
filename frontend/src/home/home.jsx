
import Navbar from "../navbar/navbar";
import "./home.css"
import { useNavigate,useLocation } from "react-router-dom";

function Home() {
    const navigate=useNavigate()
    const location=useLocation()
    const user= location.state?.user || JSON.parse(localStorage.getItem("user"));
    const handleCreateRoom = () => {
        navigate('/create');
      };
    
      const handleJoinRoom = () => {
        navigate('/join');
      };
      
    return ( 
 <div>
    <Navbar name={user.username || "guest"}/>
        <div class="landing">
            
        <div class="landing-container">
           
            <div class="landing-header">
                <h1 class="brand-name">ChatterBox</h1>
                <p class="brand-subtitle">Real-time messaging made simple</p>
                <p class="brand-tagline">Connect instantly, chat seamlessly</p>
            </div>

           
            <div class="action-cards">
                <div class="action-card create-card" onClick={handleCreateRoom}>
                    <div class="card-icon">+</div>
                    <h3 class="card-title">Create Room</h3>
                    <p class="card-description">Start a new chat room and invite others to join your conversation</p>
                </div>

                <div class="action-card join-card" onClick={handleJoinRoom}>
                    <div class="card-icon">→</div>
                    <h3 class="card-title">Join Room</h3>
                    <p class="card-description">Enter an existing room with a room ID and start chatting instantly</p>
                </div>
            </div>

          
            <div class="features">
                <h4 class="features-title">Why Choose ChatterBox?</h4>
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon"></div>
                        <span class="feature-text">Real-time messaging</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon"></div>
                        <span class="feature-text">Real-time audio/video call</span>
                    </div>
                   
                    <div class="feature-item">
                        <div class="feature-icon"></div>
                        <span class="feature-text">Secure & private</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon"></div>
                        <span class="feature-text">Mobile friendly</span>
                    </div>
                    
                </div>
            </div>

           
            <div class="status-indicator">
                <div class="status-dot"></div>
                <span class="status-text">Server online • Ready to connect</span>
            </div>
        </div>
    </div>
    </div>
   
     );
}

export default Home;