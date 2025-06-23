import { useState } from "react";

interface AutorFormProps {
  onSubmit: (data: {
    nombre: string;
    apellido: string;
    biografia: string;
  }) => void;
  initialData?: { nombre: string; apellido: string; biografia: string };
}

const AutorForm: React.FC<AutorFormProps> = ({ onSubmit, initialData }) => {
  const [nombre, setNombre] = useState(initialData ? initialData.nombre : "");
  const [apellido, setApellido] = useState(
    initialData ? initialData.apellido : ""
  );
  const [biografia, setBiografia] = useState(
    initialData ? initialData.biografia : ""
  );

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (e: HandleSubmitEvent): void => {
    e.preventDefault();
    onSubmit({ nombre, apellido, biografia });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Apellido:</label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Biografía:</label>
        <textarea
          value={biografia}
          onChange={(e) => setBiografia(e.target.value)}
          required
        />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default AutorForm;
