const express = require('express')
const morgan = require('morgan')
const cors = require("cors");
const path = require("path")

const app = express()

//Swagger
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Antpire API",
            version: "1.0.0"
        },
        servers: [{
            url: "http://localhost:3333"
        }]
    },
    apis: [
            `${path.join(__dirname, "./routes/Register/*.js")}`, 
            `${path.join(__dirname, "./routes/Login/*.js")}`,
            `${path.join(__dirname, "./routes/Recover/*.js")}`,
            `${path.join(__dirname, "./routes/RegisterSpend/*.js")}`,
            `${path.join(__dirname, "./routes/tableSpend/*.js")}`,
            `${path.join(__dirname, "./routes/Perfil/*.js")}`,
        ]
}

app.use(cors());
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(require("./routes/Register/register"))
app.use(require("./routes/Login/login"))
app.use(require("./routes/Recover/recover"))
app.use(require("./routes/Perfil/perfil"))
app.use(require("./routes/RegisterSpend/registerSpend"))
app.use(require("./routes/tableSpend/tableSpend"))
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))


module.exports = app;