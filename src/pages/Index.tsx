import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Integrations from "@/components/Integrations";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import LeadCapture from "@/components/LeadCapture";
import Footer from "@/components/Footer";
// import AuthForm from "@/components/AuthForm"; // <--- Removed this import

const Index = () => {
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    // Check if user came from intro
    const introPassed = sessionStorage.getItem('introPassed');
    
    if (introPassed === '1') {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setAnimationsEnabled(true);
      }, 100);
    } else {
      // If accessed directly, enable animations immediately
      setAnimationsEnabled(true);
    }
  }, []);

  return (
    <div className={`min-h-screen bg-background ${animationsEnabled ? 'animate-fade-in' : 'opacity-0'}`}>
      <Header />
      <main>
        <Hero />
        <Features />
        <Integrations />
        <Pricing />
        <Testimonials />
        <FAQ />
        <LeadCapture />
        {/* <AuthForm /> */} {/* <--- Removed AuthForm rendering here */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
