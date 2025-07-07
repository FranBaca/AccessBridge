import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import CourseDirectory from '../components/CourseDirectory';
import Footer from '../components/Footer';

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Handle magic link token
      login(token)
        .then(() => {
          // Remove token from URL for security
          window.history.replaceState({}, '', '/courses');
        })
        .catch((error) => {
          console.error('Failed to login with token:', error);
          // Remove token from URL even if login fails
          window.history.replaceState({}, '', '/courses');
        });
    }
  }, [searchParams, login]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <CourseDirectory />
      </main>
      
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
};

export default CoursesPage; 