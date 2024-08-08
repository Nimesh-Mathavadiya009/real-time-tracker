import express from "express";
import http from "http";
import  {Server} from "socket.io"
import { fileURLToPath } from 'url';
import path from "path"

const port = 8000
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app)
server.listen(port, () => {
    console.log(`server started on Port : `,port )
})
const io = new Server(server)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"/public")))

io.on("connection" , (socket) => {
   console.log("connected")
   socket.on("send-location", (data) => {
      io.emit("receive-location", {id: socket.id, ...data})
   })
   socket.on("disconnect", () => {
    io.emit("user-disconnect", socket.id)
   })

})

app.get("/", (req,res) => {
    res.render("index")
})

