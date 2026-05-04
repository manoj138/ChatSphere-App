import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, selectedGroup } = useChatStore();

  return (
    <div className="h-full bg-[#050505] flex overflow-hidden">
      
      {/* Sidebar - Controlled by its own internal width */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 h-full bg-[#080808] relative overflow-hidden">
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
