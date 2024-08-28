import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Edit from "./edit";
import { notification } from "antd";
import axiosInstance from "../api/axios";

function EditPetPage() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        console.log("Fetching pet with ID:", id);
        const response = await axiosInstance.get(`/pets/${id}`);
        console.log("Pet data:", response.data);
        setPet(response.data);
      } catch (error) {
        console.error("Error fetching pet:", error);
        setError("Failed to fetch pet information");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleUpdate = async (updatedPet) => {
    try {
      console.log("Updating pet with data:", updatedPet);
      await axiosInstance.put(`/pets/${id}`, updatedPet);
      notification.success({
        message: "Success",
        description: "Pet updated successfully.",
      });
      navigate("/home");
    } catch (error) {
      console.error("Failed to update pet:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update pet information.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/home");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {pet && (
        <Edit
          pet={pet}
          options={[
            { value: "bird", label: "Bird 🐦" },
            { value: "fish", label: "Fish 🐟" },
            { value: "dog", label: "Dog 🐕" },
            { value: "cat", label: "Cat 🐈" },
          ]}
          statusOptions={[
            { value: "available", label: "Available" },
            { value: "adopted", label: "Adopted" },
          ]}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default EditPetPage;
