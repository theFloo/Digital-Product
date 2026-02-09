import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PaymentProcessing() {
  useEffect(() => {
    // optional: poll backend or just wait for redirect
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
      <h1 className="text-2xl font-bold mb-2">
        Processing your payment
      </h1>
      <p className="text-gray-600 text-center max-w-md">
        Please do not refresh or close this page.<br />
        We are confirming your payment with PhonePe.
      </p>
    </div>
  );
}
