
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();

const app = express();


app.use(express.json());

connectDB();


app.use("/api/v3/app", eventRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
