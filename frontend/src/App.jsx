import Join from "./join/join"
import Chat from "./chats/chat"
import Home from "./home/home"
import { Routes,Route } from "react-router"


function App() {
 

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/join" element={<Join  />} />
      <Route path="/chat" element={<Chat />} />

    </Routes>
  )
}

export default App
