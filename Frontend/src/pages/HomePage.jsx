import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, selectedGroup } = useChatStore();

  return (
    <div className="app-shell flex h-[100dvh] w-full overflow-hidden bg-primary">
      
      {/* Sidebar Area */}
      <div className={`
        ${selectedUser || selectedGroup ? "hidden lg:flex" : "flex w-full lg:w-auto"} 
        h-full shrink-0 border-r border-primary bg-secondary transition-all duration-300
      `}>
         <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className={`
        ${!selectedUser && !selectedGroup ? "hidden lg:flex" : "flex"} 
        relative h-full min-w-0 flex-1 overflow-hidden bg-[#080808] transition-all duration-300
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
