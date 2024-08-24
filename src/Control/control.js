import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import App from "../Component/App";
import Welcome from "../Component/welcome";
import AddPet from "../Component/Addpets";
import EditPet from "../Component/edit";
import OwnerDashboard from "../Component/OwnerDashboard";
import {
  isUserLoggedIn,
  getCurrentUserRole,
} from "../TokenManagement/tokenUtils";

function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn = isUserLoggedIn();
  const userRole = getCurrentUserRole();

  if (!isLoggedIn || userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const options = [
  { value: "Bird", label: "Bird 🐦" },
  { value: "Fish", label: "Fish 🐟" },
  { value: "Dog", label: "Dog 🐕" },
  { value: "Cat", label: "Cat 🐈" },
];

export default function Control() {
  const [petToEdit, setPetToEdit] = useState(null);
  const [PetsData, setPetsData] = useState([
    { id: 1, name: "Fluffy", pettype: "Cat", breed: "Persian", price: "100" },
    { id: 2, name: "Spot", pettype: "Dog", breed: "Dalmatian", price: "150" },
    { id: 3, name: "Goldie", pettype: "Fish", breed: "Goldfish", price: "10" },
    {
      id: 4,
      name: "Eagly",
      pettype: "Bird",
      breed: "Bald Eagle",
      price: "250",
    },
  ]);

  const navigate = useNavigate();

  function handleUpdatePet(editPet) {
    setPetsData((prevData) =>
      prevData.map((pet) => (pet.id === editPet.id ? editPet : pet))
    );
    navigate("/home");
  }

  function Editclicked(pet) {
    setPetToEdit(pet);
    navigate("/Edit");
  }

  function handleSubmit(formData) {
    const newPet = {
      id: PetsData.length + 1,
      ...formData,
    };
    setPetsData((prevData) => [...prevData, newPet]);
  }

  return (
    <div>
      <Routes>
        <Route index path="/" element={<Welcome />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="customer">
              <App
                PetsData={PetsData}
                setPetsData={setPetsData}
                petEditor={Editclicked}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Add"
          element={
            <AddPet
              options={options}
              onSubmit={(newAnimal) => {
                handleSubmit(newAnimal);
              }}
            />
          }
        />
        <Route
          path="/Edit"
          element={
            <EditPet
              pet={petToEdit}
              options={options}
              onCancel={() => navigate("/home")}
              onUpdate={(newData) => {
                handleUpdatePet(newData);
              }}
            />
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
