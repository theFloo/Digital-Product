"use client";
import { useSearchParams } from "next/navigation";

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const error = searchParams.get("error");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-700 mb-6">
          {error === "callback-failed"
            ? "We couldn’t confirm your payment because the callback failed."
            : "Your payment didn’t go through or was cancelled."}
        </p>

        {transactionId && (
          <p className="text-sm text-gray-500 mb-4">
            Transaction ID: <span className="font-mono">{transactionId}</span>
          </p>
        )}

        <a
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Go Back Home
        </a>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        If you were charged, the amount will be refunded automatically.
      </p>
    </main>
  );
}
