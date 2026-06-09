import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from './pages/Hero';
import { Reasons } from './pages/Reasons';
import { Proposal } from './pages/Proposal';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0d0010', color: '#fff', overflowX: 'hidden' }}>
      <Hero />
      <Reasons />
      <Proposal />
    </div>
  );
};

export default App;