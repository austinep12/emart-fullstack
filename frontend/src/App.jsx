import { useEffect, useState } from "react";

const API = "/api/customers";
const categories = ["Smartphones", "Laptops", "Audio", "Wearables", "Cameras"];
const icons = { Smartphones: "📱", Laptops: "💻", Audio: "🎧", Wearables: "⌚", Cameras: "📷" };

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState({ text: "", error: false });
  const [loading, setLoading] = useState(true);

  // READ - load all customers from the backend
  async function loadCustomers() {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCustomers(data);
    } catch (err) {
      setNotice({ text: err.message, error: true });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  // CREATE or UPDATE - submit the form
  async function handleSubmit(e) {
    e.preventDefault();
    const url = editId ? `${API}/${editId}` : API;
    try {
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNotice({ text: data.message, error: false });
      resetForm();
      loadCustomers();
    } catch (err) {
      setNotice({ text: err.message, error: true });
    }
  }

  // Fill the form with the selected customer
  function editCustomer(customer) {
    setEditId(customer._id);
    setName(customer.name);
    setCategory(customer.category);
    document.getElementById("customer-form").scrollIntoView({ behavior: "smooth" });
  }

  // DELETE - remove a customer
  async function deleteCustomer(id) {
    if (!window.confirm("Delete this customer record?")) return;
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    const data = await res.json();
    setNotice({ text: data.message, error: !res.ok });
    loadCustomers();
  }

  function resetForm() {
    setName("");
    setCategory("");
    setEditId(null);
  }

  const filtered = customers.filter((c) =>
    `${c.name} ${c.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="#dashboard" className="brand">E-<span>MART</span></a>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#records">Records</a>
          <a href="#customer-form">Add Customer</a>
        </nav>
        <span className="status">● SYSTEM ONLINE</span>
      </header>

      <main>
        <section className="hero" id="dashboard">
          <div>
            <p className="eyebrow">⚡ CUSTOMER CONTROL CENTER</p>
            <h1>MANAGE YOUR <span>CUSTOMER HUB.</span></h1>
            <p className="hero-text">
              One place to organise E-MART customer records. Add, view, update and
              delete every customer with ease.
            </p>
            <a href="#customer-form" className="primary-btn">+ Add New Customer</a>
          </div>
          <div className="hero-visual">
            <div className="ring ring-a"></div>
            <div className="ring ring-b"></div>
            <div className="console-card">
              <p>E-MART / ADMIN</p>
              <div className="console-icon">🛍️</div>
              <h3>CUSTOMER MANAGEMENT</h3>
              <small>CREATE · VIEW · UPDATE · DELETE</small>
            </div>
            <span className="float-chip chip-a">⚡ CRUD ACTIVE</span>
            <span className="float-chip chip-b">🛒 E-MART HUB</span>
          </div>
        </section>

        <section className="stats">
          <article><strong>{customers.length}</strong><small>TOTAL CUSTOMERS</small></article>
          <article><strong>4</strong><small>CRUD OPERATIONS</small></article>
          <article><strong>LIVE</strong><small>MONGODB STATUS</small></article>
        </section>

        <section className="workspace">
          <div className="section-title">
            <div>
              <p className="eyebrow">DATABASE MANAGEMENT</p>
              <h2>CUSTOMER <span>RECORDS</span></h2>
            </div>
            <button className="outline-btn" onClick={loadCustomers}>↻ Refresh</button>
          </div>

          <div className="content-grid">
            <section className="panel" id="records">
              <div className="panel-heading">
                <div>
                  <h3>Customer Records</h3>
                  <p>Manage registered E-MART customers</p>
                </div>
                <span className="badge">{filtered.length} RECORDS</span>
              </div>
              <input
                className="search"
                placeholder="⌕ Search name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {notice.text && (
                <p className={notice.error ? "notice notice-error" : "notice"}>{notice.text}</p>
              )}
              {loading ? (
                <p className="empty">Loading records...</p>
              ) : filtered.length === 0 ? (
                <p className="empty">No customer records found.</p>
              ) : (
                <table>
                  <thead>
                    <tr><th></th><th>NAME</th><th>PREFERRED CATEGORY</th><th>ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c._id}>
                        <td><span className="avatar">{c.name[0].toUpperCase()}</span></td>
                        <td className="name">{c.name}</td>
                        <td>{icons[c.category]} {c.category}</td>
                        <td>
                          <div className="actions">
                            <button onClick={() => editCustomer(c)}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteCustomer(c._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section className="panel form-panel" id="customer-form">
              <div className="panel-heading">
                <div>
                  <h3>{editId ? "Update Customer" : "Add New Customer"}</h3>
                  <p>{editId ? "Edit the selected record" : "Create a customer record"}</p>
                </div>
                <span className="form-icon">🛒</span>
              </div>
              <form onSubmit={handleSubmit}>
                <label>Customer Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
                <label>Preferred Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit" className="primary-btn submit-btn">
                  {editId ? "Update Customer →" : "Add Customer →"}
                </button>
                {editId && (
                  <button type="button" className="outline-btn" onClick={resetForm}>Cancel</button>
                )}
              </form>
              <p className="form-tip">● Records are stored in the MongoDB database EMartDB.</p>
            </section>
          </div>
        </section>
      </main>

      <footer>
        <a href="#dashboard" className="brand">E-<span>MART</span></a>
        <p>FULL STACK CUSTOMER MANAGEMENT · REACT · NODE · EXPRESS · MONGODB</p>
        <a href="#dashboard">Back to top ↑</a>
      </footer>
    </div>
  );
}
