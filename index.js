const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//setup express

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("uploadImages"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

//setup mongoose

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) throw err;
    console.log("Mongodb connection established");
  }
);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
 }

//setup routes
app.use("/api/customizes", require("./routes/customizeRouter"));
app.use("/api/sizes",require("./routes/sizeRouter"));
app.use("/api/users", require("./routes/userRouter"));
app.use("/api/products", require("./routes/productRouter"));
app.use("/api/orders", require("./routes/orderRouter"));
app.use("/api/recipes", require("./routes/recipeRouter"));
app.use("/api/dietplans", require("./routes/dietPlanRouter"));
app.use("/api/training", require("./routes/trainingRouter"));
app.use("/api/contact", require("./routes/contactFormRouter"));
app.use("/api/blog", require("./routes/blogRouter"));
app.use("/api/meditation", require("./routes/meditationRouter"));
app.use("/api/history", require("./routes/historyRouter"));
