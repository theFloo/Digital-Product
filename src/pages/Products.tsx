import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Grid,
  List,
  BookOpen,
  Brain,
  Code,
  Database,
  ImageIcon,
  Laptop,
  Package,
  Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { API_BASE } from "@/config/api";

/* ============================================================
   Types
============================================================ */
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  rating?: number;
  image: string;
  category: string;
}

type ViewMode = "grid" | "list";
type SortOption = "popular" | "price-low" | "price-high" | "rating";

/* ============================================================
   Constants
============================================================ */
const PRODUCTS_PER_PAGE = 9;
const API_BASE_URL = API_BASE;

interface CategoryConfig {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
}

const CATEGORIES: CategoryConfig[] = [
  { icon: Brain, title: "AI Packs", count: 161 },
  { icon: Laptop, title: "Courses", count: 108 },
  { icon: Database, title: "Databases", count: 12 },
  { icon: BookOpen, title: "EBooks", count: 48 },
  { icon: Package, title: "DigiTac Bundles", count: 64 },
  { icon: ImageIcon, title: "Graphics", count: 248 },
  { icon: Palette, title: "Design Assets", count: 92 },
  { icon: Code, title: "Web & Code", count: 76 },
];

const ALL_CATEGORY = "All";

/* ============================================================
   Skeleton Loader
============================================================ */
const ProductSkeleton = () => (
  <div className="rounded-lg border bg-white p-4 animate-pulse">
    <div className="aspect-[3/4] w-full bg-gray-200 rounded-md mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

/* ============================================================
   Component
============================================================ */
const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORY);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const searchTimeoutRef = useRef<number | null>(null);

  /* ============================================================
     Fetch Products (API-ready)
  ============================================================ */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (API_BASE_URL) {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ProductType[] = await res.json();
        setProducts(data);
        localStorage.setItem("products", JSON.stringify(data));
      } else {
        const stored = localStorage.getItem("products");
        setProducts(stored ? JSON.parse(stored) : []);
      }
    } catch {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ============================================================
     Reset pagination on filter changes
  ============================================================ */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  /* ============================================================
     Debounced Search (with cleanup)
  ============================================================ */
  const handleSearchChange = useCallback((value: string) => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setSearchTerm(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  /* ============================================================
     Filtering & Sorting
  ============================================================ */
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const text = `${product.name} ${product.description}`.toLowerCase();
        const matchesSearch = text.includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === ALL_CATEGORY ||
          product.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return (b.rating ?? 0) - (a.rating ?? 0);
          default:
            return 0;
        }
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  /* ============================================================
     Pagination
  ============================================================ */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const pageNumbers = useMemo(() => {
    const range = 2;
    const pages: number[] = [];

    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  /* ============================================================
     Render
  ============================================================ */
  return (
    <>
      <Helmet>
        <title>Products | The Floo Hub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">Our Products</h1>
            <p className="text-gray-600">
              Browse our digital products collection
            </p>
          </header>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              aria-label="Search products"
              placeholder="Search products..."
              className="pl-10"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Button
              size="sm"
              variant={selectedCategory === ALL_CATEGORY ? "default" : "outline"}
              onClick={() => setSelectedCategory(ALL_CATEGORY)}
            >
              All
            </Button>

            {CATEGORIES.map(({ title, icon: Icon }) => (
              <Button
                key={title}
                size="sm"
                variant={selectedCategory === title ? "default" : "outline"}
                onClick={() => setSelectedCategory(title)}
                className="flex items-center gap-1"
              >
                <Icon className="h-4 w-4" />
                {title}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            <select
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="popular">Default</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Rating</option>
            </select>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button className="mt-4" onClick={fetchProducts}>
                Retry
              </Button>
            </div>
          ) : currentProducts.length === 0 ? (
            <p className="text-center text-gray-600">No products found</p>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={currentPage === 1}
                      onClick={() =>
                        currentPage > 1 &&
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                    />
                  </PaginationItem>

                  {pageNumbers[0] > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationEllipsis />
                    </>
                  )}

                  {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                      <PaginationEllipsis />
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={currentPage === totalPages}
                      onClick={() =>
                        currentPage < totalPages &&
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
