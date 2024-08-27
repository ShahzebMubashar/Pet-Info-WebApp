import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Edit from './edit'; // Adjust the import according to your file structure
import axios from 'axios';
import { notification } from 'antd';

function EditPetPage() {
    const { id } = useParams(); // Get the pet ID from the URL
    const [pet, setPet] = useState(null);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/pets/${id}`);
                setPet(response.data);
                // Set options for pet type if needed
                // const typeResponse = await axios.get('/api/pet-types'); // Example endpoint
                // setOptions(typeResponse.data);
            } catch (error) {
                console.error('Error fetching pet:', error);
            }
        };
        fetchPet();
    }, [id]);

    const handleUpdate = async (updatedPet) => {
        try {
            await axios.put(`http://localhost:5000/pets/${id}`, updatedPet);
            notification.success({
                message: "Success",
                description: "Pet updated successfully.",
            });
        } catch (error) {
            console.error('Failed to update pet:', error);
            notification.error({
                message: "Update Failed",
                description: "Failed to update pet information.",
            });
        }
    };

    return (
        <div>
            {pet && (
                <Edit
                    pet={pet}
                    options={options}
                    onUpdate={handleUpdate}
                    onCancel={() => { }}
                />
            )}
        </div>
    );
}

export default EditPetPage;
