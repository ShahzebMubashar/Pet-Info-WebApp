import React, { useState, useEffect } from "react";
import { Input, Select, Button, notification } from "antd";

const { Option } = Select;

const Edit = ({ pet, options, statusOptions, onUpdate, onCancel }) => {
  const [editPet, setEditPet] = useState(pet);

  useEffect(() => {
    setEditPet(pet);
  }, [pet]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditPet((prevPet) => ({
      ...prevPet,
      [name]: value,
    }));
  }

  // function handleSelectChange(name, value) {
  //   setEditPet((prevPet) => ({
  //     ...prevPet,
  //     [name]: value,
  //   }));
  // }
  function handleSelectChange(name, value) {
    console.log(`Changing ${name} to:`, value);
    setEditPet((prevPet) => {
      const updatedPet = {
        ...prevPet,
        [name]: value,
      };
      console.log("Updated pet state:", updatedPet);
      return updatedPet;
    });
  }
  const handleUpdate = () => {
    const { name, type, breed, price, status } = editPet;

    // Validation
    if (!name || !type || !breed || !price || !status) {
      notification.error({
        message: "Validation Error",
        description: "Please fill in all fields before updating.",
      });
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 1 || priceValue > 10000) {
      notification.error({
        message: "Validation Error",
        description: "Price must be between 1 and 10,000.",
      });
      return;
    }
    console.log("Sending updated pet to parent:", editPet);
    // Call the onUpdate function passed from the parent component
    onUpdate(editPet);
  };

  return (
    <div
      className="sized-div2"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3>Edit Pet</h3>
      <Input
        placeholder="Name"
        name="name"
        value={editPet.name}
        onChange={handleInputChange}
        style={{ margin: "10px" }}
      />
      <Select
        placeholder="Type"
        value={editPet.type}
        onChange={(value) => handleSelectChange("type", value)}
        style={{ margin: "10px", width: "100%" }}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      <Input
        placeholder="Breed"
        name="breed"
        value={editPet.breed}
        onChange={handleInputChange}
        style={{ margin: "10px" }}
      />
      <Select
        placeholder="Status"
        value={editPet.status}
        onChange={(value) => handleSelectChange("status", value)}
        style={{ margin: "10px", width: "100%" }}
      >
        {statusOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      <Input
        type="number"
        placeholder="Price"
        name="price"
        value={editPet.price}
        onChange={handleInputChange}
        min="1"
        max="10000"
        step="0.01"
        style={{ margin: "10px" }}
      />

      <Button type="primary" onClick={handleUpdate} style={{ margin: "10px" }}>
        Update
      </Button>
      <Button type="default" onClick={onCancel} style={{ margin: "10px" }}>
        Cancel
      </Button>
    </div>
  );
};

export default Edit;
