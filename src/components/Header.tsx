import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import klywoLogo from "@/assets/logo.png";
import klywoLogoDark from "@/assets/logo_dark.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(klywoLogoDark);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Ajusta este valor según cuándo cambia el fondo a blanco
        setCurrentLogo(klywoLogo);
      } else {
        setCurrentLogo(klywoLogoDark);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Docs", href: "#docs" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={currentLogo} alt="Klywo" className="h-8 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-white transition-all duration-300 hover:text-brand-primary hover:scale-105 animate-fade-in"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild className="text-white transition-colors duration-300">
            <a href="https://app.klywo.com">Sign In</a>
          </Button>
          <Button variant="default" asChild>
            <a href="#demo">Request Demo</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-black transition-all duration-300 hover:text-brand-primary hover:scale-105 animate-fade-in"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="ghost" asChild>
                  <a href="https://app.klywo.com">Sign In</a>
                </Button>
                <Button variant="default" asChild>
                  <a href="#demo">Request Demo</a>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
