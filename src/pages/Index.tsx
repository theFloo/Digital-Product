import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import {
  Check,
  Box,
  Users,
  ArrowRight,
  Brain, // Now used for categories
  Target,
  Laptop, // Now used for categories
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Phone,
  LayoutGrid,
  Palette,
  Code,
  Database, // Added for categories
  BookOpen, // Added for categories
  Package, // Added for categories
  Image, // Added for categories
  ChevronLeft, // Added for carousel
  ChevronRight, // Added for carousel
} from "lucide-react";
import { motion } from "framer-motion";
import NotificationSystem from "@/components/NotificationSystem";
import ReviewSection from "@/components/ReviewSection";
import VideoSection from "@/components/VideoSection";
import ContactForm from "@/components/ContactForm";
import SalesCounter from "@/components/SalesCounter";
import img from "@/assest/img/pan.jpg";
import img1 from "@/assest/img/themes.jpg";
import img2 from "@/assest/img/adboe.jpg";
import img3 from "@/assest/img/digital.jpg";
import img4 from "@/assest/img/youtube.jpg";
import img5 from "@/assest/img/premiumtshirt.png";
import img6 from "@/assest/img/canva.jpg";
import homeImg from "@/assest/img/Home.png";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { API_BASE } from "@/config/api";
import useEmblaCarousel from "embla-carousel-react"; // Added for carousel
import ProductCard from "@/components/ProductCard";

