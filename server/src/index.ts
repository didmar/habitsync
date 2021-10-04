import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as sqlite from 'sqlite3';
import {ConnectionOptions, createConnection} from "typeorm";
import {Habit} from "./entity/Habit";

// CONFIG

const port = 3000
const hostname = "192.168.0.28"

// DB CONNECTION & SETUP

const options: ConnectionOptions = {
    type: "sqlite",
    database: `:memory:`,
    entities: [ Habit ],
    logging: false,
    synchronize: true
}

// create typeorm connection
createConnection(options).then(connection => {
    const habitRepository = connection.getRepository(Habit);

    let habit1 = new Habit();
    habit1.description = "Run 30 min";
    habit1.checked = false;

    let habit2 = new Habit();
    habit2.description = "Meditate 10 min";
    habit2.checked = true;

    habitRepository.save([habit1, habit2]);

    // SETUP APP

    const app = express()

    app.use(bodyParser.json())

    app.use(cors());

    app.use(cors());

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // ROUTES

    app.get('/api/habits', async function(req, res){
        console.log("GET /api/habits")
        const habits = await habitRepository.find()
        res.json(habits)
    });

    app.get('/api/habits/:id', async function(req, res){
        console.log("GET /api/habits/" + req.params.id)
        await habitRepository.findOne(req.params.id)
    });

    app.post("/api/habits", async function(req, res) {
        console.log("POST /api/habits " + req.body)
        const user = await habitRepository.create(req.body);
        const results = await habitRepository.save(user);
        return res.send(results);
    });

    app.put("/api/habits/:id", async function(req, res) {
        console.log("POST /api/habits/" + req.params.id + " " + JSON.stringify(req.body))
        const habit = await habitRepository.findOne(req.params.id);
        if(habit != undefined) {
            habitRepository.merge(habit, req.body);
            const results = await habitRepository.save(habit);
            return res.send(results);
        } else {
            res.sendStatus(404);
        }

    });

    app.delete("/api/habits/:id", async function(req, res) {
        const results = await habitRepository.delete(req.params.id);
        return res.send(results);
    });

    // RUN THE APP

    app.listen(port, hostname, () => {
        console.log("Server ready")
    })

}).catch(error => console.log(error));