import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CataloguePage } from './CataloguePage';
import { CoursePage } from './CoursePage';
import { mockCourseDetail } from './mockCourseDetail';
import { Header } from './Header';
import { useEffect, useState } from 'react';

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div
        className={`transition-opacity duration-300 ${
          transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
        }`}
        onTransitionEnd={() => {
          if (transitionStage === 'fadeOut') {
            setTransitionStage('fadeIn');
            setDisplayLocation(location);
          }
        }}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<CataloguePage />} />
          <Route path="/course/:id" element={<CoursePage course={mockCourseDetail} />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
