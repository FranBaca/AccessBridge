import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, BookOpen, Send, CheckCircle } from 'lucide-react';

const schema = yup.object({
  name: yup.string().required('El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: yup.string().email('Por favor ingresa un email válido').required('El email es requerido'),
  phone: yup.string().required('El número de teléfono es requerido'),
  interest: yup.string().required('Por favor selecciona un área de interés'),
}).required();

type FormData = yup.InferType<typeof schema>;

const InterestForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phoneNumber: data.phone,
          areaOfInterest: data.interest,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.message || 'Ocurrió un error al enviar el formulario.');
        setIsSubmitting(false);
        return;
      }
      setIsSubmitted(true);
      reset();
    } catch (error) {
      setErrorMessage('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Gracias!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Hemos recibido tu interés y nos pondremos en contacto pronto con los detalles de acceso al curso.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="btn-primary"
          >
            Enviar Otra Respuesta
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¿Listo para Comenzar a Aprender?
          </h2>
          <p className="text-lg text-gray-600">
            Cuéntanos sobre ti y te ayudaremos a encontrar el curso perfecto para comenzar tu viaje.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="form-label flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`form-input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Ingresa tu nombre completo"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="form-label flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Dirección de Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Ingresa tu dirección de email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="form-label flex items-center gap-2">
              <User className="w-4 h-4" />
              Número de Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className={`form-input ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Ej: 9 11 1234-5678 o 11 1234-5678"
            />
            <p className="mt-1 text-sm text-gray-500">
              Formato argentino: 9 11 1234-5678 (móvil) o 11 1234-5678 (fijo). No es necesario agregar +54
            </p>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Interest Area */}
          <div>
            <label htmlFor="interest" className="form-label flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Área de Interés
            </label>
            <select
              id="interest"
              {...register('interest')}
              className={`form-input ${errors.interest ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Selecciona un área de interés</option>
              <option value="data-analytics">Análisis de Datos</option>
              <option value="digital-marketing">Marketing Digital</option>
              <option value="project-management">Gestión de Proyectos</option>
              <option value="it-support">Soporte IT</option>
              <option value="web-development">Desarrollo Web</option>
              <option value="cybersecurity">Ciberseguridad</option>
              <option value="cloud-computing">Computación en la Nube</option>
              <option value="other">Otro</option>
            </select>
            {errors.interest && (
              <p className="mt-1 text-sm text-red-600">{errors.interest.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Interés
              </>
            )}
          </button>
          {errorMessage && (
            <p className="mt-2 text-center text-red-600">{errorMessage}</p>
          )}
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Respetamos tu privacidad. Tu información solo se usará para proporcionarte acceso a los cursos.
        </p>
      </div>
    </section>
  );
};

export default InterestForm; 