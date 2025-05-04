import React, { useEffect, useState } from 'react';
import Title from '../components/Title';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setError("No token found");
  
      try {
        const res = await fetch('http://localhost:5000/api/order/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders");
      }
    };
  
    fetchOrders();
  }, []);

  return (
    <div className='pt-16 border-t'>
      <div className='text-2xl'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>

      {error && <p className='text-red-500 py-4'>{error}</p>}

      <div>
        {orders.length === 0 && !error ? (
          <p className='text-gray-600 py-4'>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className='flex flex-col gap-4 py-4 text-gray-700 border-t border-b'
            >
              <p className='text-sm'>Order ID: {order._id}</p>
              <p className='text-sm'>Amount: Rs. {order.amount}</p>
              <p className='text-sm'>Status: {order.status}</p>
              <p className='text-sm'>
                Date: {new Date(order.createdAt).toLocaleString()}
              </p>
              {order.items.map((item, i) => (
                <div key={i} className='text-sm'>
                  <p>Product ID: {item.productId}</p>
                  <p>
                    Size: {item.size} | Quantity: {item.quantity}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
