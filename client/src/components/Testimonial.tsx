import { Quote } from 'lucide-react';

const Testimonial = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Historias de Éxito
          </h2>
          <p className="text-lg text-gray-600">
            Escucha de personas que transformaron sus vidas a través de la educación digital gratuita.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
            </div>

            {/* Quote Content */}
            <div className="flex-1">
              <div className="mb-6">
                <Quote className="w-8 h-8 text-blue-400 mb-4" />
                <blockquote className="text-xl text-gray-700 leading-relaxed italic">
                  "Estaba trabajando dos empleos solo para llegar a fin de mes, y pensé que aprender nuevas habilidades era imposible. 
                  Entonces encontré AccessBridge y todo cambió. Completé el curso de Análisis de Datos de Google 
                  y en tres meses, conseguí un trabajo que paga el doble de lo que ganaba antes. 
                  Este programa literalmente cambió mi vida."
                </blockquote>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">María Rodríguez</p>
                <p className="text-gray-600">Analista de Datos en TechCorp</p>
                <p className="text-sm text-gray-500 mt-1">Ex trabajadora minorista, ahora gana $65,000/año</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
            <p className="text-gray-600">Personas inscritas en cursos</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
            <p className="text-gray-600">Tasa de finalización de cursos</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$12M+</div>
            <p className="text-gray-600">Incremento total de salarios para graduados</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial; 