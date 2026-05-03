import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen flex bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 sm:p-16 z-10 bg-[#0a0a0a]">
        <div className="w-full max-w-md space-y-10">
          {/* Logo & Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#bef264]/10 border border-[#bef264]/20">
              <MessageSquare className="w-7 h-7 text-[#bef264]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="text-gray-400 text-lg">Experience the next generation of chat.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#bef264] transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-gray-800 rounded-2xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all text-white placeholder-gray-600 shadow-2xl"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Secret Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#bef264] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-4 bg-[#141414] border border-gray-800 rounded-2xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all text-white placeholder-gray-600 shadow-2xl"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#bef264]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#bef264] text-black font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(190,242,100,0.3)] disabled:opacity-50 disabled:grayscale cursor-pointer"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Account"
              )}
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-gray-400">
              New to ChatSphere?{" "}
              <Link to="/signup" className="text-[#bef264] font-bold hover:underline underline-offset-4">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Section */}
      <div className="hidden lg:flex w-[55%] relative bg-[#111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bef264]/20 to-transparent z-10 pointer-events-none" />
        <img 
          src="/login-png.png" 
          alt="Visual Representation" 
          className="w-full h-full object-cover opacity-80 mix-blend-screen scale-110 hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute bottom-20 left-20 z-20 max-w-md space-y-4">
            <div className="h-1 w-20 bg-[#bef264] rounded-full" />
            <h2 className="text-5xl font-black leading-tight">Connect Beyond <br /><span className="text-[#bef264]">Boundaries.</span></h2>
            <p className="text-gray-400 text-xl font-medium">Step into a world where every conversation feels like a masterpiece.</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#bef264]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};
export default LoginPage;
