
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import VitalsPage from "./pages/VitalsPage";
import SymptomsPage from "./pages/SymptomsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading: authLoading, userProfile, error } = useAuth();

  console.log('🛡️ ProtectedRoute Check:', {
    user: user ? `${user.email} (${user.id})` : 'None',
    userProfile: userProfile ? `${userProfile.full_name} (${userProfile.role})` : 'None',
    authLoading,
    error,
    currentPath: window.location.pathname
  });

  // While checking for authentication, show a simple loading screen
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

  // If checking is done and there's no user, redirect to the login page
  if (!user) {
    console.log('🔄 No user found, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated - allow app to continue
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

                {/* All main app routes go through Index with internal routing */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />

                {/* Dedicated routes for key pages */}
                <Route
                  path="/vitals"
                  element={
                    <ProtectedRoute>
                      <VitalsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/symptoms"
                  element={
                    <ProtectedRoute>
                      <SymptomsPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Catch-all for unknown routes */}
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
