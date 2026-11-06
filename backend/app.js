// E-MART Electronics - Express REST API connected to MongoDB
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
let clientPromise;

// Connect once and reuse the connection (database: EMartDB, collection: Customers)
async function getCustomers() {
  if (!uri) throw new Error("MONGO_URI environment variable is not set");
  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  const client = await clientPromise;
  return client.db("EMartDB").collection("Customers");
}

function isValid(body) {
  return body.name && body.name.trim() && body.category;
}

// READ - get all customers
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await getCustomers();
    res.json(await customers.find().sort({ _id: -1 }).toArray());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE - add a customer
app.post("/api/customers", async (req, res) => {
  try {
    if (!isValid(req.body)) return res.status(400).json({ message: "Name and category are required" });
    const customers = await getCustomers();
    const customer = { name: req.body.name.trim(), category: req.body.category };
    const result = await customers.insertOne(customer);
    res.status(201).json({ message: "Customer added successfully", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE - edit a customer
app.put("/api/customers/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid id" });
    if (!isValid(req.body)) return res.status(400).json({ message: "Name and category are required" });
    const customers = await getCustomers();
    const result = await customers.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name: req.body.name.trim(), category: req.body.category } }
    );
    if (!result.matchedCount) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - remove a customer
app.delete("/api/customers/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid id" });
    const customers = await getCustomers();
    const result = await customers.deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;
