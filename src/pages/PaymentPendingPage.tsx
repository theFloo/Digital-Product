import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCcw, ArrowLeft } from "lucide-react";
import { API_BASE } from "@/config/api";

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
}

const PaymentPendingPage = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transactionId = searchParams.get("transactionId");

  const fetchOrder = async () => {
    if (!transactionId) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE || "http://localhost:3000"}/api/orders/${transactionId}`
      );
      if (!res.ok) throw new Error(`Failed to fetch order (${res.status})`);
      const data = await res.json();
      setOrderDetails(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [transactionId]);

  if (loading)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        Loading order details...
      </div>
    );

  if (error)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-medium mb-4">
          ⚠️ Error: {error || "Something went wrong"}
        </p>
        <Button variant="outline" onClick={fetchOrder}>
          Try Again
        </Button>
      </div>
    );

  if (!orderDetails)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        No order found for this transaction.
      </div>
    );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="h-20 w-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Clock className="h-12 w-12 text-yellow-600" />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-yellow-600">
          Payment Pending
        </h1>
        <p className="text-muted-foreground mb-8">
          We’ve received your order, but the payment is still being processed by
          PhonePe. This may take a few minutes.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Order Info</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Order ID:</strong> {orderDetails.id}
            </p>
            <p>
              <strong>Customer:</strong> {orderDetails.customer_name}
            </p>
            <p>
              <strong>Email:</strong> {orderDetails.customer_email}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹
              {orderDetails.total_amount.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {orderDetails.status}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={fetchOrder}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh Status
          </Button>

          <Link to="/">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingPage;
