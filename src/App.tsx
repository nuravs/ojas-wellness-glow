
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading: authLoading, userProfile, error } = useAuth();

  console.log('🛡️ ProtectedRoute Check:', {
    user: user ? `${user.email} (${user.id})` : 'None',
    userProfile: userProfile ? `${userProfile.full_name} (${userProfile.role})` : 'None',
    authLoading,
    error,
    currentPath: window.location.pathname
  });

  // 1. While we are checking for authentication, show a loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-ojas-mist-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ojas-slate-gray">Loading your health data...</p>
        </div>
      </div>
    );
  }

  // 2. If checking is done and there's no user, redirect to the login page
  if (!user) {
    console.log('🔄 No user found, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // 3. If there IS a user but no profile, allow app to continue with limited functionality
  // (Profile loading issues shouldn't block the entire app)
  if (user && !userProfile) {
    // Only show error for actual errors, not timeouts
    if (error && !error.includes('timeout') && !error.includes('timed out') && !error.includes('limited')) {
      console.log('🔄 Profile error, showing error state:', error);
      return (
        <div className="min-h-screen bg-ojas-mist-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-ojas-slate-gray mb-2">Unable to load your profile</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-ojas-primary-blue text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    // For timeouts or other non-critical errors, allow app to continue
    console.log('✅ User authenticated, allowing app to continue with limited profile');
    return children;
  }

  // 4. If the user and profile are fully loaded, show the app
  console.log('✅ User and profile loaded, showing protected content');
  return children;
};

const App = () => {
  console.log('🚀 App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* The login page is public */}
                <Route path="/auth" element={<AuthPage />} />

                {/* The main app (Index) is now wrapped in our ProtectedRoute */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                
                {/* All other routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
