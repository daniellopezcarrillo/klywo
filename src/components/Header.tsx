import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import klywoLogo from "@/assets/logo.png";
import klywoLogoDark from "@/assets/logo_dark.png";

interface HeaderProps {
  onFormTrigger: (type: 'demo' | 'free_trial') => void;
}

const Header = ({ onFormTrigger }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(klywoLogoDark);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      setCurrentLogo(window.scrollY > 100 ? klywoLogo : klywoLogoDark);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Inicio", href: "/landing" },
    { name: "Características", href: "/features" },
    { name: "Precios", href: "/landing#pricing" },
    { name: "Documentación", href: "/landing#docs" },
    { name: "Contacto", href: "/landing#contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
        : 'bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30'
    }`}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo con animación suave */}
        <div className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
          <img
            src={currentLogo}
            alt="Klywo"
            className={`h-12 w-auto transition-all duration-300 ${
              isScrolled ? 'h-14' : 'h-12'
            }`}
          />
        </div>

        {/* Navegación Desktop Mejorada */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="relative text-sm font-medium text-gray-900 transition-all duration-300 hover:text-brand-primary hover:scale-105 group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Desktop CTAs Mejorados */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            asChild
            className="text-gray-900 hover:text-brand-primary transition-all duration-300 hover:bg-gray-100"
          >
            <a href="https://app.klywo.com">Iniciar Sesión</a>
          </Button>
          <Button
            variant="default"
            onClick={() => onFormTrigger('free_trial')}
            className="bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Solicitar Demo
          </Button>
        </div>

        {/* Mobile Menu Button Mejorado */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-900" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Mobile Menu Mejorado */}
      {isMenuOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black opacity-70" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-lg overflow-y-auto z-50 h-screen">
            <div className="p-6">
              {/* Botón de cerrar mejorado */}
              <button
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-900" />
              </button>
              
              <nav className="flex flex-col space-y-6 pt-12">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-gray-900 transition-all duration-300 hover:text-brand-primary hover:scale-105 py-2 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex flex-col space-y-4 pt-8 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    asChild
                    className="text-gray-900 hover:text-brand-primary hover:bg-gray-100 transition-all duration-300 w-full"
                  >
                    <a href="https://app.klywo.com">Iniciar Sesión</a>
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => { onFormTrigger('free_trial'); setIsMenuOpen(false); }}
                    className="bg-brand-primary hover:bg-brand-primary-dark text-white transition-all duration-300 hover:shadow-lg w-full"
                  >
                    Solicitar Demo
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
