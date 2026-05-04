import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, selectedGroup } = useChatStore();

  return (
    <div className="h-screen bg-[#050505] overflow-hidden flex flex-col">
      <div className="flex flex-1 h-full max-w-[1600px] mx-auto w-full border-x border-white/5">
        {/* Sidebar - Fixed width */}
        <div className="w-20 lg:w-80 h-full flex-shrink-0">
           <Sidebar />
        </div>

        {/* Main Content - Dynamic width */}
        <main className="flex-1 h-full flex flex-col bg-[#080808] relative">
          {!selectedUser && !selectedGroup ? (
            <NoChatSelected />
          ) : (
            <ChatContainer />
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
