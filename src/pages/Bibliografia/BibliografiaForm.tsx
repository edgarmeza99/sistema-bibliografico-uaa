import { useState } from "react";

const BibliografiaForm = () => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anio, setAnio] = useState("");
  const [editorial, setEditorial] = useState("");

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}
  const handleSubmit = (e: HandleSubmitEvent): void => {
    e.preventDefault();
    // Aquí se puede agregar la lógica para enviar los datos a la API
    console.log({ titulo, autor, anio, editorial });
  };

  return (
    <div>
      <h2>Formulario de Bibliografía</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Autor:</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Año:</label>
          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Editorial:</label>
          <input
            type="text"
            value={editorial}
            onChange={(e) => setEditorial(e.target.value)}
            required
          />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default BibliografiaForm;
