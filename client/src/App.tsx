import Header from './components/Header';
import Hero from './components/Hero';
import InterestForm from './components/InterestForm';
import Benefits from './components/Benefits';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="form">
          <InterestForm />
        </section>
        
        <section id="benefits">
          <Benefits />
        </section>
      </main>
      
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
}

export default App;
