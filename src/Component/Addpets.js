import React, { useState } from "react";
import { Button, Input, Cascader, notification } from "antd";
import { useNavigate } from "react-router-dom";

export default function AddPet({ onSubmit, options }) {
  const [formData, setFormData] = useState({
    name: "",
    pettype: "",
    breed: "",
    price: "",
    quantity: "",  // Add quantity to the form data state
  });

  const navigate = useNavigate();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleCascaderChange(value) {
    setFormData((prevData) => ({
      ...prevData,
      pettype: value[0],
    }));
  }

  function handleSubmit() {
    const { name, pettype, breed, price, quantity } = formData;

    // Validation
    if (!name || !pettype || !breed || !price || !quantity) {
      notification.error({
        message: "Validation Error",
        description: "Please fill in all fields before submitting.",
      });
      return;
    }

    // Price validation
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 1 || priceValue > 10000) {
      notification.error({
        message: "Validation Error",
        description: "Price must be between 1 and 10,000.",
      });
      return;
    }

    // Quantity validation
    const quantityValue = parseInt(quantity, 10);
    if (isNaN(quantityValue) || quantityValue < 1) {
      notification.error({
        message: "Validation Error",
        description: "Quantity must be a positive integer.",
      });
      return;
    }

    onSubmit(formData);
    setFormData({ name: "", pettype: "", breed: "", price: "", quantity: "" });
    navigate("/home");
  }

  return (
    <div>
      <div style={{ paddingLeft: "480px", paddingTop: "50px" }}>
        <div className="sized-div">
          <h1
            style={{ marginLeft: "40px", textAlign: "center", color: "black" }}
          >
            Enter Details
          </h1>
          <Input
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{ margin: "10px" }}
          />
          <Cascader
            placeholder="Type"
            options={options}
            onChange={handleCascaderChange}
            style={{ margin: "10px", marginLeft: "30px", marginTop: "20px" }}
          />
          <Input
            placeholder="Breed"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
            style={{ margin: "10px", marginTop: "20px" }}
          />
          <Input
            type="number"
            placeholder="Price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="1"
            max="10000"
            step="10"
            style={{ margin: "10px", marginTop: "20px" }}
          />
          <Input
            type="number"
            placeholder="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            step="1"
            style={{ margin: "10px", marginTop: "20px" }}
          />
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            style={{
              position: "relative",
              marginLeft: "30px",
              marginTop: "40px",
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
