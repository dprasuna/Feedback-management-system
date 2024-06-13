import { Route, Routes, BrowserRouter } from 'react-router-dom'
import ProtectedRoute from "./components/ProtectedRoute";

//pages
import RegisterAdmin from "./pages/RegisterAdmin";
import Dashboard from "./pages/Dashboard";
import LoginAdmin from "./pages/LoginAdmin";
import Questions from "./pages/Questions";
import Home from "./pages/Home";
import NotFound from './pages/NotFound';
import Form from './pages/Form';
import ClientForm from './pages/ClientForm';
import Responses from './pages/Responses';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/form/:id" element={<Form />} />
            <Route path="/dashboard/form/addQues/:id" element={<Questions />} />
            <Route path="/dashboard/form/responses/:id" element={<Responses />} />
            <Route path="/newform" element={<Questions />} />
          </Route>
          <Route path='/form/:id' element={<ClientForm />} />
          <Route path="/registerAdmin" element={<RegisterAdmin />} />
          <Route path="/loginAdmin" element={<LoginAdmin />} />
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
