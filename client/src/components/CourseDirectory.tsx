import { BookOpen, ExternalLink, Lock, Clock, Users } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  provider: 'Google' | 'Microsoft';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  url: string;
  isBlocked: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Google IT Support Professional Certificate',
    description: 'Aprende los fundamentos de soporte técnico de IT. Incluye troubleshooting, redes, sistemas operativos, y seguridad.',
    provider: 'Google',
    duration: '6 meses',
    level: 'Beginner',
    category: 'IT Support',
    url: 'https://www.coursera.org/professional-certificates/google-it-support',
    isBlocked: true
  },
  {
    id: '2',
    title: 'Microsoft Azure Fundamentals (AZ-900)',
    description: 'Obtén una comprensión sólida de los conceptos básicos de la nube y los servicios de Microsoft Azure.',
    provider: 'Microsoft',
    duration: '3 meses',
    level: 'Beginner',
    category: 'Cloud Computing',
    url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/',
    isBlocked: true
  },
  {
    id: '3',
    title: 'Google Data Analytics Professional Certificate',
    description: 'Desarrolla habilidades en análisis de datos, visualización y toma de decisiones basadas en datos.',
    provider: 'Google',
    duration: '6 meses',
    level: 'Beginner',
    category: 'Data Analytics',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    isBlocked: true
  },
  {
    id: '4',
    title: 'Microsoft 365 Fundamentals (MS-900)',
    description: 'Aprende sobre los servicios de Microsoft 365 y las opciones de licenciamiento disponibles.',
    provider: 'Microsoft',
    duration: '2 meses',
    level: 'Beginner',
    category: 'Productivity',
    url: 'https://learn.microsoft.com/en-us/certifications/microsoft-365-fundamentals/',
    isBlocked: true
  },
  {
    id: '5',
    title: 'Google Project Management Professional Certificate',
    description: 'Adquiere habilidades esenciales de gestión de proyectos y metodologías ágiles.',
    provider: 'Google',
    duration: '6 meses',
    level: 'Beginner',
    category: 'Project Management',
    url: 'https://www.coursera.org/professional-certificates/google-project-management',
    isBlocked: true
  },
  {
    id: '6',
    title: 'Microsoft Power Platform Fundamentals (PL-900)',
    description: 'Explora las capacidades de Microsoft Power Platform para automatización y desarrollo de aplicaciones.',
    provider: 'Microsoft',
    duration: '3 meses',
    level: 'Beginner',
    category: 'Low-Code Development',
    url: 'https://learn.microsoft.com/en-us/certifications/power-platform-fundamentals/',
    isBlocked: true
  }
];

const CourseDirectory = () => {
  const handleCourseClick = (course: Course) => {
    if (course.isBlocked) {
      alert('Acceso bloqueado. Tu solicitud está siendo revisada. Te notificaremos cuando tengas acceso.');
    } else {
      window.open(course.url, '_blank');
    }
  };

  const getProviderColor = (provider: string) => {
    return provider === 'Google' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Catálogo de Cursos
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestra colección de cursos certificados de Google y Microsoft. 
            Todos los cursos son gratuitos y están diseñados para principiantes.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              {/* Course Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProviderColor(course.provider)}`}>
                    {course.provider}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.category}</span>
                  </div>
                </div>
              </div>

              {/* Course Actions */}
              <div className="p-6">
                <button
                  onClick={() => handleCourseClick(course)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    course.isBlocked
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                  }`}
                  disabled={course.isBlocked}
                >
                  {course.isBlocked ? (
                    <>
                      <Lock className="w-5 h-5" />
                      Acceso Bloqueado
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      Acceder al Curso
                    </>
                  )}
                </button>
                
                {course.isBlocked && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Tu solicitud está siendo revisada
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona el acceso?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p className="text-gray-700">Completa el formulario de interés</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p className="text-gray-700">Espera la aprobación de tu solicitud</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <p className="text-gray-700">Recibe acceso completo a todos los cursos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDirectory; 