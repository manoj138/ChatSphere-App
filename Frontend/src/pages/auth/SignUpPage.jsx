import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, MessageSquare, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const { themeColor } = useThemeStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData, navigate);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-primary text-primary font-sans selection:bg-accent selection:text-black relative transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.05] blur-[120px] rounded-full pointer-events-none" style={{ backgroundColor: themeColor }} />

      {/* Back Button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-5 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-secondary hover:text-accent transition-colors font-semibold text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Left Side Visual Section */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-secondary relative overflow-hidden p-12 border-r border-primary transition-colors duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary opacity-20 rounded-full animate-pulse" />
        <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
          <img src="/signup-png.png" alt="SignUp Visual" className="w-full h-auto object-contain drop-shadow-[0_0_80px_rgba(var(--accent-rgb),0.1)]" />
          <div className="text-center space-y-4 mt-12">
             <h2 className="text-5xl font-extrabold tracking-tighter leading-tight text-accent">Join the conversation.</h2>
          </div>
        </div>
      </div>

      {/* Right Side Form Section */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-10 lg:p-20 relative">
        <div className="w-full max-w-sm space-y-8 sm:space-y-10 relative pt-16 lg:pt-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]">
                <MessageSquare className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">ChatSphere.</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter leading-none text-primary">Create account</h1>
              <p className="text-secondary font-medium opacity-70">Set up your profile and start chatting.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  className="peer w-full py-3 bg-transparent border-b-2 border-primary focus:border-accent outline-none transition-all text-lg placeholder-transparent text-primary"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <label className="absolute left-0 -top-3.5 text-secondary text-sm transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-accent peer-focus:text-sm pointer-events-none opacity-50 peer-focus:opacity-100">Username</label>
              </div>
              <div className="relative group">
                <input
                  type="email"
                  className="peer w-full py-3 bg-transparent border-b-2 border-primary focus:border-accent outline-none transition-all text-lg placeholder-transparent text-primary"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <label className="absolute left-0 -top-3.5 text-secondary text-sm transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-accent peer-focus:text-sm pointer-events-none opacity-50 peer-focus:opacity-100">Email Address</label>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="peer w-full py-3 bg-transparent border-b-2 border-primary focus:border-accent outline-none transition-all text-lg placeholder-transparent text-primary"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <label className="absolute left-0 -top-3.5 text-secondary text-sm transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-accent peer-focus:text-sm pointer-events-none opacity-50 peer-focus:opacity-100">Password</label>
                <button
                  type="button"
                  className="absolute right-0 top-3 text-secondary opacity-40 hover:text-accent hover:opacity-100 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full py-4 bg-accent text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:pr-8 active:scale-95 disabled:opacity-50 cursor-pointer"
              disabled={isSigningUp}
            >
              <span className="relative z-10">{isSigningUp ? "Creating..." : "Create account"}</span>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-secondary opacity-60">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:text-accent transition-colors border-b border-primary hover:border-accent">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
