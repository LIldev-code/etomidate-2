"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiLogOut, FiLoader, FiShoppingCart, FiClock, FiDollarSign, FiMessageSquare,
  FiPackage, FiSettings, FiMail, FiEdit2, FiSave, FiX, FiTrash2, FiCheckCircle,
  FiAlertCircle, FiPlus, FiHome, FiChevronRight, FiMenu, FiEye, FiUpload, FiImage,
} from "react-icons/fi";

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => setAuthenticated(true))
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const fetchData = useCallback(async () => {
    const [oR, pR, sR, mR] = await Promise.all([
      fetch("/api/orders"), fetch("/api/products"), fetch("/api/settings"), fetch("/api/contact"),
    ]);
    if (oR.ok) setOrders((await oR.json()).orders || []);
    if (pR.ok) setProducts((await pR.json()).products || []);
    if (sR.ok) setSettings((await sR.json()).settings || {});
    if (mR.ok) setMessages((await mR.json()).messages || []);
  }, []);

  useEffect(() => { if (authenticated) fetchData(); }, [authenticated, fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <FiLoader className="w-8 h-8 text-[#10b981] animate-spin" />
      </div>
    );
  }
  if (!authenticated) return null;

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);

  const navItems = [
    { id: "overview", label: "Overview", icon: <FiHome className="w-5 h-5" /> },
    { id: "orders", label: "Orders", icon: <FiShoppingCart className="w-5 h-5" />, badge: pendingOrders },
    { id: "products", label: "Products", icon: <FiPackage className="w-5 h-5" />, badge: products.length },
    { id: "messages", label: "Messages", icon: <FiMail className="w-5 h-5" />, badge: messages.length },
    { id: "settings", label: "Settings", icon: <FiSettings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#111] to-[#0a0a0a] border-r border-[#1e1e1e] flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-[#1e1e1e] bg-gradient-to-r from-[#10b981]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/20 flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin Panel</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">BuyEtomidateProducts</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === item.id
                  ? "bg-gradient-to-r from-[#10b981]/15 to-[#10b981]/5 text-[#10b981] border border-[#10b981]/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5 hover:border hover:border-[#262626] border border-transparent"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                tab === item.id ? "bg-[#10b981]/20" : "bg-[#1a1a1a]"
              }`}>
                {item.icon}
              </div>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  tab === item.id ? "bg-[#10b981] text-black" : "bg-[#1e1e1e] text-gray-400"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1e1e1e]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 hover:border hover:border-red-400/20 transition-all duration-200 border border-transparent"
          >
            <FiLogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0a0a0a]/90 to-[#111]/90 backdrop-blur-xl border-b border-[#1e1e1e] px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 text-gray-400 transition-colors">
                <FiMenu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <FiChevronRight className="w-3 h-3" />
                <span className="text-white capitalize font-medium">{tab}</span>
              </div>
            </div>
            <a href="/" target="_blank" className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#10b981] hover:bg-[#10b981]/5 px-3 py-2 rounded-xl transition-all duration-200">
              <FiEye className="w-3.5 h-3.5" />
              View Site
            </a>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-4 lg:p-8">
          {tab === "overview" && <OverviewTab orders={orders} products={products} messages={messages} revenue={revenue} pendingOrders={pendingOrders} setTab={setTab} />}
          {tab === "orders" && <OrdersTab orders={orders} onRefresh={fetchData} />}
          {tab === "products" && <ProductsTab products={products} onRefresh={fetchData} />}
          {tab === "messages" && <MessagesTab messages={messages} />}
          {tab === "settings" && <SettingsTab settings={settings} onRefresh={fetchData} />}
        </main>
      </div>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ orders, products, messages, revenue, pendingOrders, setTab }) {
  const stats = [
    { label: "Total Orders", value: orders.length, icon: <FiShoppingCart className="w-5 h-5" />, color: "text-[#10b981] bg-[#10b981]/10", click: "orders" },
    { label: "Pending", value: pendingOrders, icon: <FiClock className="w-5 h-5" />, color: "text-yellow-400 bg-yellow-400/10", click: "orders" },
    { label: "Revenue", value: `$${revenue.toFixed(2)}`, icon: <FiDollarSign className="w-5 h-5" />, color: "text-green-400 bg-green-400/10" },
    { label: "Products", value: products.length, icon: <FiPackage className="w-5 h-5" />, color: "text-blue-400 bg-blue-400/10", click: "products" },
    { label: "Messages", value: messages.length, icon: <FiMessageSquare className="w-5 h-5" />, color: "text-purple-400 bg-purple-400/10", click: "messages" },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#10b981]/5 to-transparent rounded-2xl p-6 border border-[#1e1e1e]">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-sm text-gray-400">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, index) => (
          <button
            key={s.label}
            onClick={() => s.click && setTab(s.click)}
            className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#1e1e1e] rounded-2xl p-5 text-left hover:border-[#10b981]/30 hover:shadow-lg hover:shadow-[#10b981]/10 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4 relative z-10`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-white relative z-10">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 relative z-10">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e] bg-gradient-to-r from-[#10b981]/3 to-transparent">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <button onClick={() => setTab("orders")} className="text-xs text-[#10b981] hover:bg-[#10b981]/5 px-3 py-1.5 rounded-lg transition-all duration-200">View all</button>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-12 text-sm text-gray-500 text-center">No orders yet</p>
        ) : (
          <div className="divide-y divide-[#1e1e1e]">
            {recentOrders.map((o) => (
              <div key={o.orderId || o._id} className="flex items-center justify-between px-6 py-4 hover:bg-[#1a1a1a] transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate mb-1">{o.productName}</p>
                  <p className="text-xs text-gray-500">{o.customerName} · {o.size}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-semibold text-white">${o.price?.toFixed(2)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 text-yellow-400 border-yellow-400/20",
    confirmed: "bg-gradient-to-r from-blue-400/10 to-blue-400/5 text-blue-400 border-blue-400/20",
    shipped: "bg-gradient-to-r from-purple-400/10 to-purple-400/5 text-purple-400 border-purple-400/20",
    delivered: "bg-gradient-to-r from-green-400/10 to-green-400/5 text-green-400 border-green-400/20",
  };
  return (
    <span className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border ${styles[status] || "bg-gradient-to-r from-gray-400/10 to-gray-400/5 text-gray-400 border-gray-400/20"}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab({ orders, onRefresh }) {
  const updateStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    toast.success(`Status → ${status}`);
    onRefresh();
  };

  const deleteOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    toast.success("Order deleted");
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Orders</h1>
        <span className="text-xs text-gray-500">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl py-20 text-center">
          <FiShoppingCart className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.orderId || order._id} className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#333] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-gray-600 bg-[#1a1a1a] px-2 py-0.5 rounded">{order.orderId}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{order.productName} — {order.size}</h3>
                </div>
                <span className="text-lg font-bold text-[#10b981]">${order.price?.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4 p-3 bg-[#0a0a0a] rounded-lg">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-0.5">Customer</p>
                  <p className="text-gray-300">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-0.5">Ordered Via</p>
                  <p className="text-gray-300 capitalize">{order.orderVia || order.customerEmail || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-0.5">Address</p>
                  <p className="text-gray-300">{order.shippingAddress}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["pending", "confirmed", "shipped", "delivered"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.orderId, s)}
                    disabled={order.status === s}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                      order.status === s
                        ? "bg-[#10b981] text-black"
                        : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#262626]"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
                <button onClick={() => deleteOrder(order.orderId)} className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors">
                  <FiTrash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab({ products, onRefresh }) {
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({});
  const [addForm, setAddForm] = useState({
    name: "", price: "", category: "powder", shortDescription: "", description: "",
    specifications: "", inStock: true, sizes: "", image: "",
  });

  const startEdit = (p) => {
    setEditing(p.slug);
    setForm({
      name: p.name, price: p.price, category: p.category,
      shortDescription: p.shortDescription, description: p.description,
      inStock: p.inStock, specifications: (p.specifications || []).join("\n"),
      sizes: (p.sizes || []).map((s) => `${s.label}:${s.price}`).join("\n"),
      image: p.image || "",
    });
  };

  const saveEdit = async (slug) => {
    const sizes = form.sizes?.split("\n").filter(Boolean).map((s) => {
      const [label, price] = s.split(":");
      return { label: label?.trim(), price: parseFloat(price) || 0 };
    }) || [];
    const specs = form.specifications?.split("\n").filter(Boolean) || [];

    await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: slug, name: form.name, price: parseFloat(form.price),
        category: form.category, shortDescription: form.shortDescription,
        description: form.description, inStock: form.inStock,
        specifications: specs, sizes, image: form.image,
      }),
    });
    setEditing(null);
    toast.success("Product updated");
    onRefresh();
  };

  const deleteProduct = async (slug) => {
    if (!confirm("Delete this product permanently?")) return;
    await fetch(`/api/products?slug=${slug}`, { method: "DELETE" });
    toast.success("Product deleted");
    onRefresh();
  };

  const handleAdd = async () => {
    if (!addForm.name || !addForm.price) { toast.error("Name and price are required"); return; }
    const sizes = addForm.sizes?.split("\n").filter(Boolean).map((s) => {
      const [label, price] = s.split(":");
      return { label: label?.trim(), price: parseFloat(price) || 0 };
    }) || [];
    const specs = addForm.specifications?.split("\n").filter(Boolean) || [];

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addForm, price: parseFloat(addForm.price), sizes, specifications: specs, image: addForm.image }),
    });
    if (res.ok) {
      toast.success("Product created");
      setShowAdd(false);
      setAddForm({ name: "", price: "", category: "powder", shortDescription: "", description: "", specifications: "", inStock: true, sizes: "", image: "" });
      onRefresh();
    } else {
      toast.error("Failed to create product");
    }
  };

  const inputCls = "w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent placeholder-gray-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Products</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-black text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          {showAdd ? <FiX className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
          {showAdd ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showAdd && (
        <div className="bg-[#111] border border-[#10b981]/30 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#10b981] flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> New Product
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Product Name *</label>
              <input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className={inputCls} placeholder="e.g. Etomidate Powder" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Base Price *</label>
              <input type="number" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} className={inputCls} placeholder="e.g. 250" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Category</label>
              <select value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} className={inputCls}>
                <option value="powder">Powder</option>
                <option value="vape">Vape</option>
                <option value="liquid">Liquid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">In Stock</label>
              <select value={addForm.inStock} onChange={(e) => setAddForm({ ...addForm, inStock: e.target.value === "true" })} className={inputCls}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Short Description</label>
            <input value={addForm.shortDescription} onChange={(e) => setAddForm({ ...addForm, shortDescription: e.target.value })} className={inputCls} placeholder="Brief summary shown on cards" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Full Description</label>
            <textarea rows={3} value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} className={inputCls} placeholder="Detailed product description shown on detail page" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Quantities & Prices (one per line, format: Label:Price)</label>
            <textarea rows={4} value={addForm.sizes} onChange={(e) => setAddForm({ ...addForm, sizes: e.target.value })} className={inputCls} placeholder={"20g:140\n50g:310\n100g:550\n200g:980"} />
            <p className="text-[10px] text-gray-600 mt-1">For powder use grams (e.g. 20g:140), for vape use pods (e.g. 3 Pods:120), for liquid use ml (e.g. 50ml:165)</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Specifications (one per line)</label>
            <textarea rows={3} value={addForm.specifications} onChange={(e) => setAddForm({ ...addForm, specifications: e.target.value })} className={inputCls} placeholder={"Purity: ≥99.8% (HPLC verified)\nForm: Fine white crystalline powder\nCertificate of Analysis included"} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Product Image</label>
            <ImageUploader currentImage={addForm.image} onUploaded={(url) => setAddForm({ ...addForm, image: url })} />
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-black text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
            <FiSave className="w-4 h-4" /> Create Product
          </button>
        </div>
      )}

      {/* Product list */}
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.slug || product._id} className="bg-[#111] border border-[#1e1e1e] rounded-xl hover:border-[#333] transition-colors">
            {editing === product.slug ? (
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Price</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                      <option value="powder">Powder</option>
                      <option value="vape">Vape</option>
                      <option value="liquid">Liquid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">In Stock</label>
                    <select value={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.value === "true" })} className={inputCls}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Short Description</label>
                  <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Full Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Quantities & Prices (one per line, format: Label:Price)</label>
                  <textarea rows={4} value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className={inputCls} placeholder={"20g:140\n50g:310\n100g:550"} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Specifications (one per line)</label>
                  <textarea rows={3} value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Product Image</label>
                  <ImageUploader currentImage={form.image} onUploaded={(url) => setForm({ ...form, image: url })} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(product.slug)} className="flex items-center gap-1.5 bg-[#10b981] hover:bg-[#059669] text-black text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                    <FiSave className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#262626] text-gray-300 text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                    <FiX className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-[#262626] shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-gray-600 uppercase">{product.category?.slice(0, 3)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{product.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-gray-600 bg-[#1a1a1a] px-2 py-0.5 rounded">{product.category}</span>
                    {product.inStock ? (
                      <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                        <FiCheckCircle className="w-2.5 h-2.5" /> In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                        <FiAlertCircle className="w-2.5 h-2.5" /> Out of Stock
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{product.shortDescription}</p>
                  <p className="text-sm font-bold text-[#10b981] mt-1">From €{product.price?.toFixed(2)}</p>
                </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(product)} className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#262626] text-gray-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => deleteProduct(product.slug)} className="flex items-center gap-1.5 text-red-400 hover:bg-red-400/10 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Messages Tab ─── */
function MessagesTab({ messages }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Messages</h1>
      {messages.length === 0 ? (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl py-20 text-center">
          <FiMail className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#333] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold text-white">{msg.subject}</h3>
                <span className="text-[10px] text-gray-600">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-400 mb-3 leading-relaxed">{msg.message}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><FiMail className="w-3 h-3" /> {msg.email}</span>
                <span>·</span>
                <span>{msg.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Settings Tab ─── */
function SettingsTab({ settings, onRefresh }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success("Settings saved");
    onRefresh();
    setSaving(false);
  };

  const inputCls = "w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent placeholder-gray-600";

  const fields = [
    { key: "siteName", label: "Site Name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "announcement", label: "Announcement Banner", type: "text" },
    { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
    { key: "contactEmail", label: "Contact Email", type: "text" },
    { key: "contactPhone", label: "Contact Phone", type: "text" },
    { key: "shippingNote", label: "Shipping Note", type: "textarea" },
    { key: "aboutText", label: "About Page Text", type: "textarea" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Site Settings</h1>
      <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-6 space-y-5">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea rows={3} value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={inputCls} />
            ) : (
              <input type="text" value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={inputCls} />
            )}
          </div>
        ))}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-black font-semibold text-sm px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-[#10b981]/25 disabled:opacity-50"
        >
          {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
          Save Settings
        </button>
      </div>
    </div>
  );
}

/* ─── Image Uploader ─── */
function ImageUploader({ currentImage, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        onUploaded(data.url);
        toast.success("Image uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const handleFileChange = (e) => {
    uploadFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-3">
      {currentImage ? (
        <div className="relative inline-block">
          <img src={currentImage} alt="Product" className="h-24 w-24 object-cover rounded-lg border border-[#262626]" />
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
          >
            <FiX className="w-3 h-3" />
          </button>
        </div>
      ) : null}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
          dragOver ? "border-[#10b981] bg-[#10b981]/5" : "border-[#262626] hover:border-[#444]"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <FiLoader className="w-6 h-6 text-[#10b981] animate-spin" />
            <p className="text-xs text-gray-500">Uploading...</p>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <FiUpload className="w-6 h-6 text-gray-600" />
            <p className="text-xs text-gray-500">
              <span className="text-[#10b981] font-medium">Click to upload</span> or drag & drop
            </p>
            <p className="text-[10px] text-gray-600">JPG, PNG, WebP, GIF, SVG · Max 5MB</p>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}
