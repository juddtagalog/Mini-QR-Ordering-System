import { Route, Routes } from 'react-router';
import CustomerMenu from './pages/CustomerMenu';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerMenu />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;