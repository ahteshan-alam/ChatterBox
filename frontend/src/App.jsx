import Join from "./join/join"
import Chat from "./chats/chat"
import Create from "./create/create"
import Home from "./home/home"
import SignUp from "./authentication/signup/signup"
import LogIn from "./authentication/login/login"
import { Routes,Route } from "react-router"
import ProtectedRoute from "./authentication/protectedRoutes/protectedRoutes"

function App() {
 

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      <Route path="/join" element={<ProtectedRoute><Join  /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><Create  /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/signUp" element={<SignUp/>}/>
      <Route path="/login" element={<LogIn/>}/>
    </Routes>
  )
}

export default App
