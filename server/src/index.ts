import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as sqlite from 'sqlite3';
import {ConnectionOptions, createConnection, getConnection, getRepository} from "typeorm";
import {Habit} from "./entity/Habit";
import {Measure} from "./entity/Measure";
import "reflect-metadata";

// CONFIG

const port = 3000
const hostname = "127.0.0.1"

// DB CONNECTION & SETUP

const options: ConnectionOptions = {
    type: "sqlite",
    database: `:memory:`,
    entities: [ Habit, Measure ],
    logging: false,
    synchronize: true
}

// create typeorm connection
createConnection(options).then( async connection => {
    const habitRepository = connection.getRepository(Habit);
    const measureRepository = connection.getRepository(Measure);

    let habit1 = new Habit();
    habit1.description = "Run 30 min";

    let habit2 = new Habit();
    habit2.description = "Meditate 10 min";

    let measure1 = new Measure()
    measure1.habit_id = habit1.id
    measure1.value = 1
    measure1.date = new Date(2021, 10, 5)

    let measure2 = new Measure()
    measure2.habit_id = habit1.id
    measure2.value = 1
    measure2.date = new Date(2021, 10, 4)

    let measure3 = new Measure()
    measure3.habit_id = habit2.id
    measure3.value = 0
    measure3.date = new Date(2021, 10, 6)

    await habitRepository.save([habit1, habit2]);
    await measureRepository.save([measure1]); //, measure2]) // , measure3])

    // DEBUGGING

    console.log("habits:")
    console.log(await habitRepository.find())
    console.log("measures:")
    console.log(await measureRepository.find())


    /*let measure4 = new Measure()
    measure4.habit = habit1
    measure4.value = 10
    measure4.date = new Date(2021, 10, 5, 12, 34, 14)

    await measureRepository.save(measure4)*/

    /*const tutu = await getConnection()
        .getRepository(Measure)
        .createQueryBuilder()
        .where("date = :date", { date: "2021-10-05" })
        .andWhere("habitId = :id", { id: habit1.id})
        .execute()
    console.log(tutu)*/

    const loadedHabit = await connection
        .getRepository(Habit)
        .findOne(1);
    console.log(loadedHabit)

    /*const toto = await getRepository(Measure)
        .createQueryBuilder("measure")
        .where("measure.date >= :dateMin", {dateMin: new Date(2021, 11, 4), dateMax: new Date(2021, 10, 10)})
        .execute()
    console.log(toto)*/

    // console.log(measureRepository.find({}))

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