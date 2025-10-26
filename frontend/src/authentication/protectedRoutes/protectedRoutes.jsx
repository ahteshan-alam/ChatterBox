import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


function ProtectedRoute({children}){
    const [isAuthenticated,setIsAuthenticated]=useState(null)
    useEffect(()=>{
        const checkAuth=async()=>{
            const token=localStorage.getItem("token")
            if(!token){
                setIsAuthenticated(false)
                alert("token not found")
                return;
            }
            try{
               await axios.get("https://chatterbox-o3zv.onrender.com/verify", {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setIsAuthenticated(true)
            }catch(error){
                localStorage.removeItem("token");
                setIsAuthenticated(false)
                alert(error.response.data.message,error)
                console.log(error.response.data.message,error)
                
            }
        }
        checkAuth()
    
    },[])

    if(isAuthenticated===null){
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
          );
    }
        
    return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute

   