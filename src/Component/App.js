import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Button, Card, Col, Row, Space, Divider, notification, Input, Select } from "antd";
import axios from "axios";
import "./App.css";

import {
  getTokens,
  removeToken,
  isUserLoggedIn,
  getCurrentUserRole,
  getCurrentUserToken,
} from "../TokenManagement/tokenUtils";

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Option } = Select;

function App({ PetsData, setPetsData }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showOutOfStock, setShowOutOfStock] = useState(false); // State for showing "Out of Stock" message
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn() || getCurrentUserRole() !== "customer") {
      navigate("/");
    } else {
      fetchAllPets();
    }
  }, [navigate]);

  const fetchAllPets = async () => {
    try {
      const token = getCurrentUserToken(); // Ensure you have this function
      const response = await axios.get("http://localhost:5000/pets", {
        headers: { "auth-token": token },
      });
      setPets(response.data);
      setFilteredPets(response.data); // Initialize filteredPets with fetched data
      setPetsData(response.data); // Update the PetsData state with fetched data
      setShowOutOfStock(response.data.length === 0); // Check if pets data is empty
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    const filtered = value === "all" ? pets : pets.filter((pet) => pet.type === value);
    setFilteredPets(filtered);
    setShowOutOfStock(filtered.length === 0); // Update out of stock state
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filteredBySearch = pets.filter((pet) =>
      pet.name.toLowerCase().includes(value.toLowerCase())
    );
    const filtered = selectedType === "all" ? filteredBySearch : filteredBySearch.filter((pet) => pet.type === selectedType);
    setFilteredPets(filtered);
    setShowOutOfStock(filtered.length === 0); // Update out of stock state
  };

  function navigateFunc() {
    navigate("/Add");
  }

  function handleDeleteClick(petId) {
    setPetToDelete(petId);
    setShowConfirm(true);
  }

  async function handleConfirmDelete() {
    try {
      await axios.delete(`http://localhost:5000/pets/${petToDelete}`, {
        headers: { "auth-token": getCurrentUserToken() },
      });
      setPets((prevData) => prevData.filter((pet) => pet._id !== petToDelete));
      setFilteredPets((prevData) => prevData.filter((pet) => pet._id !== petToDelete));
      setPetsData((prevData) => prevData.filter((pet) => pet._id !== petToDelete));
      notification.success({
        message: "Success",
        description: "Pet deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete pet:", error);
      notification.error({
        message: "Deletion Failed",
        description: "Failed to delete pet information.",
      });
    } finally {
      setShowConfirm(false);
      setPetToDelete(null);
    }
  }

  function handleCancelDelete() {
    setShowConfirm(false);
    setPetToDelete(null);
  }

  function handleSignOut() {
    const tokens = getTokens();
    const customerId = Object.keys(tokens).find(
      (id) => tokens[id].role === "customer"
    );
    if (customerId) {
      removeToken(customerId);
    }
    navigate("/");
  }

  async function handleAdopt(petId) {
    try {
      const response = await axios.patch(
        `/pets/adopt/${petId}`,
        null,
        {
          headers: { "auth-token": getCurrentUserToken() },
        }
      );
      setPets((prevData) =>
        prevData.map((pet) =>
          pet._id === petId ? { ...pet, status: "adopted" } : pet
        )
      );
      setFilteredPets((prevData) =>
        prevData.map((pet) =>
          pet._id === petId ? { ...pet, status: "adopted" } : pet
        )
      );
      notification.success({
        message: "Success",
        description: "Pet adopted successfully.",
      });
    } catch (error) {
      console.error("Failed to adopt pet:", error.response ? error.response.data : error.message);
      notification.error({
        message: "Adoption Failed",
        description: "Failed to adopt pet.",
      });
    }
  }

  const petImages = {
    Cat: "https://cdn.vectorstock.com/i/500p/67/08/cat-full-black-silhouette-vector-51516708.jpg",
    Dog: "https://t4.ftcdn.net/jpg/04/37/04/67/360_F_437046701_q9t3W43b6y4nBn7710uH3mwEegUiMLA3.jpg",
    Fish: "https://img.freepik.com/premium-vector/black-white-vector-fish-logo_567294-6334.jpg",
    Bird: "https://www.thepixelfreak.co.uk/wp-content/uploads/2018/07/Alternate-Dove-Logo.png",
  };

  const petCards = filteredPets.map((pet) => (
    <Col span={6} key={pet._id}>
      <Card
        title={pet.name}
        style={{
          margin: "10px",
          marginTop: "20px",
          backgroundImage: `url(${petImages[pet.type]})`,
          backgroundSize: "70% 70%",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
        actions={[
          <Button
            type="primary"
            onClick={() => handleAdopt(pet._id)}
            disabled={pet.status === "Adopted"}
          >
            Adopt
          </Button>,
        ]}
        hoverable={true}
        bordered
      >
        <p>Type: {pet.type}</p>
        <p>Breed: {pet.breed}</p>
        <p>Price: ${pet.price}</p>
        <Space
          size={"large"}
          split={<Divider type="vertical" align="center" />}
        ></Space>
      </Card>
    </Col>
  ));

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ textAlign: "center", color: "white" }}>Pet Store</h1>
        <Button
          type="default"
          size="large"
          onClick={handleSignOut}
          style={{
            marginLeft: "auto",
            marginRight: "20px",
          }}
        >
          Sign Out
        </Button>
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb items={[{ title: "Home" }, { title: "Customer Dashboard" }]} />
        <div style={{ marginBottom: "20px" }}>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleTypeChange}
          >
            <Option value="all">All Pets</Option>
            <Option value="cat">Cats</Option>
            <Option value="dog">Dogs</Option>
            <Option value="fish">Fish</Option>
            <Option value="bird">Birds</Option>
          </Select>
          <Search
            placeholder="Search pets by name"
            onSearch={handleSearch}
            style={{ margin: "20px 0", width: 300 }}
          />
        </div>
        <div
          style={{
            padding: 24,
            minHeight: 580,
            background: "#15325b",
          }}
        >
          {showOutOfStock ? (
            <div style={{ textAlign: "center", color: "white", fontSize: "18px" }}>
              <p>No pets available at the moment. Please check back later!</p>
            </div>
          ) : (
            <Row gutter={16}>{petCards}</Row>
          )}
          {showConfirm && (
            <div
              className="sized-div1"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "white",
                padding: "50px",
                borderRadius: "5px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>Are you sure you want to delete this pet?</h3>
              <Button
                type="primary"
                size="large"
                onClick={handleConfirmDelete}
                style={{ marginTop: "60px", marginRight: "80px" }}
              >
                Confirm
              </Button>
              <Button
                type="default"
                size="large"
                onClick={handleCancelDelete}
                style={{ marginTop: "60px", marginRight: "80px" }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Pet Store ©2024 Created by The Great Group 2
      </Footer>
    </Layout>
  );
}

export default App;
