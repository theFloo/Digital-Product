import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Book,
  Star,
  Lock,
  Clock,
  Headphones,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCartStore } from '../store/useCartStore'; // Adjust path if needed
import { useToast } from '../hooks/use-toast'; // shadcn/ui toast hook assumed

interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  rating?: number;
  image: string;
  category: string;
}

const API_BASE = 'https://your-api-base-url.com'; // ← Replace with real URL

const IndexDummy: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const featuredRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();
  const { toast } = useToast();
 /* ---------------- SAVE PRODUCTS (ONCE) ---------------- */
  useEffect(() => {
    if (!localStorage.getItem('products')) {
      const initialProducts: ProductType[] = [
        {
          id: '1',
          name: 'It Ends with Us',
          description:
            'A deeply emotional novel by Colleen Hoover about love and resilience.',
          price: 499,
          rating: 4.5,
          image:
            'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781398520783/it-ends-with-us-9781398520783_hr.jpg',
          category: 'Books',
        },
        {
          id: '2',
          name: 'Sapiens: A Brief History of Humankind',
          description:
            'An exploration of human history by Yuval Noah Harari.',
          price: 399,
          rating: 4.7,
          image:
            'https://d30a6s96kk7rhm.cloudfront.net/original/readings/978/009/959/9780099590088.jpg',
          category: 'Books',
        },
        {
          id: '3',
          name: 'The Fault in Our Stars',
          description:
            'A touching love story by John Green about life, loss, and hope.',
          price: 549,
          rating: 4.6,
          image:
            'https://laurellane.co.uk/wp-content/uploads/2022/07/IMG_0260.jpg',
          category: 'Books',
        },
        {
          id: '4',
          name: 'Twisted Love',
          description:
            'A dark romance by Ana Huang filled with passion and secrets.',
          price: 599,
          rating: 4.8,
          image:
            'https://th.bing.com/th/id/OIP.m02sHFD1CdDKcuXISPNVBAHaJ4?w=208&h=277&c=7',
          category: 'Books',
        },
      ];

      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  /* ---------------- LOAD PRODUCTS ---------------- */
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
    setLoading(false);
  }, []);

  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Subscribed successfully!',
      description: 'You will receive updates about new books.',
    });
    setEmail('');
  };

  const categories = [
    { title: 'Self Growth', icon: Book, count: 15 },
    { title: 'Mindset', icon: Book, count: 12 },
    { title: 'Technology', icon: Book, count: 20 },
    { title: 'Finance', icon: Book, count: 10 },
    { title: 'Design', icon: Book, count: 8 },
    { title: 'Programming', icon: Book, count: 18 },
    { title: 'Creativity', icon: Book, count: 14 },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });

  const reviews = [
    'The book was easy to read and very practical.',
    'Clear writing and useful examples.',
    'Instant download worked perfectly.',
  ];

  const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
  const { addItem } = useCartStore();

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {/* Clickable area → Detail page */}
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[3/4] relative">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {product.rating}
            </span>
          </div>
        )}

        {/* Price */}
        <p className="font-bold text-xl mt-3">₹{product.price}</p>

        {/* Add to Cart */}
        <button
          onClick={() =>
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            })
          }
          className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-5">
        <div className="h-6 bg-gray-300 rounded w-4/5 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/5 mb-3" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
        <div className="mt-5 h-11 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-5 md:px-10 lg:px-16 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
        <div className="md:w-1/2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold tracking-wide"
          >
            Digital Book Store
          </motion.span>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-5 leading-tight"
          >
            Discover Quality Digital Books at The Floo Creative Marketing Agency
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-slate-600 mt-6 max-w-xl"
          >
            Browse thoughtfully curated digital books designed to help you learn, grow, and improve your skills.
          </motion.p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={scrollToFeatured}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-8 py-3.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Browse Books
            </motion.button>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-slate-500 flex flex-col gap-1"
            >
              <div>Starting at ₹499</div>
              <div>Instant digital access • Secure checkout</div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="md:w-1/2"
        >
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Open digital book on tablet"
            className="rounded-2xl shadow-2xl object-cover"
          />
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-5 md:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'Secure Payment', desc: 'Your transactions are protected.' },
              { icon: Clock, title: 'Instant Delivery', desc: 'Get your book immediately after purchase.' },
              { icon: Headphones, title: '24/7 Support', desc: 'We are here to help anytime.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100 hover:shadow-md transition-shadow"
              >
                <item.icon className="w-12 h-12 mx-auto text-indigo-600 mb-6" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section ref={featuredRef} className="py-20 px-5 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Featured Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Categories Carousel */}
      {/* <section className="py-20 px-5 md:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Categories</h2>

          <div className="relative">
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex gap-6">
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    className="embla__slide flex-shrink-0 basis-[80%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%]"
                  >
                    <motion.div
                      whileHover={{ scale: 1.04, y: -4 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center h-full flex flex-col items-center justify-center"
                    >
                      <cat.icon className="w-10 h-10 text-indigo-600 mb-4" />
                      <h3 className="font-semibold text-lg mb-1">{cat.title}</h3>
                      <p className="text-sm text-slate-500">{cat.count} books</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-slate-50"
              aria-label="Previous category"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-slate-50"
              aria-label="Next category"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section> */}

      {/* Top Digital Books */}
      <section className="py-20 px-5 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Top Digital Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array(8)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {/* <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Shop All Books <ArrowRight size={18} />
          </Link>
        </div> */}
      </section>

      {/* Reviews */}
      <section className="py-20 px-5 md:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Readers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 italic text-slate-700 leading-relaxed"
              >
                “{review}”
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-5 md:px-10 lg:px-16 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Updates</h2>
        <p className="text-lg text-slate-600 mb-10">
          Subscribe to receive news about new books.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default IndexDummy;