import { useState, useEffect, useCallback, useMemo } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Phone,
  Brain,
  Laptop,
  Database,
  BookOpen,
  Package,
  Image as ImageIcon,
  Palette,
  Code,
} from "lucide-react";

import CountdownTimer from "@/components/CountdownTimer";
import NotificationSystem from "@/components/NotificationSystem";
import ProductCard from "@/components/ProductCard";
import { API_BASE } from "@/config/api";

/* ───────────────── TYPES ───────────────── */
interface Product {
  id: string;
  name: string;
  description: string;
  detailDescription?: string;
  price: number;
  popular?: boolean;
  image: string;
  rating?: number;
  features?: string[];
  category: string;
  url?: string;
}

interface Category {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
}

/* ───────────────── CONSTANTS ───────────────── */
const BUNDLE_PRICE = 499;

const CATEGORIES: Category[] = [
  { icon: Brain, title: "AI Packs", count: 161 },
  { icon: Laptop, title: "Courses", count: 108 },
  { icon: Database, title: "Databases", count: 12 },
  { icon: BookOpen, title: "EBooks", count: 48 },
  { icon: Package, title: "Bundles", count: 64 },
  { icon: ImageIcon, title: "Graphics", count: 248 },
  { icon: Palette, title: "Design Assets", count: 92 },
  { icon: Code, title: "Web & Code", count: 76 },
];

/* ───────────────── UI HELPERS ───────────────── */
const CarouselButton = ({
  onClick,
  disabled,
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  direction: "left" | "right";
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === "left" ? "Previous" : "Next"}
    className={`absolute top-1/2 ${
      direction === "left" ? "-left-4" : "-right-4"
    } -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg border hover:bg-gray-50 disabled:opacity-40`}
  >
    {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
  </button>
);

const CategoryCard = ({ icon: Icon, title, count }: Category) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white border rounded-xl p-6 text-center hover:shadow-xl transition"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm text-gray-500">{count} products</p>
  </motion.div>
);

/* ───────────────── MAIN ───────────────── */
export default function HomePage() {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  /* Carousel */
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi]);

  /* Fetch */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        setProducts(
          data.map((p: any) => ({
            ...p,
            rating: p.rating ?? 4.8,
            popular: Boolean(p.popular),
          }))
        );
      } catch {
        toast({ title: "Failed to load products", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const popularProducts = useMemo(
    () => products.filter((p) => p.popular).slice(0, 8),
    [products]
  );

  const addBundle = async () => {
    if (isAddingBundle) return;
    setIsAddingBundle(true);

    popularProducts.forEach((p) =>
      addItem({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 })
    );

    toast({
      title: "Bundle added 🎉",
      description: `${popularProducts.length} items added to cart`,
    });

    setIsAddingBundle(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NotificationSystem />

      {/* HERO */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 text-sm bg-primary/10 text-primary rounded-full">
              Limited Offer
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Build & Sell Digital Products with{" "}
              <span className="text-primary">The Floo Hub</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl">
              Premium AI packs, courses, design assets & tools — all in one bundle.
            </p>

            <CountdownTimer initialHours={23} initialMinutes={59} initialSeconds={59} />

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={addBundle} disabled={isAddingBundle}>
                {isAddingBundle ? "Adding..." : "Add Bundle – ₹499"}
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link to="/products">Explore Products</Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Rated 4.8 by 12,000+ creators
            </div>
          </div>

          <motion.img
            src="https://candentseo.com/wp-content/uploads/All-in-one-Bundle-package.jpg"
            alt="Bundle preview"
            className="rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[ShieldCheck, Truck, Phone].map((Icon, i) => (
            <div key={i} className="flex gap-4 p-6 border rounded-xl">
              <Icon className="text-primary w-8 h-8" />
              <div>
                <h3 className="font-semibold">
                  {["Secure Payment", "Instant Access", "24/7 Support"][i]}
                </h3>
                <p className="text-sm text-gray-600">
                  {[
                    "Encrypted & protected",
                    "Download immediately",
                    "Always here to help",
                  ][i]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />
                ))
              : popularProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10">
            Popular Categories
          </h2>

          <div className="relative">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-6">
                {CATEGORIES.map((cat) => (
                  <div key={cat.title} className="min-w-[220px]">
                    <CategoryCard {...cat} />
                  </div>
                ))}
              </div>
            </div>

            <CarouselButton
              direction="left"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
            />
            <CarouselButton
              direction="right"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
            />
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 bg-primary text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Get Exclusive Deals</h2>
        <p className="opacity-90 mb-8">New releases, discounts & bonuses</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast({ title: "Subscribed 🎉" });
          }}
          className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            className="flex-1 px-5 py-4 rounded-xl text-black"
          />
          <Button size="lg" className="bg-white text-primary">
            Subscribe
          </Button>
        </form>
      </section>
    </div>
  );
}
