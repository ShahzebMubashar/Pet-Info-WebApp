import React, { useState } from "react";
import { Input, Cascader, Button, notification } from "antd";

function EditPet({ pet, options, onUpdate, onCancel }) {
  const [editPet, setEditPet] = useState(pet);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditPet((prevPet) => ({
      ...prevPet,
      [name]: value,
    }));
  }

  function handleCascaderChange(value) {
    setEditPet((prevPet) => ({
      ...prevPet,
      pettype: value[0],
    }));
  }

  function handleUpdate() {
    const { name, pettype, breed, price } = editPet;

    // Validation
    if (!name || !pettype || !breed || !price) {
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

    onUpdate(editPet);
  }

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
      <Cascader
        placeholder="Type"
        value={[editPet.pettype]}
        options={options}
        onChange={handleCascaderChange}
        style={{ margin: "10px", marginTop: "20px" }}
      />
      <Input
        placeholder="Breed"
        name="breed"
        value={editPet.breed}
        onChange={handleInputChange}
        style={{ margin: "10px", marginTop: "20px" }}
      />
      <Input
        type="number"
        placeholder="Price"
        name="price"
        value={editPet.price}
        onChange={handleInputChange}
        min="1"
        max="10000"
        step="10"
        style={{ margin: "10px", marginTop: "20px" }}
      />
      <Button type="primary" onClick={handleUpdate} style={{ margin: "10px" }}>
        Update
      </Button>
      <Button type="default" onClick={onCancel} style={{ margin: "10px" }}>
        Cancel
      </Button>
    </div>
  );
}

export default EditPet;
