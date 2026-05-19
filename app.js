const express    = require("express");
const cors       = require("cors");
const bodyParser = require("body-parser");
const path       = require("path");

const app = express();

// ── CORS — must be FIRST, before everything else ──────────
// Allows your React dev server (port 5173) to talk to this API (port 5500)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle preflight OPTIONS requests for all routes
app.options(/.*/, cors());

// ── STATIC FILES — serve uploaded product images ──────────
// This fixes: GET http://localhost:5500/productlogo/<filename> 404
app.use("/productlogo", express.static(path.join(__dirname, "productlogo")));

// ── BODY PARSERS ──────────────────────────────────────────
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── ROUTES ────────────────────────────────────────────────
const mstadminRoutes        = require("./routes/mstadmin.routes");
const bmicategoryRoutes     = require("./routes/bmicategory.routes");
const brandRoutes           = require("./routes/brand.routes");
const healthcategoryRoutes  = require("./routes/healthcategory.routes");
const mealsRoutes           = require("./routes/meals.routes");
const healthitemsRoutes     = require("./routes/healthitems.routes");
const mstuserRoutes         = require("./routes/mstuser.routes");
const categoryRoutes        = require("./routes/category.routes");
const nutritionfactsroutes  = require("./routes/nutritionfacts.routes");
const userdailylogsRoutes   = require("./routes/userdailylogs.routes");
const userhealthprofileRoutes = require("./routes/userhealthprofile.routes");
const alternativesRoutes    = require("./routes/alternatives.routes");
const usermeallogRoutes     = require("./routes/usermeallog.routes");
const productRoutes         = require("./routes/product.routes");
const productratingRoutes   = require("./routes/productrating.routes");
const userFavouritesRoutes  = require("./routes/userfavourites.routes");
const mealsHealthRuleRoutes = require("./routes/mealshealthrule.routes");
const mealsNutritionRoutes  = require("./routes/mealsnutrition.routes");
const userHealthItemRoutes  = require("./routes/userhealthitem.routes");

app.use("/api/mstadmin",        mstadminRoutes);
app.use("/api/bmicategory",     bmicategoryRoutes);
app.use("/api/brand",           brandRoutes);
app.use("/api/healthcategory",  healthcategoryRoutes);
app.use("/api/meals",           mealsRoutes);
app.use("/api/healthitem",      healthitemsRoutes);
app.use("/api/mstuser",         mstuserRoutes);
app.use("/api/category",        categoryRoutes);
app.use("/api/nutritionfacts",  nutritionfactsroutes);
app.use("/api/userdailylogs",   userdailylogsRoutes);
app.use("/api/userhealthprofile", userhealthprofileRoutes);
app.use("/api/alternatives",    alternativesRoutes);
app.use("/api/usermeallog",     usermeallogRoutes);
app.use("/api/product",         productRoutes);
app.use("/api/productrating",   productratingRoutes);
app.use("/api/userfavourites",  userFavouritesRoutes);
app.use("/api/mealshealthrule", mealsHealthRuleRoutes);
app.use("/api/mealsnutrition",  mealsNutritionRoutes);
app.use("/api/userhealthitem",  userHealthItemRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running successfully" });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});