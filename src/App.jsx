import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/home';
import About from './pages/about';
import Services from './pages/services';
import Contact from './pages/contact';

const Photography = lazy(() => import('./pages/photography'));
const Email = lazy(() => import('./pages/email'));

function Page({ children }) {
  return <div className="page-fade">{children}</div>;
}

function LoadingPage() {
  return (
    <main className="page-hero">
      <div className="container">
        <p className="eyebrow">Loading</p>
        <h1 className="title">Preparing the next surface.</h1>
      </div>
    </main>
  );
}

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Page><Home /></Page>} />
      <Route path="/about" element={<Page><About /></Page>} />
      <Route path="/services" element={<Page><Services /></Page>} />
      <Route path="/contact" element={<Page><Contact /></Page>} />
      <Route path="/photography" element={<Page><Suspense fallback={<LoadingPage />}><Photography /></Suspense></Page>} />
      <Route path="/email" element={<Page><Suspense fallback={<LoadingPage />}><Email /></Suspense></Page>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navigation />
        <div className="site-main">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
