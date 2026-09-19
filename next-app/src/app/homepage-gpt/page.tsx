"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CakeSlice,
  Check,
  ChevronDown,
  Gift,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import "./gpt.css";

type Category = "All" | "Cakes" | "Flowers" | "Combos";
type Weight = "500g" | "1kg" | "2kg";

type Product = {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  image: string;
  tag: string;
};

type CartLine = {
  key: string;
  productId: string;
  weight: Weight;
  message: string;
  quantity: number;
};

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;

const products: Product[] = [
  {
    id: "strawberry",
    name: "Strawberry Daydream",
    category: "Cakes",
    price: 649,
    image: photo("photo-1464305795204-6f5bbfc7fb81"),
    tag: "A little berry magic",
  },
  {
    id: "chocolate",
    name: "Chocolate Truffle",
    category: "Cakes",
    price: 599,
    image: photo("photo-1578985545062-69928b1d9587"),
    tag: "For chocolate lovers",
  },
  {
    id: "celebration",
    name: "The Celebration Cake",
    category: "Cakes",
    price: 799,
    image: photo("photo-1535141192574-5d4897c12636"),
    tag: "Made for big wishes",
  },
  {
    id: "roses",
    name: "A Handful of Love",
    category: "Flowers",
    price: 699,
    image: photo("photo-1563241527-3004b7be0ffd"),
    tag: "Say it with flowers",
  },
  {
    id: "combo",
    name: "The Birthday Edit",
    category: "Combos",
    price: 1299,
    image: photo("photo-1511795409834-ef04bbd61622"),
    tag: "A thoughtful pairing",
  },
];

const categories: Category[] = ["All", "Cakes", "Flowers", "Combos"];
const weights: Weight[] = ["500g", "1kg", "2kg"];
const multipliers: Record<Weight, number> = {
  "500g": 1,
  "1kg": 1.9,
  "2kg": 3.7,
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function priceFor(product: Product, weight: Weight) {
  return product.category === "Cakes"
    ? Math.round(product.price * multipliers[weight])
    : product.price;
}

type CartStore = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity">) => void;
  change: (key: string, delta: number) => void;
};

const useCart = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      add: (line) =>
        set((state) => {
          const exists = state.lines.some((item) => item.key === line.key);

          return {
            lines: exists
              ? state.lines.map((item) =>
                  item.key === line.key
                    ? { ...item, quantity: Math.min(item.quantity + 1, 20) }
                    : item,
                )
              : [...state.lines, { ...line, quantity: 1 }],
          };
        }),
      change: (key, delta) =>
        set((state) => ({
          lines: state.lines
            .map((line) =>
              line.key === key
                ? {
                    ...line,
                    quantity: Math.min(20, line.quantity + delta),
                  }
                : line,
            )
            .filter((line) => line.quantity > 0),
        })),
    }),
    {
      name: "cake-connection-cart-gpt-v1",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({ lines: state.lines }),
      merge: (persisted, current) => {
        const saved = persisted as { lines?: unknown } | undefined;
        const lines = Array.isArray(saved?.lines)
          ? saved.lines.filter(
              (line): line is CartLine =>
                !!line &&
                typeof line === "object" &&
                typeof line.key === "string" &&
                products.some((product) => product.id === line.productId) &&
                weights.includes(line.weight) &&
                typeof line.message === "string" &&
                line.message.length <= 30 &&
                Number.isInteger(line.quantity) &&
                line.quantity > 0 &&
                line.quantity <= 20,
            )
          : [];

        return { ...current, lines };
      },
    },
  ),
);

