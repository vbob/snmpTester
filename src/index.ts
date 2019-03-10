import * as path from 'path'
import * as morgan from 'morgan'
import * as express from 'express'
import { SNMPRouter } from './controllers/SNMP/SNMPRoute';
const app = express()

app.set("views", __dirname + "/../views");
app.set("view engine", "pug");

app.use(morgan("combined"));

const port = 8080

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

app.use(express.static(path.join(__dirname, "/../public")));

app.get("/", function (req, res) {
  res.render("layouts/index");
});

// Configure Router
app.use('/snmp', SNMPRouter)