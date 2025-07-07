import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Lock, Clock, Users, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  provider: 'Google' | 'Microsoft';
  duration: string;
  level: string;
  category: string;
  url: string;
  isBlocked: boolean;
}

interface CourseResponse {
  success: boolean;
  data: Course[];
  count: number;
  userInterest?: string;
  unlockedCourses?: string[];
}

const CourseDirectory = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInterest, setUserInterest] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('No se pudo cargar los cursos');
        }
        
        const data: CourseResponse = await response.json();
        setCourses(data.data);
        setUserInterest(data.userInterest || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (course: Course) => {
    if (course.isBlocked) {
      alert('Este curso no está disponible para tu área de interés. Contacta con el administrador para solicitar acceso.');
    } else {
      window.open(course.url, '_blank');
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Google': return 'bg-red-100 text-red-800';
      case 'Microsoft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </section>
    );
  }

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
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Explora nuestra colección de cursos certificados de Google y Microsoft. 
            Todos los cursos son gratuitos y están diseñados para principiantes.
          </p>

          {userInterest && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Tu área de interés:</span>
              </div>
              <p className="text-green-700 capitalize">{userInterest.replace('-', ' ')}</p>
              <p className="text-sm text-green-600 mt-1">
                Los cursos relacionados con tu interés están desbloqueados para ti.
              </p>
            </div>
          )}
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
                      : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                  }`}
                  disabled={course.isBlocked}
                >
                  {course.isBlocked ? (
                    <>
                      <Lock className="w-5 h-5" />
                      No Disponible
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
                    No disponible para tu área de interés
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
                <p className="text-gray-700">Accede a cursos relacionados con tu interés</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Nota:</strong> Los cursos disponibles se basan en tu área de interés seleccionada. 
                Si necesitas acceso a otros cursos, contacta con el administrador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDirectory; 