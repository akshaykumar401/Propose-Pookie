import { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from './pages/Hero';
import { Reasons } from './pages/Reasons';
import { Proposal } from './pages/Proposal';
import { LoadingScreen } from './components/LoadingScreen';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0d0010', color: '#fff', overflowX: 'hidden' }}>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Hero />
      <Reasons />
      <Proposal />
    </div>
  );
};

export default App;