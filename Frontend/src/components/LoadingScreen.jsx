import { MessageSquare } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const LoadingScreen = () => {
  const { themeColor } = useThemeStore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary/50 backdrop-blur-xl transition-colors duration-700">
      <div className="relative flex items-center justify-center">
        {/* Animated Blob Background */}
        <div 
          className="absolute size-32 animate-[spin_8s_linear_infinite] rounded-[40%] opacity-20 blur-2xl"
          style={{ backgroundColor: themeColor }}
        />
        
        {/* Core Loader Shape */}
        <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-[2.5rem] bg-secondary shadow-2xl transition-all duration-500 ring-4 ring-white/5">
          <div 
            className="absolute inset-0 animate-pulse opacity-10"
            style={{ backgroundColor: themeColor }}
          />
          <MessageSquare 
            size={32} 
            className="relative z-10 animate-bounce" 
            style={{ color: themeColor }}
            fill="currentColor"
          />
          
          {/* Rotating Border Effect */}
          <div 
            className="absolute inset-0 animate-[spin_3s_linear_infinite] border-[6px] border-transparent border-t-current opacity-30"
            style={{ borderTopColor: themeColor }}
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <h2 
          className="text-[11px] font-black uppercase tracking-[0.4em] animate-pulse"
          style={{ color: themeColor }}
        >
          Decoding Stream...
        </h2>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="size-1.5 rounded-full animate-bounce"
              style={{ 
                backgroundColor: themeColor,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
