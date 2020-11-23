const {Client} = require('pg')
const faker = require('faker');
faker.locale = "fr";
const client = new Client({
        host: 'studimax-cloud.ch',
        port: 5431,
        user: 'bdr',
        password: 'bdr',
        database: "bdr_proj_crausaz_scharwath"
    })
;(async () => {
    await client.connect()
    for (let i = 0; i<500;++i){
        await client.query('INSERT INTO player(uid, lastname, firstname, birthdate) VALUES(uuid_generate_v1(), $1, $2, $3)',[
            faker.name.lastName(), faker.name.firstName(), faker.date.between("1960-01-01","2000-12-31")
        ])
    }
    await client.end()
})()
