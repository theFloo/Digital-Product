import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { API_BASE } from '@/config/api';
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  items: OrderItem[];
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { clearCart } = useCartStore();

  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    clearCart();

    if (!transactionId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE || 'http://localhost:3000'}/api/orders/${transactionId}`);
        if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
        const data = await res.json();
        setOrderDetails(data);
      } catch (err) {
        console.error('Error fetching order:', err);
      }
    };

    fetchOrder();
  }, [transactionId, clearCart]);

  const handleDownload = (productId: string, productName: string) => {
    // You can also fetch secure download links from the backend
    alert(`Download link for ${productName} will be sent to your email shortly.`);
  };

  if (!orderDetails) {
    return <div className="min-h-[70vh] flex items-center justify-center">Loading order details...</div>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2 mb-4">
            <p><strong>Order ID:</strong> {orderDetails.id}</p>
            <p><strong>Customer:</strong> {orderDetails.customer_name}</p>
            <p><strong>Email:</strong> {orderDetails.customer_email}</p>
            <p><strong>Total Amount:</strong> ₹{orderDetails.total_amount.toFixed(2)}</p>
          </div>

          <h3 className="font-medium mb-3">Items Purchased:</h3>
          <div className="space-y-3">
            {orderDetails.items.map(item => (
              <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(item.productId, item.name)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link to="/track-order">
            <Button variant="outline">Track Order</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
