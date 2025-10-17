import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VideoIntro from "./pages/VideoIntro";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import StartCheckoutPage from "./pages/StartCheckoutPage";
import PostPaymentInfo from "./pages/PostPaymentInfo";
import FeaturesPage from "./pages/FeaturesPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RegistrationSuccess from "./pages/RegistrationSuccess"; // Import the new page
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<VideoIntro />} />
            <Route path="/landing" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/start-checkout" element={<StartCheckoutPage />} />
            <Route path="/post-payment-info" element={<PostPaymentInfo />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} /> {/* Add the new route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Elements>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;