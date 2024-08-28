import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Layout,
  Button,
  Card,
  Col,
  Row,
  Space,
  Divider,
  Select,
  Tag,
} from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import axios from "axios";
import "./App.css";
import {
  getTokens,
  removeToken,
  isUserLoggedIn,
  getCurrentUserRole,
  getCurrentUserToken,
} from "../TokenManagement/tokenUtils";
import { Modal, notification } from "antd";
import axiosInstance from "../api/axios";
const { Header, Content, Footer } = Layout;
const { Option } = Select;

function OwnerDashboard() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const navigate = useNavigate();

  const fetchAllPets = async () => {
    try {
      const token = getCurrentUserToken();
      const response = await axios.get("http://localhost:5000/owner/all-pets", {
        headers: { "auth-token": token },
      });
      setPets(response.data);
      setFilteredPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  useEffect(() => {
    if (!isUserLoggedIn() || getCurrentUserRole() !== "owner") {
      navigate("/");
    } else {
      fetchAllPets();
    }
  }, [navigate]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    if (value === "all") {
      setFilteredPets(pets);
    } else {
      setFilteredPets(pets.filter((pet) => pet.type === value));
    }
  };
  const handleDelete = (petId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this pet?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/pets/${petId}`);
          notification.success({
            message: "Success",
            description: "Pet deleted successfully.",
          });
          fetchAllPets(); // Refresh the pet list
        } catch (error) {
          console.error("Error deleting pet:", error);
          notification.error({
            message: "Delete Failed",
            description: "Failed to delete pet.",
          });
        }
      },
    });
  };
  const handleSignOut = () => {
    const tokens = getTokens();
    const ownerId = Object.keys(tokens).find(
      (id) => tokens[id].role === "owner"
    );
    if (ownerId) {
      removeToken(ownerId);
    }
    navigate("/");
  };

  const handleEdit = (petId) => {
    navigate(`/edit/${petId}`);
  };

  const petImages = {
    cat: "https://cdn.vectorstock.com/i/500p/67/08/cat-full-black-silhouette-vector-51516708.jpg",
    dog: "https://t4.ftcdn.net/jpg/04/37/04/67/360_F_437046701_q9t3W43b6y4nBn7710uH3mwEegUiMLA3.jpg",
    fish: "https://img.freepik.com/premium-vector/black-white-vector-fish-logo_567294-6334.jpg",
    bird: "https://www.thepixelfreak.co.uk/wp-content/uploads/2018/07/Alternate-Dove-Logo.png",
  };

  const petCards = filteredPets.map((pet) => (
    <Col span={6} key={pet._id}>
      <Card
        title={pet.name}
        style={{
          margin: "10px",
          marginTop: "20px",
          backgroundImage: `url(${petImages[pet.type]})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "65% 65%",
          backgroundPosition: "bottom right -18px",
        }}
        actions={[
          <EditTwoTone onClick={() => handleEdit(pet._id)} />,
          <DeleteTwoTone onClick={() => handleDelete(pet._id)} />,
        ]}
        hoverable={true}
        bordered
      >
        <div style={{ position: "relative" }}>
          <p>Type: {pet.type}</p>
          <p>Breed: {pet.breed}</p>
          <p>
            Status:
            <Tag color={pet.status === "available" ? "green" : "blue"}>
              {pet.status}
            </Tag>
          </p>
          <p>Price: ${pet.price}</p>
        </div>
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
        <h1 style={{ textAlign: "center", color: "white" }}>
          Pet Store Owner Dashboard
        </h1>
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
        <Breadcrumb items={[{ title: "Home" }, { title: "Owner Dashboard" }]} />
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
        </div>
        <div style={{ padding: 24, minHeight: 580, background: "#15325b" }}>
          {filteredPets.length === 0 ? (
            <p>No pets available</p>
          ) : (
            <Row gutter={16}>{petCards}</Row>
          )}
        </div>
      </Content>
      <Footer>
        <p>Triton industries©</p>
        <p>contact: talha.asgher222@gmail.com</p>
      </Footer>
    </Layout>
  );
}

export default OwnerDashboard;
