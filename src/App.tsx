import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LegislasiPage } from './pages/LegislasiPage';
import { BillDetailPage } from './pages/BillDetailPage';
import { AnggotaPage } from './pages/AnggotaPage';
import { MemberDetailPage } from './pages/MemberDetailPage';
import { SidangPage } from './pages/SidangPage';
import { AkdPage } from './pages/AkdPage';
import { PartisipasiPage } from './pages/PartisipasiPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/legislasi" element={<LegislasiPage />} />
          <Route path="/legislasi/:id" element={<BillDetailPage />} />
          <Route path="/anggota" element={<AnggotaPage />} />
          <Route path="/anggota/:id" element={<MemberDetailPage />} />
          <Route path="/sidang" element={<SidangPage />} />
          <Route path="/akd" element={<AkdPage />} />
          <Route path="/partisipasi" element={<PartisipasiPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
