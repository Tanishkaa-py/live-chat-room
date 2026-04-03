import { useState } from "react";
import NameEntry from "./components/NameEntry.jsx";
import ChatRoom from "./components/ChatRoom.jsx";

export default function App() {
  const [user, setUser] = useState(null); // { name, room }

  return user ? (
    <ChatRoom user={user} onLeave={() => setUser(null)} />
  ) : (
    <NameEntry onEnter={setUser} />
  );
}
