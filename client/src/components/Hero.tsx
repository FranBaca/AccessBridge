import { GraduationCap, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Hero Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full">
              <GraduationCap className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Desbloquea Tu Futuro con
            <span className="text-blue-600 block">Habilidades Digitales Gratuitas</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Accede a cursos certificados en línea de Google y Microsoft. 
            Transforma tu carrera con habilidades profesionales que importan en el mundo digital de hoy.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary flex items-center gap-2 group">
              Comienza Tu Viaje
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary">
              Saber Más
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cursos Certificados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No Se Requiere Experiencia</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20"></div>
    </section>
  );
};

export default Hero; 