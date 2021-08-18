const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const path = require('path');
const grpcLoader = require('@grpc/proto-loader');
const {loadPackageDefinition} = require("@grpc/grpc-js");

const protoPath = path.join(__dirname, './users.proto');
const options = grpcLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const usersproto = grpc.loadPackageDefinition(options).usersproto;
const client = new usersproto.UserService('localhost:50051', grpc.credentials.createInsecure());


const app = express();
app.use(cors());

const port = process.env.PORT || 8080;
const ip = process.env.IP || "0.0.0.0"
const users = [{firstName: "Moishe", lastName: "Ufnik"}, {firstName: "Kipi", lastName: "Ben Kipod"}, {
    firstName: "Ugi",
    lastName: "Flezet"
}];
app.get("/api/v1/users", (req, res) => {
    client.all(null, (err, data) => err ? res.status(500).send("Oppsi...") : res.send(data));
});

app.get("/api/v1/users/:firstName", (req, res) => res.send(users[1]));
app.listen(port, ip, () => console.log(`Example app listening at http://localhost:${port}`));








