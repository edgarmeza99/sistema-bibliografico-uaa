import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMateriaById } from '../../services/materiaService';

const MateriaDetail = () => {
    const { id } = useParams();
    const [materia, setMateria] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMateria = async () => {
            try {
                const data = await getMateriaById(id);
                setMateria(data);
            } catch (error) {
                console.error('Error fetching materia details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMateria();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!materia) {
        return <div>No details found for this materia.</div>;
    }

    return (
        <div>
            <h1>Materia Details</h1>
            <h2>{materia.nombre}</h2>
            <p>{materia.descripcion}</p>
            {/* Add more fields as necessary */}
        </div>
    );
};

export default MateriaDetail;