import React, { useEffect, useState } from 'react';
import Title from '../components/Title';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/order/all')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className='pt-16 border-t'>
      <div className='text-2xl'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>
      <div>
        {orders.map((order, index) => (
          <div key={index} className='flex flex-col gap-4 py-4 text-gray-700 border-t border-b'>
            <p className='text-sm'>Order ID: {order.orderId}</p>
            <p className='text-sm'>Amount: Rs. {order.amount}</p>
            <p className='text-sm'>Status: {order.status}</p>
            <p className='text-sm'>Date: {new Date(order.createdAt).toLocaleString()}</p>
            {order.items.map((item, i) => (
              <div key={i} className='text-sm'>
                <p>Product ID: {item.productId}</p>
                <p>Size: {item.size} | Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
