  import React, { useEffect, useState } from "react";
  import Navbar from "./components/Navbar";
  import Sidebar from "./components/Sidebar";
  import { Route, Routes } from "react-router-dom";
  import Add from "./pages/Add";
  import List from "./pages/List";
  import Orders from "./pages/Orders";
  import Login from "./components/Login";
  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { Slide } from "react-toastify"; // ✅ Fix: You need to import Slide

  export const backendUrl = import.meta.env.VITE_BACKEND_URL;

  export const currency = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "Rs",
    }).format(price);
  };

  const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    useEffect(() => {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token"); // ✅ Optional cleanup
      }
    }, [token]);

    return (
      <div className="min-h-screen bg-gray-100">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Slide} // ✅ Fix: You had `transition:Slide` instead of `transition={Slide}`
        />

        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Navbar setToken={setToken} />
            <hr />
            <div className="flex w-full">
              <Sidebar />
              <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                <Routes>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  export default App;
