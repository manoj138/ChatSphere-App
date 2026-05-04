import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, selectedGroup } = useChatStore();

  return (
    <div className="h-full bg-[#050505] flex overflow-hidden">
      
      {/* Sidebar - Hidden on mobile when a chat is selected */}
      <div className={`${selectedUser || selectedGroup ? "hidden lg:flex" : "flex w-full lg:w-auto"} h-full`}>
         <Sidebar />
      </div>

      {/* Main Content Area - Full width on mobile when selected, hidden when not */}
      <main className={`${!selectedUser && !selectedGroup ? "hidden lg:flex" : "flex"} flex-1 h-full bg-[#080808] relative overflow-hidden`}>
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
