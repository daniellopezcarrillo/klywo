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

const Index = () => {
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const [formType, setFormType] = useState<'demo' | 'free_trial'>('demo');

  const handleFormTrigger = (type: 'demo' | 'free_trial') => {
    setFormType(type);
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
      <Header onFormTrigger={handleFormTrigger} />
      <main>
        <Hero onStartFreeTrial={() => handleFormTrigger('free_trial')} />
        <Features />
        <Integrations />
        <Pricing onStartFreeTrial={() => handleFormTrigger('free_trial')} />
        <Testimonials />
        <FAQ />
        <LeadCapture formType={formType} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
