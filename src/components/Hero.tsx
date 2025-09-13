import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import ShaderBackground from "./ShaderBackground";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center rounded-full border border-white/50 bg-white/20 px-4 py-2 text-sm text-white mb-8 backdrop-blur-sm">
            <span className="font-medium">Trusted by 500+ companies</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Conversaciones que{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              venden
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Omnicanal, IA y automatizaciones en un solo lugar.
            <br />
            Unifica todas tus conversaciones de clientes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-base px-8 py-6 shadow-brand">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 border-2 border-white/70 text-white hover:bg-white/30 bg-black/30"
            >
              <PlayCircle className="mr-2 h-5 w-5 text-white" />
              <span className="text-white">Watch Demo</span>
            </Button>
          </div>

        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-5" />
    </section>
  );
};

export default Hero;