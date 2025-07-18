import Join from "./join/join"
import Chat from "./chats/chat"
import { Routes,Route } from "react-router"


function App() {
 

  return (
    <Routes>
      <Route path="/" element={<Join  />} />
      <Route path="/chat" element={<Chat />} />

    </Routes>
  )
}

export default App
