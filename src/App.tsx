import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CataloguePage } from './CataloguePage';
import { CoursePage } from './CoursePage';
import { Header } from './Header';
import { ConfigProvider, useConfig } from './ConfigContext';
import { useEffect, useState } from 'react';
import { theme } from './theme';

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
          <Route path="/course/:id" element={<CoursePage />} />
        </Routes>
      </div>
    </>
  );
}

function AppContent() {
  const { loading, error } = useConfig();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" style={{ borderColor: theme.colors.primary }}></div>
          <p className="mt-4 text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Using fallback config due to error:', error);
  }

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}

export default App;
