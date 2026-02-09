import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ArrowLeft, Check, ShieldCheck, Clock, BookOpen, Users, ShoppingCart } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import ProductCard from "@/components/ProductCard";
import { API_BASE } from "@/config/api";
import { cn } from "@/lib/utils";

/* ───────────────── TYPES ───────────────── */
interface Product {
  id: string;
  name: string;
  description: string;
  detailDescription?: string;
  price: number;
  rating?: number;
  image: string;
  images?: string[];          // ← added support for gallery
  category: string;
  features?: string[];
  popular?: boolean;
  url: string;
}

/* ───────────────── SKELETON ───────────────── */
const DetailSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="aspect-[4/5] md:aspect-square lg:aspect-[5/6] bg-gray-200 rounded-2xl" />
        <div className="space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded-lg" />
          <div className="h-12 w-4/5 bg-gray-200 rounded-xl" />
          <div className="h-5 w-64 bg-gray-200 rounded" />
          <div className="h-8 w-48 bg-gray-200 rounded-xl" />
          <div className="h-14 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ───────────────── FLOATING CART BAR ───────────────── */
function FloatingAddToCart({ product, onAdd }: { 
  product: Product; 
  onAdd: () => void 
}) {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 400);
  });

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: visible ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 bg-white/80 backdrop-blur-xl border-t",
        "shadow-2xl shadow-black/10 lg:hidden"
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-primary">₹{product.price}</p>
          <p className="text-xs text-muted-foreground line-through">₹{product.price * 2}</p>
        </div>
        <Button size="lg" onClick={onAdd} className="gap-2">
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}

/* ───────────────── MAIN ───────────────── */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();

        const normalized: Product = {
          ...data,
          rating: data.rating ?? 4.8,
          url: data.url ?? `/products/${data.id}`,
          images: data.images ?? [data.image],
        };

        setProduct(normalized);

        const relatedRes = await fetch(
          `${API_BASE}/api/products?category=${data.category}&limit=8`
        );
        const relatedData = await relatedRes.json();

        setRelated(
          relatedData
            .filter((p: Product) => p.id !== data.id)
            .slice(0, 4)
            .map((p: Product) => ({
              ...p,
              rating: p.rating ?? 4.7,
              url: p.url ?? `/products/${p.id}`,
            }))
        );
      } catch {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center">{error}</h2>
        <Button asChild size="lg">
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24 lg:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 max-w-7xl">

        {/* ─── Back & Category ─── */}
        <div className="flex items-center justify-between mb-6 lg:mb-10">
          <Button variant="ghost" asChild className="-ml-3">
            <Link to="/products" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <Badge variant="outline" className="text-sm font-medium">
            {product.category}
          </Badge>
        </div>

        {/* ─── HERO ─── */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Left – Gallery area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-black/8 bg-white"
          >
            <div className="aspect-[4/5] md:aspect-square lg:aspect-[5/6]">
              <img
                src={product.images?.[0] ?? product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                loading="eager"
              />
            </div>

            {/* Small trust badges overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-3 flex-wrap">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                Secure Payment
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                Instant Download
              </div>
            </div>
          </motion.div>

          {/* Right – Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6 lg:gap-8"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating + reviews count placeholder */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">
                {product.rating?.toFixed(1)}
              </span>
              <span className="text-muted-foreground">• Very good</span>
            </div>

            {/* Price block – more premium feeling */}
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black text-primary tracking-tight">
                  ₹{product.price}
                </span>
                <span className="text-2xl text-muted-foreground line-through opacity-70">
                  ₹{Math.round(product.price * 2)}
                </span>
                <Badge variant="destructive" className="text-base font-bold -ml-1">
                  50% OFF
                </Badge>
              </div>
              <p className="text-sm text-green-700 font-medium">
                Limited time offer — only today
              </p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* CTA area */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="w-full md:w-auto min-w-[260px] text-lg h-14 gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-6 w-6" />
                Add to Cart — ₹{product.price}
              </Button>
              <p className="mt-3 text-center md:text-left text-sm text-muted-foreground">
                Instant delivery • Secure checkout
              </p>
            </div>

            {/* Small features grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {[
                { icon: BookOpen, text: "Instant Download", color: "primary" },
                { icon: Users, text: "Loved by creators", color: "purple-600" },
                { icon: Check, text: "Money-back guarantee", color: "emerald-600" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 p-3 bg-white/60 rounded-xl border">
                  <item.icon className={cn("h-6 w-6", `text-${item.color}`)} />
                  <span className="text-xs sm:text-sm font-medium leading-tight">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Detailed Description ─── */}
        <div className="mt-16 lg:mt-24 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 lg:mb-8">
            Product Details
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            {product.detailDescription || product.description}
          </div>
        </div>

        {/* ─── Related Products ─── */}
        {related.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 lg:mb-12">
              You may also like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile floating bar */}
      <FloatingAddToCart product={product} onAdd={handleAddToCart} />
    </div>
  );
}