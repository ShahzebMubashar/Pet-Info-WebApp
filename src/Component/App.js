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
  notification,
} from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import axios from "axios";
import "./App.css";
import {
  getTokens,
  removeToken,
  isUserLoggedIn,
  getCurrentUserRole,
} from "../TokenManagement/tokenUtils";

const { Header, Content, Footer } = Layout;

function App({ PetsData, setPetsData, petEditor }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const navigate = useNavigate();

  // Function to navigate to Add Pet page
  function navigateFunc() {
    navigate("/Add");
  }

  // Function to handle delete button click
  function handleDeleteClick(petId) {
    setPetToDelete(petId);
    setShowConfirm(true);
  }

  // Function to confirm deletion
  async function handleConfirmDelete() {
    try {
      await axios.delete(`http://localhost:5000/pets/${petToDelete}`);
      setPetsData((prevData) => prevData.filter((pet) => pet.id !== petToDelete));
      notification.success({
        message: 'Success',
        description: 'Pet deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete pet:', error);
      notification.error({
        message: 'Deletion Failed',
        description: 'Failed to delete pet information.',
      });
    } finally {
      setShowConfirm(false);
      setPetToDelete(null);
    }
  }

  // Function to cancel delete operation
  function handleCancelDelete() {
    setShowConfirm(false);
    setPetToDelete(null);
  }

  // Function to handle sign out
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

  useEffect(() => {
    if (!isUserLoggedIn() || getCurrentUserRole() !== "customer") {
      navigate("/");
    }
    // You may fetch pets data here if necessary
  }, [navigate]);

  // Define pet images
  const petImages = {
    Cat: "https://cdn.vectorstock.com/i/500p/67/08/cat-full-black-silhouette-vector-51516708.jpg",
    Dog: "https://t4.ftcdn.net/jpg/04/37/04/67/360_F_437046701_q9t3W43b6y4nBn7710uH3mwEegUiMLA3.jpg",
    Fish: "https://img.freepik.com/premium-vector/black-white-vector-fish-logo_567294-6334.jpg",
    Bird: "https://www.thepixelfreak.co.uk/wp-content/uploads/2018/07/Alternate-Dove-Logo.png",
  };

  // Define pet cards
  const petCards = PetsData.map((pet) => (
    <Col span={6} key={pet.id}>
      <Card
        title={pet.name}
        style={{
          margin: "10px",
          marginTop: "20px",
          backgroundImage: `url(${petImages[pet.pettype]})`,
          backgroundSize: "70% 70%",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
        actions={[
          <EditTwoTone onClick={() => navigate(`/edit/${pet.id}`)} />, // Navigate to edit page with pet ID
          <DeleteTwoTone onClick={() => handleDeleteClick(pet.id)} />,
        ]}
        hoverable={true}
        bordered
      >
        <p>Type: {pet.pettype}</p>
        <p>Breed: {pet.breed}</p>
        <p>Price: {pet.price}</p>
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
        <h1 style={{ textAlign: "center", color: "white" }}> Pet Store </h1>
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
        <Button
          type="primary"
          size="large"
          onClick={navigateFunc}
          style={{
            marginLeft: "575px",
            position: "absolute",
          }}
        >
          Add Pet
        </Button>
        <div
          style={{
            padding: 24,
            minHeight: 580,
            background: "#15325b",
          }}
        >
          <Row gutter={16}>{petCards}</Row>
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
                Delete
              </Button>
              <Button
                type="default"
                size="large"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Content>
      <Footer>
        <p>Triton industries©</p>
        <p>contact : talha.asgher222@gmail.com</p>
      </Footer>
    </Layout>
  );
}

export default App;
