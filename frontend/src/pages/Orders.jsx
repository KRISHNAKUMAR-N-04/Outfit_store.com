import React, { useEffect, useState, useContext } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import BASE_URL from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const { products } = useContext(ShopContext); // ✅ Access the array of product data

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setError('No token found');

      try {
        const res = await fetch(`${BASE_URL}/api/order/al`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        console.log(data);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, []);

  // Function to handle canceling an order
  const cancelOrder = async (orderId, paymentMethod) => {
    const token = localStorage.getItem('token');
    if (!token) return setError('No token found');
    console.log("Order id : ", orderId)

    try {
      const res = await fetch(`${BASE_URL}/api/order/cancel/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to cancel the order');

      const updatedOrder = await res.json();
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));

      if (paymentMethod === 'razorpay') {
        alert('Your order has been canceled. A refund will be processed within 5-7 working days. For further assistance, contact us at 1800-123-4567.');
      } else {
        alert('Your order has been canceled successfully.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to cancel order');
    }
  };

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
              className='flex flex-col gap-4 py-4 border-t border-b text-gray-800'
            >
              <p className='text-sm font-medium'>Order ID: {order._id}</p>
              <p className='text-sm'>Amount: Rs. {order.amount}</p>
              <p className='text-sm'>Mode of Payment: {order.paymentMethod}</p>

              <p className='text-sm'>Status: {order.status || 'Order Placed'}</p>
              <p className='text-sm'>
                Date: {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
                {order.items.map((item, i) => {
                  const productData = products.find(p => p._id === item.productId);

                  return (
                    <div
                      key={i}
                      className='flex items-center gap-4 border p-3 rounded-md bg-gray-50'
                    >
                      {productData.image && (
                        <img
                          src={productData.image[0]}
                          alt={productData.name || 'Product Image'}
                          className='w-20 h-20 object-cover rounded'
                        />
                      )}
                      <div>
                        <p className='font-semibold'>{productData?.name || 'Product Name'}</p>
                        <p className='text-sm text-gray-600'>
                          Size: {item.size} | Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className='flex end-4 justify-between items-center mt-4'>
                {/* Cancel Button */}
                <button
                  onClick={() => cancelOrder(order._id, order.paymentMethod)}
                  className='bg-gray-800 text-white px-4 py-2 rounded-sm'
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
