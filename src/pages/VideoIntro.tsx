import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const VideoIntro = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    sessionStorage.setItem('introPassed', '1');
    navigate('/landing');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://player.cloudinary.com/embed/?cloud_name=dlwujyfc9&public_id=IMG_3270_qhfbe5&profile=videologo&autoplay=true&muted=true&loop=true&controls=false"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover"
          style={{ border: 'none' }}
          title="Klywo Video Intro"
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen bg-black/20">
        <div className="text-center text-white space-y-8">
          {/* Welcome Text */}
          <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in">
            Bienvenido
          </h1>

          {/* Start Button */}
          <button
            onClick={handleStartClick}
            className="group relative overflow-hidden rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-12 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:shadow-white/25 active:scale-95"
          >
            <span className="relative z-10">Inicio</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          {/* Carousel Text */}
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-xl md:text-2xl text-white/90 font-light">  
              Tus chats en un solo lugar
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient for better text visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent z-5" />
    </div>
  );
};

export default VideoIntro;
