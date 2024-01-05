import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();

const SECRET_KEY = "05431e4b5b6e2f6588cf2423f99b2f13";

const data = "Hello World";
const database = {
  data: data,
  hash: createHash(data),
};

app.use(cors());
app.use(express.json());

function createHash(data: any) {
  return crypto
    .createHash("sha256")
    .update(data + SECRET_KEY)
    .digest("hex");
}

// Routes
app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const newData = req.body.data;
  const newHash = req.body.hash;

  // Verify data integrity before updating the database
  const calculatedHash = createHash(newData);

  if (calculatedHash === newHash) {
    database.data = newData;
    database.hash = newHash;
    res.sendStatus(200);
  } else {
    res
      .status(400)
      .json({ error: "Data integrity check failed. Possible tampering." });
  }
});

app.post("/verify", (req, res) => {
  const currentHash = createHash(req.body.data);
  if (currentHash === database.hash) {
    res.json({ isVerified: true });
  } else {
    res.json({ isVerified: false });
  }
});

app.get("/recover", (req, res) => {
  database.data = database.data;
  res.json(database);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
