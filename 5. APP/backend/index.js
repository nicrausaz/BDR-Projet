import * as fs from "fs";
import pg from "pg";
import faker from "faker";

faker.locale = "fr";
const client = new pg.Client({
        host: 'studimax-cloud.ch',
        port: 5431,
        user: 'bdr',
        password: 'bdr',
        database: "bdr_proj_crausaz_scharwath"
    })
;

function createPlayers() {
    for (let i = 0; i<500;++i){
        client.query('INSERT INTO player(lastname, firstname, birthdate) VALUES($1, $2, $3)',[
            faker.name.lastName(), faker.name.firstName(), faker.date.between("1960-01-01","2000-12-31")
        ])
    }
}

async function createClubs() {
    const animals = JSON.parse(fs.readFileSync('animals.json', 'utf-8'))
    for (let i = 0; i < 50; ++i) {
        await client.query('INSERT INTO club(name, sportid) VALUES($1, $2)', [
            `${faker.helpers.randomize(animals)} ${faker.address.city()}`, faker.random.number({min: 1, max: 8})
        ])
    }
}

(async () => {
    await client.connect()
    //await createPlayers();
    //await createClubs();
    await client.end()
})()
