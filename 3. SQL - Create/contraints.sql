/*
 ---------------------------------------
    Gestion de ligues sportives
 ---------------------------------------
    Création des tables et contraintes
 ---------------------------------------
    Nicolas Crausaz & Maxime Scharwath
    Version 2 - 13.11.2020
 ---------------------------------------
 */

--CREATE DATABASE bdr_proj_crausaz_scharwath;

-- CREATE SCHEMA public;

SET search_path TO public;

CREATE TABLE sport
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE season
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(15) NOT NULL,
    startAt DATE        NOT NULL,
    endAt   DATE        NOT NULL
);

CREATE TABLE league
(
    id     SERIAL PRIMARY KEY,
    level  VARCHAR(50) NOT NULL,
    gender CHAR        NOT NULL
);

CREATE TABLE championship
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(30) NOT NULL,
    startAt  DATE        NOT NULL,
    endAt    DATE        NOT NULL,
    seasonId SERIAL      NOT NULL,
    leagueId SERIAL      NOT NULL,

    CONSTRAINT fk_seasonId FOREIGN KEY (seasonId) REFERENCES season (id),
    CONSTRAINT fk_leagueId FOREIGN KEY (leagueId) REFERENCES league (id)
);

CREATE TABLE federation
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    sportId SERIAL       NOT NULL,

    CONSTRAINT fk_sportId FOREIGN KEY (sportId) REFERENCES sport (id)
);

CREATE TABLE player
(
    uid       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lastname  VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    birthdate DATE         NOT NULL
);

CREATE TABLE federation_licence_player
(
    licenceNumber VARCHAR(255) NOT NULL,
    playerUid     UUID,
    federationId  SERIAL,

    PRIMARY KEY (playerUid, federationId),

    CONSTRAINT fk_playerUid FOREIGN KEY (playerUid) REFERENCES player (uid),
    CONSTRAINT fk_federationId FOREIGN KEY (federationId) REFERENCES federation (id)
);

CREATE TABLE club
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    sportId SERIAL       NOT NULL,
    CONSTRAINT fk_sportId FOREIGN KEY (sportId) REFERENCES sport (id)
);

CREATE TABLE team
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    clubId   SERIAL       NOT NULL,
    leagueId SERIAL       NOT NULL,

    CONSTRAINT fk_clubId FOREIGN KEY (clubId) REFERENCES club (id),
    CONSTRAINT fk_leagueIdd FOREIGN KEY (leagueId) REFERENCES league (id)
);


CREATE TABLE player_play_for_team
(
    jerseyNumber INTEGER   NOT NULL,
    startAt      TIMESTAMP NOT NULL,
    endAt        TIMESTAMP,
    playerUid    UUID,
    teamId       SERIAL,

    PRIMARY KEY (playerUid, teamId),

    CONSTRAINT fk_playerUid FOREIGN KEY (playerUid) REFERENCES player (uid),
    CONSTRAINT fk_teamId FOREIGN KEY (teamId) REFERENCES team (id)
);

CREATE TABLE stadium
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    address  VARCHAR(255) NOT NULL,
    capacity INTEGER
);

CREATE TABLE event
(
    uid       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name      VARCHAR(100) NOT NULL,
    startAt   TIMESTAMP    NOT NULL,
    endAt     TIMESTAMP    NOT NULL,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    stadiumId SERIAL       NOT NULL,

    CONSTRAINT fk_stadiumId FOREIGN KEY (stadiumId) REFERENCES stadium (id)
);

CREATE TABLE game
(
    eventUid       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gameId         VARCHAR(50) NOT NULL,
    scoreHome      INTEGER          DEFAULT 0,
    scoreGuest     INTEGER          DEFAULT 0,
    canceled       BOOLEAN          DEFAULT FALSE,
    championshipId SERIAL      NOT NULL,
    teamHomeId     SERIAL      NOT NULL,
    teamGuestId    SERIAL      NOT NULL,

    CONSTRAINT fk_eventUid FOREIGN KEY (eventUid) REFERENCES event (uid),
    CONSTRAINT fk_championshipId FOREIGN KEY (championshipId) REFERENCES championship (id),
    CONSTRAINT fk_teamHomeId FOREIGN KEY (teamHomeId) REFERENCES team (id),
    CONSTRAINT fk_teamGuestId FOREIGN KEY (teamGuestId) REFERENCES team (id),
    CHECK (teamHomeId != teamGuestId)
);

CREATE TABLE training
(
    eventUid    UUID PRIMARY KEY,
    description VARCHAR(255),
    teamId      SERIAL NOT NULL,

    CONSTRAINT fk_eventUid FOREIGN KEY (eventUid) REFERENCES event (uid),
    CONSTRAINT fk_teamId FOREIGN KEY (teamId) REFERENCES team (id)
);

CREATE TABLE administrator
(
    uid       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email     VARCHAR(255) UNIQUE NOT NULL,
    lastname  VARCHAR(255)        NOT NULL,
    firstname VARCHAR(255)        NOT NULL,
    password  VARCHAR(255)        NOT NULL
);

CREATE TABLE administrator_player
(
    administratorUid UUID,
    playerUid        UUID,

    PRIMARY KEY (administratorUid, playerUid),

    CONSTRAINT fk_administratorUid FOREIGN KEY (administratorUid) REFERENCES administrator (uid),
    CONSTRAINT fk_playerUid FOREIGN KEY (playerUid) REFERENCES player (uid)
);

CREATE TABLE administrator_club
(
    administratorUid UUID,
    clubId           SERIAL,

    PRIMARY KEY (administratorUid, clubId),

    CONSTRAINT fk_administratorUid FOREIGN KEY (administratorUid) REFERENCES administrator (uid),
    CONSTRAINT fk_clubId FOREIGN KEY (clubId) REFERENCES club (id)
);

CREATE TABLE administrator_federation
(
    administratorUid UUID,
    federationId     SERIAL,

    PRIMARY KEY (administratorUid, federationId),

    CONSTRAINT fk_administratorUid FOREIGN KEY (administratorUid) REFERENCES administrator (uid),
    CONSTRAINT fk_federationId FOREIGN KEY (federationId) REFERENCES federation (id)
);