// --- TYPE DEFINITION ---
interface ProductType {
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

// --- CONSTANTS ---
const BUNDLE_PRICE = 499;
const productData: ProductType[] = [];
const featuresData = [];
const whoIsForData = [];

// --- NEW PRODUCT CARD COMPONENT ---
const NewProductCard = ({ product }: { product: ProductType }) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddItemToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/products/${product.id}`} className="block relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-gray-800">
            {product.rating || 4.5}
          </span>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-2xl font-extrabold text-gray-900">
            ₹{product.price}
          </span>
          <Button size="sm" onClick={handleAddItemToCart}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// --- START: NEW CAROUSEL COMPONENTS & DATA ---

// Helper components for carousel buttons
type PropType = {
  enabled: boolean;
  onClick: () => void;
};

const PrevButton: React.FC<PropType> = ({ enabled, onClick }) => (
  <button
    className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed z-10"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Previous category"
  >
    <ChevronLeft className="w-6 h-6" />
  </button>
);

const NextButton: React.FC<PropType> = ({ enabled, onClick }) => (
  <button
    className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed z-10"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Next category"
  >
    <ChevronRight className="w-6 h-6" />
  </button>
);

// New data structure matching your image
const categoryData = [
  { icon: Brain, title: "AI Packs", count: 161 },
  { icon: Laptop, title: "Courses", count: 108 },
  { icon: Database, title: "Databases", count: 12 },
  { icon: BookOpen, title: "EBooks", count: 48 },
  { icon: Package, title: "DigiTac Bundles", count: 64 },
  { icon: Image, title: "Graphics", count: 248 },
  // Add more categories here if needed
  { icon: Palette, title: "Design Assets", count: 92 },
  { icon: Code, title: "Web & Code", count: 76 },
];

// --- END: NEW CAROUSEL COMPONENTS & DATA ---

// --- MAIN PAGE COMPONENT ---
const Index = () => {
  // --- EXISTING STATE AND HOOKS (UNCHANGED) ---
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // --- START: NEW CAROUSEL HOOKS ---
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);
  // --- END: NEW CAROUSEL HOOKS ---

  // --- EXISTING EFFECTS (UNCHANGED) ---
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  // --- EXISTING API FETCH (UNCHANGED) ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/products`);

      if (response.ok) {
        const data = await response.json();
        const transformedProducts = data.map((product) => ({
          ...product,
          rating: product.rating || 4.5,
          popular: product.popular || false,
          features: product.features || [],
          detailDescription: product.detailDescription || product.description,
          url: product.url || "",
        }));
        setProducts(transformedProducts);
      } else {
        console.error("Failed to fetch products from database");
        setProducts(productData); // Fallback
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts(productData); // Fallback
    } finally {
      setLoading(false);
    }
  };

  // --- EXISTING FUNCTIONS (UNCHANGED) ---
  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      products
        .filter((product) => product.popular)
        .forEach((product) => {
          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        });
      setIsAdding(false);
      const popularProducts = products.filter((product) => product.popular);
      toast({
        title: "Success!",
        description: `Product added to cart! ${popularProducts.length} items added.`,
      });
    }, 600);
  };

  const handleShopNow = () => {
    const featuredSection = document.getElementById("featured-products");
    if (featuredSection) {
      featuredSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // --- NEW LOADING SKELETON ---
  const ProductSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 animate-pulse">
      <div className="h-52 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center mt-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-9 bg-gray-200 rounded-lg w-1/4"></div>
      </div>
    </div>
  );

  // --- NEW REDESIGNED JSX ---
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <NotificationSystem />

      {/* 🏠 Hero Section (Unchanged) */}
      {/* Hero Section */}

      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary/50 bg-primary/10">
                <p className="text-sm font-medium text-primary">
                  Limited Time Offer
                </p>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Boost Your Business with{" "}
                <span className="gradient-text">The Floo Hub</span> Unbeatable
                Prices!
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl">
                Create and sell unlimited digital products with our massive
                product of premium assets.
              </p>

              <div className="flex flex-wrap gap-6 pt-2">
                {featuresData.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />

                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <CountdownTimer
                  initialHours={23}
                  initialMinutes={59}
                  initialSeconds={59}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  className="text-lg btn-gradient"
                  disabled={isAdding}
                  onClick={handleAddToCart}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}

                  {!isAdding && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">₹ {BUNDLE_PRICE}</span>

                    <span className="text-xl text-muted-foreground line-through">
                      ₹{(BUNDLE_PRICE * 3).toFixed(2)}
                    </span>
                  </div>

                  <span className="text-green-600 text-sm">
                    Save 80% Today!
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex gap-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                    alt="Visa"
                    className="h-8"
                  />

                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
                    alt="UPI"
                    className="h-8"
                  />

                  <img
                    src="https://cdn-icons-png.flaticon.com/512/825/825454.png"
                    alt="Razorpay"
                    className="h-8"
                  />
                </div>

                <span className="text-sm text-muted-foreground">
                  Secure Payment
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0  from-primary/20 to-transparent rounded-full"></div>

                <div className="glass-card rounded-xl overflow-hidden relative z-10 card-hover">
                  <img
                    src="https://candentseo.com/wp-content/uploads/All-in-one-Bundle-package.jpg"
                    alt="Product Preview"
                    className="w-full h-auto rounded-xl"
                  />

                  <div className="absolute inset-0  from-background/80 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold"></h3>

                    <p className="text-muted-foreground"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧠 Why Choose Us Section (Unchanged) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Secure Payment",
                desc: "Your transactions are 100% secure with our encrypted payment gateway.",
              },
              {
                icon: Truck,
                title: "Instant Delivery",
                desc: "Get access to your digital products immediately after purchase.",
              },
              {
                icon: Phone,
                title: "24/7 Support",
                desc: "Our support team is here to help you around the clock.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <item.icon className="w-10 h-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💎 Featured Products Section (Unchanged) */}
      <section id="featured-products" className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="highlight">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked assets and bundles loved by our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              : products
                  .filter((product) => product.popular)
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
          </div>
        </div>
      </section>

      {/* --- 🛍️ Categories Section (UPGRADED TO CAROUSEL) --- */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular <span className="highlight">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you need for your next project.
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {categoryData.map((cat, i) => (
                  <div
                    key={i}
                    className="flex-[0_0_50%] sm:flex-[0_0_33.33%] md:flex-[0_0_25%] lg:flex-[0_0_16.66%] pl-4"
                  >
                    <div className="group bg-gray-50 border border-gray-200 rounded-xl p-5 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-100 shadow-sm mb-4">
                        <cat.icon className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {cat.count} products
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Buttons */}
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
          </div>
        </div>
      </section>
      {/* --- END: UPGRADED Categories Section --- */}

      {/* 📱 Digital Products Section (Unchanged) */}
      <section id="digital-products" className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Top <span className="highlight">Digital Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our best-selling digital-only items.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              : products
                  .filter((product) => product.category === "digital")
                  .slice(0, 8)
                  .map((product) => (
                    <NewProductCard key={product.id} product={product} />
                  ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">
                Shop All Digital Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 🧾 Customer Reviews Section (Unchanged) */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="highlight">Customers Say</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're trusted by thousands of creators worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah L.",
                role: "Graphic Designer",
                quote:
                  "The assets from Floo Hub are top-notch! They saved me hours of work. The quality is incredible for the price.",
                rating: 5,
              },
              {
                name: "Mike R.",
                role: "Web Developer",
                quote:
                  "I bought a website theme bundle and was blown away. Clean code, great design, and fantastic support.",
                rating: 5,
              },
              {
                name: "Elena K.",
                role: "Content Creator",
                quote:
                  "Instant delivery is a lifesaver. I got my video presets immediately and used them for a client project the same day.",
                rating: 5,
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                className="bg-gray-50 p-6 rounded-xl flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 flex-grow">
                  "{review.quote}"
                </p>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📬 Newsletter / Contact Section (Unchanged) */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/80 to-secondary/80 text-white p-10 md:p-16 rounded-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Exclusive Deals
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8">
                Subscribe to our newsletter and be the first to know about new
                products and special discounts.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Subscribed!",
                    description: "Thanks for joining us.",
                  });
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-200"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
