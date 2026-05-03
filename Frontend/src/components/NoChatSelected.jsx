import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[#050505]">
      <div className="max-w-md text-center space-y-8">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-3xl bg-[#bef264]/5 flex items-center
             justify-center animate-bounce border border-[#bef264]/10"
            >
              <MessageSquare className="w-10 h-10 text-[#bef264]" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Welcome to <span className="text-[#bef264]">ChatSphere.</span></h2>
          <p className="text-gray-500 font-medium text-lg">
            Connect with your network. Select a contact from the sidebar to start a secure conversation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
