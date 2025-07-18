
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Users, Mail, Lock, Pill, Activity, Heart } from 'lucide-react';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'patient' | 'caregiver'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp, signIn, user, userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    console.log('Auth check - user:', !!user, 'profile:', !!userProfile, 'authLoading:', authLoading);
    if (user && userProfile && !authLoading) {
      console.log('User authenticated, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, userProfile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        console.log('Attempting signup');
        const { error } = await signUp(email, password, { role, full_name: fullName });
        if (error) {
          console.error('Signup error:', error);
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your registration.",
            duration: 5000
          });
        }
      } else {
        console.log('Attempting signin');
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Signin error:', error);
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          console.log('Signin request successful, waiting for auth state change...');
          toast({
            title: "Signing in...",
            description: "Please wait while we sign you in.",
            duration: 2000
          });
          // Don't set loading to false here - let the auth state change handle it
          return;
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-ojas-mist-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ojas-slate-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-mist-white flex">
      {/* Left Column - Welcoming Content */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
        <div className="max-w-lg">
          {/* Main Headline */}
          <h1 className="text-5xl xl:text-6xl font-bold text-ojas-charcoal-gray mb-6 leading-tight">
            Your partner in wellness.
          </h1>
          
          {/* Sub-headline */}
          <p className="text-xl text-ojas-slate-gray mb-12 leading-relaxed">
            A calmer, more organized day starts here. Log in to track your journey and feel supported.
          </p>
          
          {/* Feature Highlights */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-ojas-primary-blue/10 rounded-xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-ojas-primary-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-2">Smart Reminders</h3>
                <p className="text-ojas-slate-gray">Stay on track with intelligent medication reminders.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-ojas-calming-green/10 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-ojas-calming-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-2">Symptom Insights</h3>
                <p className="text-ojas-slate-gray">Easily log symptoms to understand your health patterns.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-ojas-vibrant-coral/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-ojas-vibrant-coral" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-2">Wellness Score</h3>
                <p className="text-ojas-slate-gray">See your daily progress with the simple Wellness Ring.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-md w-full">
          {/* Mobile - Welcoming Content Above Form */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-ojas-charcoal-gray mb-4">
              Your partner in wellness.
            </h1>
            <p className="text-lg text-ojas-slate-gray mb-6">
              A calmer, more organized day starts here. Log in to track your journey and feel supported.
            </p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-ojas-charcoal-gray mb-4">
              Welcome to Ojas
            </h2>
            <p className="text-lg text-ojas-slate-gray">
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-ojas-medium p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-ojas-charcoal-gray mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ojas-charcoal-gray mb-2">
                      I am a...
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          role === 'patient'
                            ? 'border-ojas-primary-blue bg-ojas-primary-blue/10'
                            : 'border-ojas-cloud-silver hover:border-ojas-slate-gray'
                        }`}
                      >
                        <User className={`w-6 h-6 mx-auto mb-2 ${
                          role === 'patient' ? 'text-ojas-primary-blue' : 'text-ojas-slate-gray'
                        }`} />
                        <span className={`text-sm font-medium ${
                          role === 'patient' ? 'text-ojas-primary-blue' : 'text-ojas-slate-gray'
                        }`}>
                          Patient
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('caregiver')}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          role === 'caregiver'
                            ? 'border-ojas-calming-green bg-ojas-calming-green/10'
                            : 'border-ojas-cloud-silver hover:border-ojas-slate-gray'
                        }`}
                      >
                        <Users className={`w-6 h-6 mx-auto mb-2 ${
                          role === 'caregiver' ? 'text-ojas-calming-green' : 'text-ojas-slate-gray'
                        }`} />
                        <span className={`text-sm font-medium ${
                          role === 'caregiver' ? 'text-ojas-calming-green' : 'text-ojas-slate-gray'
                        }`}>
                          Caregiver
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-ojas-charcoal-gray mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ojas-slate-gray w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ojas-charcoal-gray mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ojas-slate-gray w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ojas-slate-gray hover:text-ojas-charcoal-gray"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || authLoading}
                className="w-full px-8 py-4 bg-ojas-primary-blue text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-primary-blue-hover active:scale-95 shadow-ojas-medium disabled:opacity-50"
              >
                {loading || authLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-ojas-primary-blue hover:underline font-medium"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
