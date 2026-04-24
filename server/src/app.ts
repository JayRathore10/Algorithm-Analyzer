import express  , {Request , Response} from "express";
import sortRouter from "./routes/sort.routes";
import cors from "cors";``

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173" , 
  methods: ["GET", "POST" , "DELETE" , "PUT"],
  credentials: true
}));

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.use("/api/sort"  , sortRouter);

export default app;
