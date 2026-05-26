import { useState, useMemo } from 'react';
import { PageContainer, ModulePageHeader } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Truck,
  ShoppingCart,
  Store,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Search,
  Eye,
} from 'lucide-react';
import styles from './ShopBuilderPage.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
  imageUrl: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ product: Product; quantity: number }>;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

const INITIAL_PRODUCTS: Product[] = [
  // Merchandise
  { id: 'p-1', name: 'Premium University Hoodie', description: 'Heavyweight organic cotton hoodie with embroidered college crest.', category: 'Merchandise', price: 1499, stock: 45, sku: 'UOS-HOOD-01', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150&auto=format&fit=crop&q=60' },
  { id: 'p-2', name: 'Insulated Sports Water Bottle', description: 'Double-walled stainless steel bottle, keeps drinks cold for 24h.', category: 'Merchandise', price: 499, stock: 120, sku: 'UOS-BOTL-02', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150&auto=format&fit=crop&q=60' },
  // Workshop Tickets
  { id: 'p-3', name: 'AI & Data Science Masterclass Pass', description: 'Entry ticket for 2-day boot camp with industry experts. Includes lunch.', category: 'Workshop Tickets', price: 299, stock: 85, sku: 'UOS-TICK-AI', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=150&auto=format&fit=crop&q=60' },
  { id: 'p-4', name: 'Creative Writing Workshop', description: 'Interactive seminar hosted by award-winning novelist Sarah Jenkins.', category: 'Workshop Tickets', price: 199, stock: 5, sku: 'UOS-TICK-CW', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=150&auto=format&fit=crop&q=60' },
  // Study Materials
  { id: 'p-5', name: 'Calculus I Study Companion', description: 'Comprehensive practice exams, formulas cheat sheet, and step-by-step guides.', category: 'Study Materials', price: 399, stock: 60, sku: 'UOS-BOOK-CALC', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150&auto=format&fit=crop&q=60' },
  { id: 'p-6', name: 'Organic Chemistry Reference Guide', description: 'Pocket handbook for molecular structures, reactions, and mechanisms.', category: 'Study Materials', price: 599, stock: 0, sku: 'UOS-BOOK-CHEM', status: 'Out of Stock', imageUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=150&auto=format&fit=crop&q=60' },
  // Event Passes
  { id: 'p-7', name: 'Annual Cultural Fest 3-Day Pass', description: 'All-access wristband for concerts, exhibitions, and college debates.', category: 'Event Passes', price: 999, stock: 250, sku: 'UOS-PASS-CULT', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=150&auto=format&fit=crop&q=60' },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-5502',
    customerName: 'Sahil Sharma',
    customerEmail: 'aditya.sen@gmail.com',
    items: [{ product: INITIAL_PRODUCTS[0], quantity: 1 }, { product: INITIAL_PRODUCTS[1], quantity: 2 }],
    total: 2497,
    status: 'Processing',
    date: '2026-05-21 12:10',
  },
  {
    id: 'ORD-5491',
    customerName: 'Meera Nair',
    customerEmail: 'meera.n@yahoo.com',
    items: [{ product: INITIAL_PRODUCTS[4], quantity: 1 }],
    total: 399,
    status: 'Shipped',
    date: '2026-05-20 16:30',
  },
];

export function ShopBuilderPage() {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'shop-preview'>('dashboard');

  // Products and Orders database state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [categories] = useState<string[]>(['Merchandise', 'Workshop Tickets', 'Study Materials', 'Event Passes']);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Product editor modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Shop Preview State
  const [previewCart, setPreviewCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [submittingCheckout, setSubmittingCheckout] = useState(false);
  const [previewCategory, setPreviewCategory] = useState('All');

  // Inventory Dashboard metrics
  const metrics = useMemo(() => {
    const activeCount = products.filter((p) => p.status === 'Active').length;
    const lowStockCount = products.filter((p) => p.status === 'Active' && p.stock <= 5).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);

    return {
      activeCount,
      lowStockCount,
      outOfStockCount,
      totalRevenue,
      totalSales: orders.length,
    };
  }, [products, orders]);

  // Handle opening editor for Add
  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      description: '',
      category: categories[0] || 'Merchandise',
      price: 0,
      stock: 10,
      sku: `UOS-NEW-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Draft',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=60',
    });
    setShowProductModal(true);
  };

  // Handle opening editor for Edit
  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setShowProductModal(true);
  };

  // Save product (Add/Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.id) {
      // Add new
      const newProduct: Product = {
        ...(editingProduct as Omit<Product, 'id'>),
        id: `p-${Date.now()}`,
        status: editingProduct.stock === 0 ? 'Out of Stock' : editingProduct.status || 'Active',
      };
      setProducts((prev) => [newProduct, ...prev]);
      notify({
        type: 'success',
        title: 'Product Created',
        message: `Product "${newProduct.name}" added to inventory successfully.`,
      });
    } else {
      // Update existing
      const updatedId = editingProduct.id;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updatedId
            ? ({
                ...editingProduct,
                status: editingProduct.stock === 0 ? 'Out of Stock' : editingProduct.status || 'Active',
              } as Product)
            : p
        )
      );
      notify({
        type: 'success',
        title: 'Product Updated',
        message: `Changes saved for "${editingProduct.name}".`,
      });
    }

    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notify({
      type: 'warning',
      title: 'Product Deleted',
      message: `Product "${product.name}" removed from shop database.`,
    });
  };

  // Filtered products for admin inventory
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Shop Preview: Add product to cart
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      notify({
        type: 'error',
        title: 'Out of Stock',
        message: `Sorry, "${product.name}" is currently unavailable.`,
      });
      return;
    }

    setPreviewCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          notify({
            type: 'warning',
            title: 'Stock Limit Reached',
            message: `You cannot purchase more than ${product.stock} units of ${product.name}.`,
          });
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    notify({
      type: 'success',
      title: 'Added to Cart',
      message: `Added 1x "${product.name}" to cart.`,
      duration: 2000,
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setPreviewCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product && quantity > product.stock) {
      notify({
        type: 'warning',
        title: 'Stock Limit Reached',
        message: `Only ${product.stock} units available.`,
      });
      return;
    }

    setPreviewCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const cartTotal = useMemo(() => {
    return previewCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [previewCart]);

  // Shop Preview Checkout Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail) return;

    setSubmittingCheckout(true);

    setTimeout(() => {
      // Create new order
      const newOrder: Order = {
        id: `ORD-${Math.floor(5500 + Math.random() * 4500)}`,
        customerName: checkoutName,
        customerEmail: checkoutEmail,
        items: [...previewCart],
        total: cartTotal,
        status: 'Pending',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };

      // Deduct stock in DB
      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = previewCart.find((item) => item.product.id === p.id);
          if (cartItem) {
            const newStock = Math.max(0, p.stock - cartItem.quantity);
            return {
              ...p,
              stock: newStock,
              status: newStock === 0 ? ('Out of Stock' as const) : p.status,
            };
          }
          return p;
        })
      );

      setOrders((prev) => [newOrder, ...prev]);
      setPreviewCart([]);
      setCheckoutName('');
      setCheckoutEmail('');
      setShowCheckoutModal(false);
      setSubmittingCheckout(false);

      notify({
        type: 'success',
        title: 'Order Completed!',
        message: `Thank you! Simulated order ${newOrder.id} has been registered in the system.`,
      });
    }, 1500);
  };

  // Filtered products for Student Shop Preview
  const previewProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = previewCategory === 'All' || p.category === previewCategory;
      const isVisible = p.status === 'Active' || p.status === 'Out of Stock';
      return matchesCategory && isVisible;
    });
  }, [products, previewCategory]);

  return (
    <PageContainer breadcrumbs={[{ label: 'Builders' }, { label: 'Shop Builder' }]}>
      <ModulePageHeader
        title="Shop Builder"
        subtitle="Configure campus store products, checkout, and orders."
      />
      <nav className="ml-tabs">
        <button type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`ml-tab ${activeTab === 'dashboard' ? 'ml-tab-active' : ''}`}
        >
          <Store size={16} />
          <span>Shop Dashboard</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('inventory')}
          className={`ml-tab ${activeTab === 'inventory' ? 'ml-tab-active' : ''}`}
        >
          <Package size={16} />
          <span>Product Inventory</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('orders')}
          className={`ml-tab ${activeTab === 'orders' ? 'ml-tab-active' : ''}`}
        >
          <Truck size={16} />
          <span>Order Dispatch Log</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('shop-preview')}
          className={`ml-tab ${activeTab === 'shop-preview' ? 'ml-tab-active' : ''} ${styles.shopPreviewTabLink}`}
        >
          <ShoppingCart size={16} />
          <span>Student Store Preview</span>
        </button>
      </nav>

      {/* Content Area */}
      <div className={`ml-tab-panel ${styles.tabContent}`}>
        {/* SHOP DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className={styles.dashboardContainer}>
            {/* Stat Row */}
            <div className={styles.statsGrid}>
              <Card padding="md" variant="default" className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span>Total Store Sales</span>
                  <TrendingUp size={16} className={styles.greenText} />
                </div>
                <h3>{metrics.totalSales} Orders</h3>
                <p>Simulated student transactions</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span>Store Revenue</span>
                  <DollarSign size={16} className={styles.goldText} />
                </div>
                <h3>₹{metrics.totalRevenue.toLocaleString('en-IN')}</h3>
                <p>Calculated checkout totals</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span>Active Catalog Items</span>
                  <Package size={16} />
                </div>
                <h3>{metrics.activeCount} Products</h3>
                <p>Across {categories.length} categories</p>
              </Card>

              <Card padding="md" variant="bordered" className={`${styles.statCard} ${metrics.lowStockCount > 0 || metrics.outOfStockCount > 0 ? styles.statCardWarning : ''}`}>
                <div className={styles.statHeader}>
                  <span>Stock Alert</span>
                  <AlertTriangle size={16} className={styles.orangeText} />
                </div>
                <h3>{metrics.outOfStockCount} Out, {metrics.lowStockCount} Low</h3>
                <p>Action required in Inventory</p>
              </Card>
            </div>

            {/* Dashboard Double Column */}
            <div className={styles.dashboardSplit}>
              {/* Recent Orders */}
              <div className={styles.dashboardColLeft}>
                <Card padding="md" variant="default">
                  <CardHeader title="Recent Orders" subtitle="Orders placed through store front" />
                  <CardBody>
                    <div className={styles.dashboardOrderList}>
                      {orders.slice(0, 3).map((o) => (
                        <div key={o.id} className={styles.orderSummaryItem}>
                          <div className={styles.orderSummaryMeta}>
                            <strong>{o.id}</strong>
                            <span>{o.date}</span>
                          </div>
                          <div className={styles.orderSummaryCust}>
                            <strong>{o.customerName}</strong>
                            <p>{o.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}</p>
                          </div>
                          <div className={styles.orderSummaryTotal}>
                            <strong>₹{o.total}</strong>
                            <span className={styles[`orderStatus-${o.status}`]}>{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Quick Actions / Categories */}
              <div className={styles.dashboardColRight}>
                <Card padding="md" variant="bordered">
                  <CardHeader title="Category Breakdown" subtitle="Configured catalog sections" />
                  <CardBody>
                    <div className={styles.categoryCountList}>
                      {categories.map((cat) => {
                        const count = products.filter((p) => p.category === cat).length;
                        return (
                          <div key={cat} className={styles.categoryCountRow}>
                            <span>{cat}</span>
                            <strong>{count} items</strong>
                          </div>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TABLE */}
        {activeTab === 'inventory' && (
          <div className={styles.inventoryContainer}>
            <div className={styles.filterBar}>
              <div className={styles.searchWrap}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search SKU or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={handleOpenAddProduct} className={styles.addProdBtn}>
                Add New Product
              </Button>
            </div>

            <Card padding="none" variant="default" className={styles.tableCard}>
              <table className={styles.inventoryTable}>
                <thead>
                  <tr>
                    <th>Item Details</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>In Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={styles.emptyTable}>
                        No products match your filters. Click 'Add New Product' to expand the store.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className={styles.productCell}>
                            <img src={p.imageUrl} alt={p.name} className={styles.productThumb} />
                            <div>
                              <strong>{p.name}</strong>
                              <p className={styles.productDescTrim}>{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className={styles.skuText}>{p.sku}</td>
                        <td>{p.category}</td>
                        <td className={styles.priceCol}>₹{p.price.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={p.stock <= 5 ? styles.stockLow : styles.stockOk}>{p.stock} units</span>
                        </td>
                        <td>
                          <StageChip stage={p.status === 'Active' ? 'green' : p.status === 'Draft' ? 'yellow' : 'gray'} label={p.status} />
                        </td>
                        <td>
                          <div className={styles.actionsGroup}>
                            <button type="button" className={styles.editActionBtn} onClick={() => handleOpenEditProduct(p)} title="Edit Item">
                              <Edit2 size={12} />
                            </button>
                            <button type="button" className={styles.deleteActionBtn} onClick={() => handleDeleteProduct(p.id)} title="Delete Item">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ORDER DISPATCH LOG */}
        {activeTab === 'orders' && (
          <div className={styles.ordersContainer}>
            <div className={styles.ordersHeader}>
              <h3>Active Dispatch Processing</h3>
              <p>Simulate order fulfillment and status transitions below:</p>
            </div>

            <div className={styles.ordersGrid}>
              {orders.length === 0 ? (
                <div className={styles.emptyOrders}>No orders registered yet. Go to the 'Student Store Preview' tab and check out some items!</div>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} padding="md" variant="bordered" className={styles.orderCard}>
                    <div className={styles.orderCardHead}>
                      <div>
                        <strong>{order.id}</strong>
                        <p>{order.date}</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const val = e.target.value as Order['status'];
                          setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: val } : o)));
                          notify({ type: 'info', title: 'Order Updated', message: `${order.id} status changed to ${val}.` });
                        }}
                        className={`${styles.orderStatusDropdown} ${styles[`orderStatusDropdown-${order.status}`]}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className={styles.orderCardBody}>
                      <div className={styles.custMeta}>
                        <strong>Customer Details:</strong>
                        <p>{order.customerName} ({order.customerEmail})</p>
                      </div>
                      <div className={styles.orderedItems}>
                        <strong>Items:</strong>
                        <ul>
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.quantity}x {item.product.name} (₹{item.product.price} ea.)
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={styles.orderCardFoot}>
                      <span>Total Amount:</span>
                      <strong>₹{order.total.toLocaleString('en-IN')}</strong>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* STUDENT STORE FRONT PREVIEW */}
        {activeTab === 'shop-preview' && (
          <div className={styles.previewShopLayout}>
            {/* Catalog Area */}
            <div className={styles.previewCatalog}>
              <div className={styles.catalogHeader}>
                <div className={styles.titleArea}>
                  <Eye size={16} className={styles.goldText} />
                  <h3>Student Storefront</h3>
                </div>
                <div className={styles.catalogFilterTags}>
                  <button type="button"
                    onClick={() => setPreviewCategory('All')}
                    className={`${styles.categoryTagBtn} ${previewCategory === 'All' ? styles.categoryTagBtnActive : ''}`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button type="button"
                      key={c}
                      onClick={() => setPreviewCategory(c)}
                      className={`${styles.categoryTagBtn} ${previewCategory === c ? styles.categoryTagBtnActive : ''}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.shopProductGrid}>
                {previewProducts.map((p) => {
                  const isOutOfStock = p.stock === 0;
                  return (
                    <div key={p.id} className={styles.shopGridCard}>
                      <div className={styles.gridCardThumbWrap}>
                        <img src={p.imageUrl} alt={p.name} className={styles.gridCardThumb} />
                        {isOutOfStock && <div className={styles.outOfStockOverlay}>Out of Stock</div>}
                      </div>
                      <div className={styles.gridCardInfo}>
                        <span className={styles.cardCatTag}>{p.category}</span>
                        <h4>{p.name}</h4>
                        <p className={styles.cardDesc}>{p.description}</p>
                        <div className={styles.cardPriceRow}>
                          <span className={styles.gridCardPrice}>₹{p.price}</span>
                          <span className={styles.gridCardStock}>{isOutOfStock ? 'Sold Out' : `${p.stock} in stock`}</span>
                        </div>
                        <Button
                          variant={isOutOfStock ? 'ghost' : 'gold'}
                          size="sm"
                          fullWidth
                          disabled={isOutOfStock}
                          icon={<ShoppingCart size={12} />}
                          onClick={() => handleAddToCart(p)}
                        >
                          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shopping Cart Sidebar */}
            <div className={styles.previewCartSidebar}>
              <Card padding="md" variant="bordered" className={styles.cartCard}>
                <div className={styles.cartHeader}>
                  <ShoppingCart size={18} />
                  <span>Student Cart ({previewCart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                </div>
                <CardBody className={styles.cartBody}>
                  {previewCart.length === 0 ? (
                    <div className={styles.emptyCartMsg}>
                      <p>Your shopping cart is empty.</p>
                      <span>Add items from the store to test checkout.</span>
                    </div>
                  ) : (
                    <div className={styles.cartItemsList}>
                      {previewCart.map((item) => (
                        <div key={item.product.id} className={styles.cartRowItem}>
                          <div className={styles.cartRowDetails}>
                            <strong>{item.product.name}</strong>
                            <span>₹{item.product.price}</span>
                          </div>
                          <div className={styles.cartRowQty}>
                            <input
                              type="number"
                              min="0"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) => handleUpdateCartQuantity(item.product.id, parseInt(e.target.value) || 0)}
                              className={styles.cartQtyInput}
                            />
                            <button type="button"
                              onClick={() => handleUpdateCartQuantity(item.product.id, 0)}
                              className={styles.cartDeleteBtn}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className={styles.cartTotalDivider} />

                      <div className={styles.cartSum}>
                        <span>Subtotal:</span>
                        <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                      </div>

                      <Button variant="primary" fullWidth onClick={() => setShowCheckoutModal(true)}>
                        Proceed to Checkout
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Simulated Checkout Modal */}
            {showCheckoutModal && (
              <div className={styles.modalOverlay}>
                <form onSubmit={handleCheckoutSubmit} className={styles.checkoutFormModal}>
                  <h3>Student Checkout Gateway</h3>
                  <p className={styles.modalDesc}>Complete transaction information below.</p>

                  <div className={styles.paymentSum}>
                    <span>Subtotal:</span>
                    <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className={styles.ccForm}>
                    <label>
                      <span>Full Name</span>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        className={styles.modalInput}
                      />
                    </label>

                    <label>
                      <span>Email Address</span>
                      <input
                        type="email"
                        required
                        placeholder="john.doe@college.edu"
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        className={styles.modalInput}
                      />
                    </label>

                    <label>
                      <span>Card Number</span>
                      <input type="text" required placeholder="4111 2222 3333 4444" className={styles.modalInput} />
                    </label>

                    <div className={styles.ccRow}>
                      <label>
                        <span>Expiration</span>
                        <input type="text" required placeholder="MM/YY" className={styles.modalInput} />
                      </label>
                      <label>
                        <span>CVV</span>
                        <input type="password" required placeholder="123" className={styles.modalInput} />
                      </label>
                    </div>
                  </div>

                  <div className={styles.modalFooter}>
                    <Button variant="ghost" onClick={() => setShowCheckoutModal(false)} disabled={submittingCheckout}>
                      Cancel
                    </Button>
                    <Button variant="gold" type="submit" disabled={submittingCheckout} icon={<ShoppingCart size={14} />}>
                      {submittingCheckout ? 'Authorizing Payment...' : 'Pay & Order'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showProductModal && editingProduct && (
        <div className={styles.modalOverlay}>
          <form onSubmit={handleSaveProduct} className={styles.productFormModal}>
            <h3>{editingProduct.id ? 'Edit Inventory Product' : 'Add Catalog Product'}</h3>
            <p className={styles.modalDesc}>Modify college store catalog settings.</p>

            <div className={styles.ccForm}>
              <label>
                <span>Product Name</span>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className={styles.modalInput}
                />
              </label>

              <label>
                <span>Description</span>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className={styles.settingTextarea}
                />
              </label>

              <div className={styles.ccRow}>
                <label>
                  <span>Category</span>
                  <select
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className={styles.settingSelect}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>SKU Code</span>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className={styles.modalInput}
                  />
                </label>
              </div>

              <div className={styles.ccRow}>
                <label>
                  <span>Price (₹)</span>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                    className={styles.modalInput}
                  />
                </label>

                <label>
                  <span>Stock Quantity</span>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) ?? 0 })}
                    className={styles.modalInput}
                  />
                </label>
              </div>

              <label>
                <span>Image URL</span>
                <input
                  type="text"
                  required
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className={styles.modalInput}
                />
              </label>

              <label>
                <span>Status</span>
                <select
                  value={editingProduct.status || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as Product['status'] })}
                  className={styles.settingSelect}
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Draft">Draft (Internal)</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </label>
            </div>

            <div className={styles.modalFooter}>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingProduct.id ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </PageContainer>
  );
}