export default function HomepageGPT() {
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [weight, setWeight] = useState<Weight>("500g");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  const productDialog = useRef<HTMLDialogElement>(null);
  const cartDialog = useRef<HTMLDialogElement>(null);

  const { lines, add, change } = useCart();

  useEffect(() => {
    let active = true;
    Promise.resolve((useCart as any).persist?.rehydrate?.()).finally(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const visible = products.filter(
    (product) =>
      (category === "All" || product.category === category) &&
      product.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const subtotal = lines.reduce((total, line) => {
    const product = products.find((item) => item.id === line.productId);
    return product
      ? total + priceFor(product, line.weight) * line.quantity
      : total;
  }, 0);

  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49;
  const count = lines.reduce((total, line) => total + line.quantity, 0);

  function browse(next: Category) {
    setCategory(next);
    document.getElementById("collection")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function openProduct(product: Product) {
    setSelected(product);
    setWeight("500g");
    setMessage("");
    productDialog.current?.showModal();
  }

  function addSelected() {
    if (!selected || !ready) return;
    const text = message.trim();
    add({
      key: JSON.stringify([selected.id, weight, text]),
      productId: selected.id,
      weight,
      message: text,
    });
    productDialog.current?.close();
    setNotice(`${selected.name} added to your bag.`);
    cartDialog.current?.showModal();
  }

  return (
    <div className="gpt-scope">
      {/* Top Banner indicating GPT-5.6 Preview */}
      <div style={{ background: "#2E2E2E", color: "#FFF", textAlign: "center", padding: "8px 16px", fontSize: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>🤖 <strong>GPT-5.6 Redesign Prototype</strong> (Demo View)</span>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/" style={{ color: "#F7C8D0", textDecoration: "underline" }}>Main Website</Link>
          <Link href="/homepage2" style={{ color: "#C8F7D9", textDecoration: "underline" }}>Antigravity Homepage2</Link>
        </div>
      </div>

      <a className="skip-link" href="#main">Skip to content</a>

      <div className="announcement">
        A little sweetness, delivered. Free delivery on orders Rs. 999+
      </div>

      <header className="site-header">
        <div className="header-main wrap">
          <Link href="/homepage-gpt" className="brand" aria-label="Cake Connection home">
            <CakeSlice size={34} strokeWidth={1.3} />
            <span>
              Cake Connection
              <small>BAKED WITH LOVE. SENT WITH FEELING.</small>
            </span>
          </Link>

          <div className="location">
            <MapPin size={18} />
            <span>
              Delivering happiness in
              <strong>Vadodara, Gujarat</strong>
            </span>
          </div>

          <button
            className="bag-button"
            onClick={() => cartDialog.current?.showModal()}
            aria-label={`Open shopping bag, ${ready ? count : 0} items`}
          >
            <ShoppingBag size={21} />
            <span className="bag-label">Your bag</span>
            <span className="count">{ready ? count : 0}</span>
          </button>
        </div>

        <nav className="navigation wrap" aria-label="Main navigation">
          <div className="nav-links">
            {categories.map((item) => (
              <button key={item} onClick={() => browse(item)}>
                {item === "All" ? "All treats" : item}
                {item !== "All" && <ChevronDown size={12} />}
              </button>
            ))}
            <a href="#our-story">Our story</a>
          </div>
          <span className="eggless"><Leaf size={15} /> 100% eggless cakes</span>
        </nav>
      </header>

      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <span className="eyebrow">FROM OUR OVENS TO YOUR OCCASIONS</span>
            <h1>
              A little cake.<br />
              A whole lot<br />
              of <em>happiness.</em>
            </h1>
            <p>
              Beautiful eggless cakes, fresh blooms, and thoughtful gifts.
              For your favourite people in Vadodara.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={() => browse("Cakes")}>
                Find their favourite <ArrowRight size={18} />
              </button>
              <button className="text-button" onClick={() => browse("Combos")}>
                Explore gifts
              </button>
            </div>
            <div className="hero-note">
              <span className="little-line" />
              Made for birthdays, just-becauses &amp; everything in between.
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-arch">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo("photo-1535141192574-5d4897c12636")}
                alt="A celebration cake topped with fresh flowers"
                width={1000}
                height={1200}
              />
            </div>
            <div className="round-seal">100%<span>EGGLESS</span><Leaf size={21} /></div>
            <div className="photo-note">
              <span>A wish. A smile. A slice.</span>
              <small>Let the celebration begin.</small>
            </div>
            <span className="art-caption">THE CELEBRATION COLLECTION / 01</span>
          </div>
        </section>

        <section className="benefits" aria-label="Store benefits">
          <div className="wrap benefit-grid">
            <div><Leaf /><span>100% eggless<small>All joy. No compromises.</small></span></div>
            <div><Truck /><span>Local delivery<small>Across Vadodara</small></span></div>
            <div><Gift /><span>Thoughtful gifting<small>Even from miles away</small></span></div>
            <div><CakeSlice /><span>A personal touch<small>Your message on their cake</small></span></div>
          </div>
        </section>

        <section id="collection" className="collection wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE HAPPINESS EDIT</span>
              <h2>Find your celebration.</h2>
            </div>
            <p>A little something for every kind of love.</p>
          </div>

          <div className="catalog-toolbar">
            <div className="filters" aria-label="Filter products">
              {categories.map((item) => (
                <button
                  key={item}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="search">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find something sweet"
                aria-label="Search products"
                type="search"
              />
            </label>
          </div>

          <div className="product-grid">
            {visible.map((product) => (
              <article className="product-card" key={product.id}>
                <button
                  className="product-image"
                  onClick={() => openProduct(product)}
                  aria-label={`View ${product.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    width={600}
                    height={700}
                  />
                  <span className="product-tag">{product.tag}</span>
                  <span className="quick-add"><Plus size={20} /></span>
                </button>
                <div className="product-meta">
                  <span>{product.category}</span>
                  {product.category === "Cakes" && <span className="veg">Eggless</span>}
                </div>
                <h3>
                  <button onClick={() => openProduct(product)}>{product.name}</button>
                </h3>
                <p className="price">
                  {money(product.price)}
                  <span>{product.category === "Cakes" ? " / 500g" : " / arrangement"}</span>
                </p>
              </article>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="empty">
              <h3>No treats found.</h3>
              <p>Try another search or browse the complete collection.</p>
              <button
                className="primary"
                onClick={() => { setSearch(""); setCategory("All"); }}
              >
                Show all treats
              </button>
            </div>
          )}
          <p className="demo-note">Preview collection: sample products, photography, and prices.</p>
        </section>

        <section className="gifting wrap">
          <div className="gifting-copy">
            <span className="eyebrow">FAR AWAY. CLOSE AT HEART.</span>
            <h2>You send the love.<br />We bring the <em>sweetness.</em></h2>
            <p>
              Across the country or across the world, make someone in
              Vadodara feel a little closer with cakes, flowers, and gifts.
            </p>
            <button className="primary" onClick={() => browse("Combos")}>
              Discover gift combos <ArrowRight size={18} />
            </button>
          </div>
          <div className="gift-illustration" aria-hidden="true">
            <div className="gift-circle"><Gift size={115} strokeWidth={0.8} /></div>
            <span>Distance is just a number.</span>
          </div>
        </section>

        <section className="story wrap" id="our-story">
          <span className="eyebrow">YOUR NEIGHBOURHOOD. YOUR CELEBRATIONS.</span>
          <h2>Rooted in Vadodara.<br />Made for the moments that matter.</h2>
          <p>
            At Cake Connection, we believe the best gifts feel personal.
            A favourite flavour. A heartfelt message. A surprise that says
            &quot;I&apos;m thinking of you.&quot;
          </p>
          <div className="story-signature">With love, Cake Connection</div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-main">
          <Link href="/homepage-gpt" className="brand"><CakeSlice /> Cake Connection</Link>
          <p>Little gestures. Beautiful celebrations.</p>
          <a href="#collection">Explore the collection <ArrowRight size={16} /></a>
        </div>
        <div className="wrap footer-bottom">
          <span>Cake Connection · Vadodara, Gujarat</span>
          <span>100% eggless. A whole lot of love.</span>
        </div>
      </footer>

      <p className="sr-only" role="status">{notice}</p>

      <dialog ref={productDialog} className="modal" aria-labelledby="product-title">
        <button
          className="close-button"
          onClick={() => productDialog.current?.close()}
          aria-label="Close product"
        ><X /></button>

        {selected && (
          <>
            <span className="eyebrow">{selected.category}</span>
            <h2 id="product-title">{selected.name}</h2>
            <p className="modal-price">{money(priceFor(selected, weight))}</p>

            {selected.category === "Cakes" && (
              <>
                <fieldset>
                  <legend>Choose cake weight</legend>
                  <div className="weight-options">
                    {weights.map((option) => (
                      <button
                        key={option}
                        aria-pressed={weight === option}
                        onClick={() => setWeight(option)}
                      >{option}</button>
                    ))}
                  </div>
                </fieldset>
                <label className="message-label" htmlFor="cake-message">
                  Message on cake <span>Optional</span>
                </label>
                <input
                  id="cake-message"
                  className="message-input"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={30}
                  placeholder="Happy Birthday, Mom!"
                />
                <small>{message.length}/30 characters</small>
              </>
            )}

            <p className="modal-disclaimer">
              Demo pricing. Delivery availability and final prices must be
              confirmed at checkout.
            </p>
            <button className="primary full-width" disabled={!ready} onClick={addSelected}>
              {ready ? "Add to bag" : "Loading your bag"}
              <ShoppingBag size={18} />
            </button>
          </>
        )}
      </dialog>

      <dialog ref={cartDialog} className="modal cart-modal" aria-labelledby="cart-title">
        <button
          className="close-button"
          onClick={() => cartDialog.current?.close()}
          aria-label="Close shopping bag"
        ><X /></button>
        <span className="eyebrow">A LITTLE HAPPINESS TO GO</span>
        <h2 id="cart-title">Your bag</h2>

        {!ready ? <p>Loading your bag...</p> : !lines.length ? (
          <div className="empty">
            <ShoppingBag size={36} />
            <p>Your next celebration starts with something sweet.</p>
            <button className="primary" onClick={() => cartDialog.current?.close()}>
              Keep exploring
            </button>
          </div>
        ) : (
          <>
            {lines.map((line) => {
              const product = products.find((item) => item.id === line.productId);
              if (!product) return null;
              return (
                <div className="cart-line" key={line.key}>
                  <div>
                    <strong>{product.name}</strong>
                    {product.category === "Cakes" && <small>{line.weight}</small>}
                    {line.message && <small>Message: {line.message}</small>}
                    <span>{money(priceFor(product, line.weight) * line.quantity)}</span>
                  </div>
                  <div className="quantity">
                    <button onClick={() => change(line.key, -1)} aria-label={`Decrease ${product.name} quantity`}><Minus size={15} /></button>
                    <span>{line.quantity}</span>
                    <button disabled={line.quantity >= 20} onClick={() => change(line.key, 1)} aria-label={`Increase ${product.name} quantity`}><Plus size={15} /></button>
                  </div>
                </div>
              );
            })}
            <div className="delivery-note">
              <Check size={17} />
              {subtotal >= 999
                ? "Your bag qualifies for free delivery."
                : `Add ${money(999 - subtotal)} more for free delivery.`}
            </div>
            <div className="total-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="total-row"><span>Delivery estimate</span><span>{delivery ? money(delivery) : "Free"}</span></div>
            <div className="total-row grand-total"><strong>Estimated total</strong><strong>{money(subtotal + delivery)}</strong></div>
            <p className="modal-disclaimer">
              Checkout is not connected in this homepage preview.
              COD adds Rs. 29 when selected. Final prices, discounts, and
              delivery eligibility require server validation.
            </p>
            <button className="primary full-width" onClick={() => cartDialog.current?.close()}>
              Continue browsing <ArrowRight size={18} />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}
