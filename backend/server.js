// Runs the Express API on your computer (http://localhost:5000)
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`E-MART API running at http://localhost:${PORT}`));
