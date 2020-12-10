import * as fs from "fs";
import pg from "pg";
import faker from "faker";
import bcrypt from "bcrypt";

faker.locale = "fr";
const client = new pg.Client({
        host: 'studimax-cloud.ch',
        port: 5431,
        user: 'bdr',
        password: 'bdr',
        database: "bdr_proj_crausaz_scharwath"
    })
;

async function createPlayers() {
    for (let i = 0; i < 500; ++i) {
        await client.query('INSERT INTO player(lastname, firstname, birthdate) VALUES($1, $2, $3)', [
            faker.name.lastName(), faker.name.firstName(), faker.date.between("1960-01-01", "2000-12-31")
        ])
    }
}

async function createClubs() {
    const animals = JSON.parse(fs.readFileSync('animals.json', 'utf-8'))
    for (let i = 0; i < 50; ++i) {
        await client.query('INSERT INTO federation(name, sportid) VALUES($1, $2)', [
            `${faker.helpers.randomize(animals)} ${faker.address.city()}`, faker.random.number({min: 1, max: 8})
        ])
    }
}

async function createAdmin() {
    for (let i = 0; i < 10; ++i) {
        const fn = faker.name.firstName();
        const ln = faker.name.lastName();
        const email = faker.internet.email(fn,ln).toLowerCase();
        const pw = await bcrypt.hash("password", 10);
        await client.query('INSERT INTO administrator(email, lastname, firstname, password) VALUES($1, $2, $3, $4)', [
            email, ln, fn, pw
        ])
    }
}

async function createEvent(){
    const stadium = await client.query('SELECT id  FROM stadium');
    for (let i = 0; i < 100; ++i) {
        const stadiumId = faker.helpers.randomize(stadium.rows).id;
        const d1 = faker.date.between('2010-01-01','2022-12-31');
        const d2 = faker.date.soon(2, d1);
        await client.query('INSERT INTO event(name, startat, endat, createdat, updatedat, stadiumid) VALUES ($1,$2,$3,now(),now(),$4)',[
            faker.random.words(5), d1,d2,stadiumId
        ])
    }
}

async function selectEvent(){
    const result = await client.query(`
        SELECT e.uid, 
               e.name, 
               e.startat, 
               e.endat, 
               row_to_json(s.*) as stadium 
        FROM event AS e 
        INNER JOIN stadium s ON s.id = e.stadiumid
    `)
    console.log(result.rows)
}

(async () => {
    await client.connect()
    //await createPlayers();
    //await createClubs();
    await selectEvent();
    await client.end()
})()
