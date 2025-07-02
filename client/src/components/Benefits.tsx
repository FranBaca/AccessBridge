import { Clock, DollarSign, Globe, Award, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: Clock,
    title: 'Aprende a Tu Propio Ritmo',
    description: 'Estudia cuando te funcione. Sin horarios rígidos ni fechas límite que te estresen.'
  },
  {
    icon: DollarSign,
    title: 'Acceso 100% Gratuito',
    description: 'Sin costos ocultos, sin suscripciones. Todos los cursos y certificaciones son completamente gratuitos.'
  },
  {
    icon: Globe,
    title: 'Aprende desde Cualquier Lugar',
    description: 'Accede a cursos desde tu teléfono, tablet o computadora. Solo necesitas una conexión a internet.'
  },
  {
    icon: Award,
    title: 'Certificados Reconocidos por la Industria',
    description: 'Obtén certificados de Google y Microsoft que los empleadores valoran y confían.'
  },
  {
    icon: Users,
    title: 'Únete a una Comunidad',
    description: 'Conéctate con otros en el mismo viaje de aprendizaje. Comparte experiencias y apóyate mutuamente.'
  },
  {
    icon: Zap,
    title: 'Habilidades Listas para la Carrera',
    description: 'Aprende habilidades prácticas que tienen alta demanda en el mercado laboral actual.'
  }
];

const Benefits = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¿Por Qué Elegir el Aprendizaje En Línea Gratuito?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre las ventajas de aprender con AccessBridge y cómo puede transformar tu trayectoria profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-8 hover:bg-blue-50 transition-colors duration-300 group"
              >
                <div className="bg-blue-100 p-3 rounded-lg w-fit mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para Transformar Tu Futuro?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Únete a miles de estudiantes que ya han dado el primer paso hacia una mejor carrera con entrenamiento gratuito en habilidades digitales.
            </p>
            <Link to="/courses" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 inline-block">
              Ver Cursos Disponibles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits; 