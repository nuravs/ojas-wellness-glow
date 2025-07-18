import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import useAuth
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// --- This is the new "Protected Route" component ---
// It acts as a guard for your main application.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading: authLoading, userProfile } = useAuth();

  // 1. While we are checking for a user, show a loading screen.
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

  // 2. If checking is done and there's no user, redirect to the login page.
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // 3. If there IS a user but no profile yet, keep showing loading.
  // This is the key fix for your issue.
  if (user && !userProfile) {
     return (
      <div className="min-h-screen bg-ojas-mist-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ojas-slate-gray">Finalizing login...</p>
        </div>
      </div>
    );
  }

  // 4. If the user and profile are fully loaded, show the app.
  return children;
};


const App = () => (
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

export default App;