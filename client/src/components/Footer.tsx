import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">AccessBridge</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Conectando comunidades desatendidas con oportunidades de educación digital gratuita. 
              Empoderando a individuos para construir mejores futuros a través del aprendizaje accesible.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Cursos Disponibles
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Historias de Éxito
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Cómo Funciona
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@accessbridge.org" className="text-gray-300 hover:text-white transition-colors">
                  info@accessbridge.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href="tel:+1-555-123-4567" className="text-gray-300 hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-1" />
                <span className="text-gray-300">
                  123 Calle Educación<br />
                  Ciudad del Aprendizaje, LC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AccessBridge. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Accesibilidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 