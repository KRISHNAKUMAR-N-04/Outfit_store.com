import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";


const ClientProfile = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);
  


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/profile");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white border shadow rounded-md text-gray-800">
      <h1 className="text-2xl font-semibold mb-4">👤 Your Profile</h1>
      <div className="space-y-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toDateString()}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-900"
      >
        Logout
      </button>
    </div>
  );
};

export default ClientProfile;
