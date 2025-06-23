import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FacultadList from "./pages/Facultad/FacultadList";
import FacultadForm from "./pages/Facultad/FacultadForm";
import FacultadDetail from "./pages/Facultad/FacultadDetail";
import MateriaList from "./pages/Materia/MateriaList";
import MateriaForm from "./pages/Materia/MateriaForm";
import MateriaDetail from "./pages/Materia/MateriaDetail";
import BibliografiaList from "./pages/Bibliografia/BibliografiaList";
import BibliografiaForm from "./pages/Bibliografia/BibliografiaForm";
import BibliografiaDetail from "./pages/Bibliografia/BibliografiaDetail";
import AutorList from "./pages/Autor/AutorList";
import AutorForm from "./pages/Autor/AutorForm";
import AutorDetail from "./pages/Autor/AutorDetail";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <Router>
      <Layout>
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 bg-gray-50 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/facultad" element={<FacultadList />} />
              <Route path="/facultad/new" element={<FacultadForm />} />
              <Route path="/facultad/:id" element={<FacultadDetail />} />
              <Route path="/materia" element={<MateriaList />} />
              <Route path="/materia/new" element={<MateriaForm />} />
              <Route path="/materia/:id" element={<MateriaDetail />} />
              <Route path="/bibliografia" element={<BibliografiaList />} />
              <Route path="/bibliografia/new" element={<BibliografiaForm />} />
              <Route
                path="/bibliografia/:id"
                element={<BibliografiaDetail />}
              />
              <Route path="/autor" element={<AutorList />} />
              <Route path="/autor/new" element={<AutorForm />} />
              <Route path="/autor/:id" element={<AutorDetail />} />
            </Routes>
          </main>
        </div>
      </Layout>
    </Router>
  );
};

export default App;
