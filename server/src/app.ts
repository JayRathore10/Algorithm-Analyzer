import express  , {Request , Response} from "express";
import sortRouter from "./routes/sort.routes";

const app = express();
app.use(express.json());

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.use("/api/sort"  , sortRouter);

export default app;
