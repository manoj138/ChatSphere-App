import React, { useState } from 'react'
import useAuthStore from '../../store/useAuthStore';
import BorderAnimatedContainer from '../../components/BorderAnimatedContainer';
import { Lock, Mail, MessageCircleIcon, UserIcon } from 'lucide-react';
import { LoaderIcon } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const LoginPage = () => {
   const [formData, setFormData] = useState({  email: "", password: "" });
    const { login, isLoggingIn } = useAuthStore();
    const submitHandler = (e) => {
      e.preventDefault();
      login(formData)
    }
   return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM CLOUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
                  <p className="text-slate-400">Login to access your account</p>
                </div>
                <form onSubmit={submitHandler} className='space-y-6'>
                 
                  {/* email */}
                  <div>
                    <label className='auth-input-label'>Email</label>
                    <div className='relative mt-2'>
                      <Mail className='auth-input-icon' />
                      <input type='email' className='input' placeholder='Enter Your Email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className='auth-input-label'>Password</label>
                    <div className='relative mt-2'>
                      <Lock className='auth-input-icon' />
                      <input type='password' className='input' placeholder='Enter Your Password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                  </div>
                  {/* submit button */}
                  <button className="auth-btn" type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Signin"
                    )}
                  </button>

                </form>

                <div className="mt-6 text-center">

                  <Link to="/signup" className="auth-link">
                    Don't have an account? Signup here
                  </Link>

                </div>
              </div>
            </div>

            {/* right side image */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login-png.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
               <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">connect anytime, anywhere</h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}

export default LoginPage