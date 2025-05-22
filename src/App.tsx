import { type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import Providers from './components/Providers';
import AppLayout from './components/Layout/AppLayout';
import Home from './pages/Home/Home';
import SavedGraphs from './pages/SavedGraphs/SavedGraphs';
import './styles/global.css';

function App(): ReactNode {
  return (
    <Providers>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<SavedGraphs />} />
          <Route path="/history" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AppLayout>
    </Providers>
  );
}

export default App;
