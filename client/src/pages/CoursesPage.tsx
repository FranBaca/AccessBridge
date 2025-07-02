import Header from '../components/Header';
import CourseDirectory from '../components/CourseDirectory';
import Footer from '../components/Footer';

const CoursesPage = () => {
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