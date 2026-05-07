import { useChat } from "../context/ChatContext";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, selectedGroup } = useChat();

  return (
    <div className="app-shell flex h-[100dvh] w-full overflow-hidden bg-primary/50 transition-colors duration-700">
      
      {/* Sidebar Area */}
      <div className={`
        ${selectedUser || selectedGroup ? "hidden lg:flex" : "flex w-full lg:w-auto"} 
        h-full shrink-0 transition-all duration-500
      `}>
         <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className={`
        ${!selectedUser && !selectedGroup ? "hidden lg:flex" : "flex"} 
        relative h-full min-w-0 flex-1 overflow-hidden transition-all duration-500
      `}>
        {!selectedUser && !selectedGroup ? (
          <NoChatSelected />
        ) : (
          <ChatContainer />
        )}
      </main>

    </div>
  );
};

export default HomePage;
