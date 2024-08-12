import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Course from './Course';

import AddCourse from './AddCourse';
import UpdateCourse from './UpdateCourse';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Course />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/update-course/:courseId" element={<UpdateCourse />} /> 
        
        
      </Routes>
    </Router>
  );
}

export default App;
