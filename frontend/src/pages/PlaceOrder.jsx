import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, getCartAmount, delivery_fee, UpdateQuantity} = useContext(ShopContext);
  const amount = getCartAmount() + delivery_fee;

  const HandleRazorPay = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Make sure to include Razorpay script in index.html.");
      return;
    }

    try {
      // Step 1: Create order from backend
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({amount})
      });

      if (!response.ok) {
        throw new Error('Failed to create order on Razorpay');
      }

      const orderData = await response.json();
      console.log('Order created:', orderData);

      // Step 2: Configure Razorpay options
      const options = {
        key: "rzp_test_PH2VKUNXERfp6h", // Replace with your Razorpay test key
        amount: orderData.amount, // This should be in paise (100 paise = 1 INR)
        currency: "INR",
        name: "Your Store Name",
        description: "Test Transaction",
        order_id: orderData.id,
        handler: async function (response) {
          console.log(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
        
          // 🛒 Get cart items from localStorage
          const storedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
        
          // 📦 Prepare the items array
          const items = [];
          for (let productId in storedItems) {
            for (let size in storedItems[productId]) {
              items.push({
                productId,
                size,
                quantity: storedItems[productId][size]
              });
            }
          }
        
          // 📤 Send order to backend
          await fetch('http://localhost:5000/api/order/create', {
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
        
          localStorage.removeItem("cartItems"); // 🧹 Clear cart after successful payment
          navigate('/orders'); // ✅ Redirect to orders page
        }
        ,
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        alert(`❌ Payment Failed\nReason: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error("Error in Razorpay:", error);
      alert("Something went wrong while initiating Razorpay.");
    }
  };

  const handlePayment = async () => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    const items = [];
  
    for (let productId in storedItems) {
      for (let size in storedItems[productId]) {
        items.push({
          productId,
          size,
          quantity: storedItems[productId][size]
        });
      }
    }
  
    if (method === 'razorpay') {
      HandleRazorPay(); // Razorpay logic stays unchanged
    } else {
      // Handle COD
      try {
        await fetch('http://localhost:5000/api/order/create', {
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
  
        localStorage.removeItem("cartItems");
        navigate('/orders');
      } catch (error) {
        console.error("COD Order error:", error);
        alert("Failed to place COD order");
      }
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
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='First Name' />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Last Name' />
        </div>
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="email" placeholder='Email Address' />
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='City' />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="number" placeholder='Zip Code' />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Country' />
        </div>
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="number" placeholder='Mobile' />
      </div>

      {/* Right Side Content */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        {/* Payment Methods */}
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

          {/* Place Order Button */}
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
