import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VideoIntro from "./pages/VideoIntro";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import PaymentPage from "./pages/PaymentPage";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'; // Correct import

// Get Stripe public key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const queryClient = new QueryClient(); // QueryClient is now correctly defined

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Wrap BrowserRouter with Elements */}
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<VideoIntro />} />
            <Route path="/landing" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Elements>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
