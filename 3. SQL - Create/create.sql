/*
 ---------------------------------------
    Gestion de ligues sportives
 ---------------------------------------
    Création des tables et contraintes
 ---------------------------------------
    Nicolas Crausaz & Maxime Scharwath
    Version 4 - 13.01.2021
 ---------------------------------------
 */

CREATE DATABASE bdr_proj_crausaz_scharwath;
CREATE SCHEMA public;

--Pour utiliser uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET search_path TO public;

CREATE TABLE sport
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE federation
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    sportId SERIAL       NOT NULL,
    active   BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_sportId FOREIGN KEY (sportId) REFERENCES sport (id) ON DELETE SET NULL
);

CREATE TABLE league
(
    id           SERIAL PRIMARY KEY,
    level        VARCHAR(50) NOT NULL,
    gender       CHAR        NOT NULL,
    federationid SERIAL      NOT NULL,
    active   BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_federationId FOREIGN KEY (federationid) REFERENCES federation (id)
);

CREATE TABLE championship
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(30) NOT NULL,
    startAt  DATE        NOT NULL,
    endAt    DATE        NOT NULL,
    leagueId SERIAL      NOT NULL,
    active   BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_leagueId FOREIGN KEY (leagueId) REFERENCES league (id)
);


CREATE TABLE player
(
    uid       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lastname  VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    birthdate DATE         NOT NULL,
    height    INTEGER,
    weight    INTEGER,
    sex       CHAR
);

CREATE TABLE federation_licence_player
(
    licenceNumber VARCHAR(255) NOT NULL,
    playerUid     UUID,
    federationId  SERIAL,

    PRIMARY KEY (playerUid, federationId),

    CONSTRAINT fk_playerUid FOREIGN KEY (playerUid) REFERENCES player (uid) ON DELETE CASCADE,
    CONSTRAINT fk_federationId FOREIGN KEY (federationId) REFERENCES federation (id) ON DELETE CASCADE
);

CREATE TABLE club
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    sportId SERIAL,
    active   BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT fk_sportId FOREIGN KEY (sportId) REFERENCES sport (id) ON DELETE SET NULL
);

CREATE TABLE team
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    clubId   SERIAL       NOT NULL,
    leagueId SERIAL       NOT NULL,
    active   BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_clubId FOREIGN KEY (clubId) REFERENCES club (id),
    CONSTRAINT fk_leagueId FOREIGN KEY (leagueId) REFERENCES league (id)
);


CREATE TABLE player_play_for_team
(
    jerseyNumber INTEGER,
    startAt      TIMESTAMP NOT NULL DEFAULT current_timestamp,
    endAt        TIMESTAMP,
    playerUid    UUID,
    teamId       SERIAL,

    PRIMARY KEY (playerUid, teamId),

    CONSTRAINT fk_playerUid FOREIGN KEY (playerUid) REFERENCES player (uid) ON DELETE CASCADE,
    CONSTRAINT fk_teamId    FOREIGN KEY (teamId)    REFERENCES team (id) ON DELETE CASCADE
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
    createdAt TIMESTAMP    DEFAULT current_timestamp,
    updatedAt TIMESTAMP    DEFAULT current_timestamp,
    stadiumId SERIAL,

    CONSTRAINT fk_stadiumId FOREIGN KEY (stadiumId) REFERENCES stadium (id) ON DELETE SET NULL
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

    CONSTRAINT fk_eventUid FOREIGN KEY (eventUid) REFERENCES event (uid) ON DELETE CASCADE,
    CONSTRAINT fk_championshipId FOREIGN KEY (championshipId) REFERENCES championship (id) ON DELETE CASCADE,
    CONSTRAINT fk_teamHomeId FOREIGN KEY (teamHomeId) REFERENCES team (id) ON DELETE CASCADE,
    CONSTRAINT fk_teamGuestId FOREIGN KEY (teamGuestId) REFERENCES team (id) ON DELETE CASCADE,
    CHECK (teamHomeId != teamGuestId)
);

CREATE TABLE training
(
    eventUid    UUID PRIMARY KEY,
    description TEXT,
    teamId      SERIAL NOT NULL,

    CONSTRAINT fk_eventUid FOREIGN KEY (eventUid) REFERENCES event (uid) ON DELETE CASCADE,
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
