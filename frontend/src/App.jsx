import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const Skills = React.lazy(() => import('./pages/Skills'));
const About = React.lazy(() => import('./pages/About'));
const ApiDocs = React.lazy(() => import('./pages/ApiDocs'));

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/about" element={<About />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="*" element={<div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
            <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
          </div>} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;