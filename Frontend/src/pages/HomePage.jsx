import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, selectedGroup } = useChatStore();

  return (
    <div className="h-full bg-[#050505] flex overflow-hidden">
      
      {/* Sidebar Area */}
      <div className="w-20 lg:w-80 h-full flex-shrink-0">
         <Sidebar />
      </div>

      {/* Main Chat Interface */}
      <main className="flex-1 h-full bg-[#080808] relative">
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
