import "reflect-metadata"; // required by TypeORM
import { DataSource } from "typeorm";
import express from "express";
import { Event } from "./entities/event.entity";
import { EventLog } from "./entities/event-log.entity";
import cors from 'cors';
import axios from "axios";

// Define TypeORM data source config
const AppDataSource = new DataSource({
    type: "mssql", // or your DB type
    host: "hukemssql02",
    port: 1433,
    username: "selfdev_service",
    password: "kwvwqiqdEgqqSoVkw6dr",
    database: "Selfdev_CardCheckApp",
    entities: [Event, EventLog], // path to entities
    synchronize: true, // auto sync entity schema (dev only)
    options: { encrypt: false },
});

const app = express();
const port = process.env.PORT || 3001;
app.use(cors())

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    });

const eventRepo = AppDataSource.getRepository(Event);
const eventLogRepo = AppDataSource.getRepository(EventLog);
app.use(express.json());

app.get('/events/all', async (req, res) => {
    try {
        const events = await eventRepo.find({ order: { createdAt: "DESC" } });
        res.status(200).json({ events: events })
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }

    return res
})

app.post('/events/add', async (req, res) => {
    try {
        const event = eventRepo.create(req.body);
        const savedEvent = await eventRepo.save(event);
        res.status(201).json(savedEvent);
    } catch (e: any) {
        res.status(500).json({ error: e.message })
    }

    return res;
});

app.delete('/events/delete/:id', async (req, res) => {
   const result = await eventRepo.delete(parseInt(req.params.id));
   if (result.affected === 0) {
       res.status(404).json({ error: 'Az esemény nem létezik!' })
   } else {
       res.json({ message: 'Esemény sikeresen törölve!' })
   }

   return res;
});

app.get('/event-log/getList/:eventId', async(req, res) => {
    try {
        const eventLogList = await eventLogRepo.findBy({ eventId: parseInt(req.params.eventId) })
        const keycloakUsers = await axios.get("http://localhost:3000/keycloak/getAllUsers");
        const userList: any[] = [];
        eventLogList.forEach(r => {
            const user = keycloakUsers.data.filter((u: any) => {return u.attributes?.regNumber?.[0] == r.regNumber})
            userList.push({
                name: user[0].lastName + " " + user[0].firstName,
                regNumber: user[0].attributes.regNumber[0],
                position: user[0].attributes.position[0],
                organization: user[0].attributes.organization[0]
            })
        })
        res.status(200).json(userList);
    } catch (e: any) {
        res.status(500).json({ error: e });
    }

    return res;
})

app.post('/event-log/add', async (req, res) => {
    const row = await eventLogRepo.find({ where: { eventId: parseInt(req.body.eventId), regNumber: parseInt(req.body.regNumber) } })
    if (row.length) {
        res.status(200).json({ type: 0, message: "A " + req.body.regNumber + " kártya már volt egyszer érinteve az esemény során!" })
        return res;
    }
    try {
        const eventLog = eventLogRepo.create(req.body);
        const savedEventLog = await eventLogRepo.save(eventLog);
        res.status(201).json({ type: 1, message: "Siker!", eventLog: savedEventLog});
    } catch(e: any) {
        res.status(500).json({ error: e.message });
    }

    return res;
})