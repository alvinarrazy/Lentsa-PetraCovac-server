const express = require ("express");
const routes = require("./routes/Routes");
const mongoose = require ("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.options('*', cors());

let mongourl = "mongodb://localhost:27017/Lentsa-PetraCovac-db";


const mongoDB = mongourl;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", routes);

 
const port = 3001;
app.listen(port, () => console.log(`Server di ${port}`))



    