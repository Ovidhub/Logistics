import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import TrackPage from './pages/TrackPage';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminPage from './pages/SuperAdminPage';
import { useShipments } from './hooks/useShipments';
import { SettingsProvider, useSettings } from './hooks/useSettings';

function DocumentTitle() {
  const { settings } = useSettings();
  useEffect(() => {
    document.title = `${settings.siteName} - ${settings.tagline}`;
  }, [settings.siteName, settings.tagline]);
  return null;
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isSuperAdminLoggedIn, setIsSuperAdminLoggedIn] = useState(false);
  const {
    shipments,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentByTracking,
    updateShipmentStatus,
  } = useShipments();

  return (
    <SettingsProvider>
      <DocumentTitle />
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white">
          <TopBar />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/track"
                element={<TrackPage getShipmentByTracking={getShipmentByTracking} />}
              />
              <Route
                path="/admin"
                element={
                  isAdminLoggedIn ? (
                    <AdminPage
                      shipments={shipments}
                      addShipment={addShipment}
                      updateShipment={updateShipment}
                      deleteShipment={deleteShipment}
                      updateShipmentStatus={updateShipmentStatus}
                      onLogout={() => setIsAdminLoggedIn(false)}
                    />
                  ) : (
                    <Navigate to="/admin/login" replace />
                  )
                }
              />
              <Route
                path="/admin/login"
                element={<AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />}
              />
              <Route
                path="/super-admin"
                element={
                  isSuperAdminLoggedIn ? (
                    <SuperAdminPage onLogout={() => setIsSuperAdminLoggedIn(false)} />
                  ) : (
                    <Navigate to="/super-admin/login" replace />
                  )
                }
              />
              <Route
                path="/super-admin/login"
                element={<SuperAdminLogin onLogin={() => setIsSuperAdminLoggedIn(true)} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </SettingsProvider>
  );
}

export default App;
