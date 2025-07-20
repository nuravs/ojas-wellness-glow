
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

  // 1. While checking for authentication, show a simple loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-ojas-mist-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ojas-slate-gray">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 2. If checking is done and there's no user, redirect to the login page
  if (!user) {
    console.log('🔄 No user found, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // 3. User is authenticated - allow app to continue
  console.log('✅ User authenticated, allowing app access');
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
