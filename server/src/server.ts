import { PrismaClient } from "../generated/prisma";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors, {CorsOptions} from "cors";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import couponRoutes from "./routes/couponRoutes";
import settingRoutes from "./routes/settingRoutes";
import cartRouter from "./routes/cartRoutes";
import addressRouter from "./routes/addressRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  "https://ecom-advance-stripe.vercel.app", // 👈 yahan apna actual Vercel domain daal
];

const corsOptions:CorsOptions = {
   origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In development, allow all origins to avoid headache
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

export const prisma = new PrismaClient();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/order', orderRoutes);


app.get('/', (req, res) => {
  res.send('Hello backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});