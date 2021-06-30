const express = require ("express");
const routes = require("./routes/Routes");
const mongoose = require ("mongoose");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.options('*', cors());



const mongoDB = process.env.MONGO_URL;
mongoose.connect(
	"mongodb+srv://lentsa:PetraCovac@lentsa-petracovac.dlnhr.mongodb.net/lentsapetracovacdb?retryWrites=true&w=majority",
	{
	  useNewUrlParser: true,
	  useFindAndModify: false,
	  useUnifiedTopology: true
	} || mongoDB
  );
mongoose.Promise = global.Promise;
const db = mongoose.connection



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", routes);

var port = process.env.PORT || 3001;
app.listen(port, 
	() => console.log(`Server is running... ${port}`));