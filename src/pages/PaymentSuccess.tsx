import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { API_BASE } from "@/config/api";

interface OrderItem {
  id: string;
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

interface Product {
  id: string;
  name: string;
  price?: number;
  image?: string;
  file_name?: string | null;
  local_file_name?: string | null;
  // other columns...
}

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const { clearCart } = useCartStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const transactionId = searchParams.get("transactionId");

  useEffect(() => {
    clearCart();

    if (!transactionId) return;

    const fetchOrder = async () => {
      try {
        const base = API_BASE || "http://localhost:3000";
        const res = await fetch(`${base}/api/orders/${encodeURIComponent(transactionId)}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
        const data = await res.json();
        setOrderDetails(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, [transactionId, clearCart]);

  // fetch products list
useEffect(() => {
  // only run when we have order details
  if (!orderDetails) return;

  const fetchProductsForOrder = async () => {
    setLoadingProducts(true);
    setProductsError(null);

    try {
      const base = API_BASE || "http://localhost:3000";

      // collect unique product ids from the order items
      const ids = Array.from(
        new Set(orderDetails.items.map((it) => String(it.id).trim()).filter(Boolean))
      );

      if (ids.length === 0) {
        setProducts([]);
        return;
      }

      // fetch all product endpoints in parallel
      const fetches = ids.map((id) =>
        fetch(`${base}/api/products/${encodeURIComponent(id)}`, {
          method: "GET",
          // include credentials only if your server requires cookies/session
        }).then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Product ${id} fetch failed: ${res.status} ${text}`);
          }
          return (await res.json()) as Product;
        })
      );

      // use Promise.allSettled to tolerate some missing products
      const results = await Promise.allSettled(fetches);

      const successful: Product[] = [];
      const errors: string[] = [];

      results.forEach((r, idx) => {
        if (r.status === "fulfilled") {
          successful.push(r.value);
        } else {
          errors.push(`id=${ids[idx]}: ${r.reason?.message || String(r.reason)}`);
        }
      });

      if (successful.length === 0 && errors.length) {
        // nothing fetched successfully
        throw new Error(`Failed to fetch any products. Errors: ${errors.join("; ")}`);
      }

      // optional: keep the order of products same as order items
      const productsOrdered = ids
        .map((id) => successful.find((p) => String(p.id) === id))
        .filter(Boolean) as Product[];

      setProducts(productsOrdered);
      if (errors.length) {
        // log and show a non-fatal warning
        console.warn("Some product fetches failed:", errors);
        setProductsError("Some products could not be loaded. Check console for details.");
      }
    } catch (err) {
      console.error("Error fetching products for order:", err);
      setProductsError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]); // fallback empty
    } finally {
      setLoadingProducts(false);
    }
  };

  fetchProductsForOrder();
}, [orderDetails]);

  // helpers
  const parseFilenameFromContentDisposition = (headerValue: string | null) => {
    if (!headerValue) return null;
    const rxStar = /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i;
    const mStar = rxStar.exec(headerValue);
    if (mStar && mStar[1]) {
      try {
        const raw = mStar[1].trim().replace(/^["']|["']$/g, "");
        return decodeURIComponent(raw);
      } catch (e) { }
    }
    const rx = /filename\s*=\s*["']?([^"';]+)["']?/i;
    const m = rx.exec(headerValue);
    if (m && m[1]) return m[1].trim();
    return null;
  };

  const makeSafeFilename = (name: string) => {
    if (!name) return "download.pdf";
    const safe = name.replace(/[^a-z0-9_\-\. ]/gi, "_").trim();
    return safe.toLowerCase().endsWith(".pdf") ? safe : `${safe}.pdf`;
  };

  // Given productId, pick best fallback filename available from products response
  const getFallbackFilenameForProduct = (productId: string, fallbackName?: string) => {
    const product = products?.find((p) => String(p.id) === String(productId));
    if (!product) return makeSafeFilename(fallbackName || `product_${productId}`);
    // prefer file_name or local_file_name if present
    const raw = product.file_name || product.local_file_name || product.name || fallbackName || `product_${productId}`;
    return makeSafeFilename(raw);
  };

async function downloadProduct(productId, transactionId) {
  const base = API_BASE || "https://api.thefloo.in";
  const res = await fetch(`${base}/api/signed-download/${encodeURIComponent(productId)}?transactionId=${encodeURIComponent(transactionId)}`, {
    method: "GET",
    credentials: "include", // if your server requires cookies
    headers: { Accept: "application/json" },
  });
  const json = await res.json();
  if (!res.ok || !json.signedUrl) throw new Error(json.message || "No signed url");

  // open in new tab or redirect; using location.href will open in same tab
    window.open(json.signedUrl, "_blank");
}


  if (!orderDetails) {
    return <div className="min-h-[70vh] flex items-center justify-center">Loading order details...</div>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-3xl">
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
              <strong>Total Amount:</strong> ₹{orderDetails.total_amount.toFixed(2)}
            </p>
          </div>

          <h3 className="font-medium mb-3">Items Purchased:</h3>

          {/* Show product fetch status */}
          {loadingProducts && <p className="mb-3 text-sm text-muted-foreground">Loading product info...</p>}
          {productsError && <p className="mb-3 text-sm text-red-500">Could not load products: {productsError}</p>}

          <div className="space-y-3">
            {orderDetails.items.map((item) => {
              const product = products?.find((p) => String(p.id) === String(item.id));
              const displayName = product?.name ?? item.name;
              const fallbackFilename = getFallbackFilenameForProduct(item.id, item.name);

              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    {product?.image ? (
                      <img src={product.image} alt={displayName} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm">PDF</div>
                    )}
                    <div>
                      <div className="font-medium">{displayName}</div>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                      {product && (
                        <p className="text-xs text-muted-foreground">Product ID: {product.id}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadProduct(item.id, transactionId)}
                    disabled={!!downloadingId}
                    className="flex items-center gap-2"
                    aria-label={`Download ${displayName}`}
                  >
                    <Download className="h-4 w-4" />
                    {downloadingId === item.id ? "Downloading..." : "Download"}
                  </Button>
                </div>
              );
            })}
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
