import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const amount = getCartAmount() + delivery_fee;

  // Form field states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    if (!token) {
      alert('Please login to place an order.');
      navigate('/login');
    }
  }, [token, navigate]);

  const createOrderPayload = () => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    const items = [];

    for (let productId in storedItems) {
      for (let size in storedItems[productId]) {
        const product = products.find(p => p._id === productId);
        if (product) {
          items.push({
            productId,
            name: product.name,
            quantity: storedItems[productId][size],
            price: product.price,
            size,
          });
        }
      }
    }

    return items;
  };

  const validateForm = () => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      street.trim() &&
      city.trim() &&
      stateValue.trim() &&
      zip.trim() &&
      country.trim() &&
      mobile.trim()
    );
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      alert("Please fill in all delivery information fields.");
      return;
    }

    const items = createOrderPayload();

    if (items.length === 0) {
      alert("Cart is empty.");
      return;
    }

    if (method === 'razorpay') {
      handleRazorPay(items);
    } else {
      try {
        const res = await fetch('http://localhost:5000/api/order/create', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentId: 'COD',
            orderId: 'COD-' + Date.now(),
            amount,
            items,
            paymentMethod: 'cod'
          })
        });

        if (!res.ok) {
          const errorRes = await res.json();
          throw new Error(errorRes.message || "COD order creation failed");
        }

        localStorage.removeItem("cartItems");
        navigate('/orders');
      } catch (err) {
        console.error("COD Order error:", err);
        alert("Failed to place COD order: " + err.message);
      }
    }
  };

  const handleRazorPay = async (items) => {
    try {
      const res = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      if (!res.ok) throw new Error('Failed to create Razorpay order');
      const orderData = await res.json();

      const options = {
        key: "rzp_test_PH2VKUNXERfp6h",
        amount: orderData.amount,
        currency: "INR",
        name: "Clothing Store",
        description: "Order Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const backendRes = await fetch('http://localhost:5000/api/order/create', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount,
                items,
                paymentMethod: 'razorpay'
              })
            });

            if (!backendRes.ok) throw new Error("Failed to store Razorpay order");

            localStorage.removeItem("cartItems");
            navigate('/orders');
          } catch (err) {
            console.error("Failed to save Razorpay order:", err);
            alert("Payment succeeded but order creation failed.");
          }
        },
        prefill: {
          name: firstName + " " + lastName,
          email,
          contact: mobile,
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(`Payment Failed\nReason: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Razorpay payment failed.");
    }
  };

  return (
    <div className='flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side Content */}
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="email" placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Street' value={street} onChange={(e) => setStreet(e.target.value)} />
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='State' value={stateValue} onChange={(e) => setStateValue(e.target.value)} />
        </div>
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="number" placeholder='Zip Code' value={zip} onChange={(e) => setZip(e.target.value)} />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="number" placeholder='Mobile' value={mobile} onChange={(e) => setMobile(e.target.value)} />
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <CartTotal />
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="RazorPay" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
              <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full mt-8 text-end'>
            <button onClick={handlePayment} className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
