import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CataloguePage } from './CataloguePage';
import { CoursePage } from './CoursePage';
import { mockCourseDetail } from './mockCourseDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CataloguePage />} />
        <Route path="/course/:id" element={<CoursePage course={mockCourseDetail} />} />
      </Routes>
    </Router>
  );
}

export default App;
