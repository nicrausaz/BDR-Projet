--
-- Création des tables et contraintes
-- Nicolas Crausaz & Maxime Scharwath
-- Version 4 - 19.01.2021
--

CREATE DATABASE bdr_proj_crausaz_scharwath;
CREATE SCHEMA IF NOT EXISTS public;

-- Pour utiliser uuid
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
    name    VARCHAR(100)         NOT NULL,
    sportId SERIAL               NOT NULL,
    active  BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_sportId FOREIGN KEY (sportId) REFERENCES sport (id) ON DELETE SET NULL
);

CREATE TABLE league
(
    id           SERIAL PRIMARY KEY,
    level        VARCHAR(50)          NOT NULL,
    gender       CHAR                 NOT NULL,
    federationid SERIAL               NOT NULL,
    active       BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_federationId FOREIGN KEY (federationid) REFERENCES federation (id)
);

CREATE TABLE championship
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(40)          NOT NULL,
    startAt  DATE                 NOT NULL,
    endAt    DATE                 NOT NULL,
    leagueId SERIAL               NOT NULL,
    active   BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_leagueId FOREIGN KEY (leagueId) REFERENCES league (id)
);


CREATE TABLE player
(
    uid       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lastname  VARCHAR(255)                  NOT NULL,
    firstname VARCHAR(255)                  NOT NULL,
    birthdate DATE                          NOT NULL,
    height    INTEGER,
    weight    INTEGER,
    sex       CHAR,
    active    BOOLEAN          DEFAULT TRUE NOT NULL
);

CREATE TABLE club
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100)         NOT NULL,
    sportId SERIAL,
    active  BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_sportId FOREIGN KEY (sportId) REFERENCES sport (id) ON DELETE SET NULL
);

CREATE TABLE team
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100)         NOT NULL,
    clubId   SERIAL               NOT NULL,
    leagueId SERIAL               NOT NULL,
    active   BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_clubId FOREIGN KEY (clubId) REFERENCES club (id),
    CONSTRAINT fk_leagueId FOREIGN KEY (leagueId) REFERENCES league (id)
);


CREATE TABLE player_play_for_team
(
    jerseyNumber INTEGER,
    startAt      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    endAt        TIMESTAMP,
    playerUid    UUID,
    teamId       SERIAL,

    PRIMARY KEY (playerUid, teamId, startAt),

    CONSTRAINT fk_playerUid FOREIGN KEY (playerUid) REFERENCES player (uid) ON DELETE CASCADE,
    CONSTRAINT fk_teamId FOREIGN KEY (teamId) REFERENCES team (id) ON DELETE CASCADE
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
    createdAt TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
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

--
-- Création des vues & triggers
-- Nicolas Crausaz & Maxime Scharwath
-- Version 2 - 19.01.2021
--

-- Vue pour evénement de type match
CREATE OR REPLACE VIEW event_game AS
(
SELECT *
FROM event
         INNER JOIN game ON event.uid = eventuid
    );

-- Vue pour evénement de type entrâinement
CREATE OR REPLACE VIEW event_training AS
(
SELECT *
FROM event
         INNER JOIN training ON event.uid = eventuid
    );


-- Vue qui affiche les matchs joué par chaque équipe et indique si le match est gagnant/perdant/égalité dans un nouveau champ result
CREATE OR REPLACE VIEW team_played_games AS
(
SELECT *,
       CASE
           WHEN scorehome < scoreguest AND teamhomeid = t.teamid THEN 'L'
           WHEN scorehome < scoreguest AND teamhomeid != t.teamid THEN 'W'
           WHEN scorehome > scoreguest AND teamhomeid = t.teamid THEN 'W'
           WHEN scorehome > scoreguest AND teamhomeid != t.teamid THEN 'L'
           WHEN scorehome = scoreguest THEN 'D'
           END AS result
FROM (
         SELECT teamhomeid AS teamid, *
         FROM event_game
         UNION
         SELECT teamguestid AS teamid, *
         FROM event_game
     ) AS t
WHERE t.canceled = FALSE
  AND t.endat <= NOW());


CREATE OR REPLACE VIEW event_list AS
(
SELECT e.*, 'training' AS eventtype
FROM event e
         JOIN training ON uid = training.eventuid
UNION
SELECT e.*, 'game' AS eventtype
FROM event e
         JOIN game ON uid = game.eventuid
    );

-- Triggers
CREATE TABLE event_log
(
    id         SERIAL PRIMARY KEY,
    event      VARCHAR NOT NULL,
    resourceid VARCHAR NOT NULL,
    operation  VARCHAR NOT NULL,
    tablename  VARCHAR NOT NULL,
    executedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_event()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
BEGIN
    IF tg_op = 'DELETE'
    THEN
        INSERT INTO event_log (event, resourceid, operation, tablename)
        VALUES (CONCAT(LOWER(tg_op), ' ', tg_table_name), OLD.id, LOWER(tg_op), tg_table_name);
        RETURN OLD;
    ELSE
        INSERT INTO event_log (event, resourceid, operation, tablename)
        VALUES (CONCAT(LOWER(tg_op), ' ', tg_table_name), NEW.id, LOWER(tg_op), tg_table_name);
        RETURN NEW;
    END IF;
END
$$;

CREATE OR REPLACE FUNCTION log_event_uid()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
BEGIN
    IF tg_op = 'DELETE'
    THEN
        INSERT INTO event_log (event, resourceid, operation, tablename)
        VALUES (CONCAT(LOWER(tg_op), ' ', tg_table_name), OLD.uid, LOWER(tg_op), tg_table_name);
        RETURN OLD;
    ELSE
        INSERT INTO event_log (event, resourceid, operation, tablename)
        VALUES (CONCAT(LOWER(tg_op), ' ', tg_table_name), NEW.uid, LOWER(tg_op), tg_table_name);
        RETURN NEW;
    END IF;
END
$$;


CREATE TRIGGER log_club_trigger
    AFTER INSERT OR UPDATE
    ON club
    FOR EACH ROW
EXECUTE FUNCTION log_event();

CREATE TRIGGER log_event_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON event
    FOR EACH ROW
EXECUTE FUNCTION log_event_uid();

CREATE TRIGGER log_federation_trigger
    AFTER INSERT OR UPDATE
    ON federation
    FOR EACH ROW
EXECUTE FUNCTION log_event();

CREATE TRIGGER log_league_trigger
    AFTER INSERT OR UPDATE
    ON league
    FOR EACH ROW
EXECUTE FUNCTION log_event();

CREATE TRIGGER log_team_trigger
    AFTER INSERT OR UPDATE
    ON team
    FOR EACH ROW
EXECUTE FUNCTION log_event();

CREATE TRIGGER log_player_trigger
    AFTER INSERT OR UPDATE
    ON player
    FOR EACH ROW
EXECUTE FUNCTION log_event_uid();

CREATE TRIGGER log_championship_trigger
    AFTER INSERT OR UPDATE
    ON championship
    FOR EACH ROW
EXECUTE FUNCTION log_event();

--
-- Insertion des données
-- Nicolas Crausaz & Maxime Scharwath
-- Version 2 - 19.01.2021
--

-- SPORT
INSERT INTO public.sport (id, name)
VALUES (5, 'Waterpolo'),
       (6, 'Handball'),
       (8, 'Volleyball'),
       (7, 'Rugby'),
       (2, 'Football'),
       (1, 'Basketball'),
       (3, 'Ice Hockey'),
       (4, 'Baseball');

-- STADIUM
INSERT INTO public.stadium (id, name, address, capacity)
VALUES (1, 'Malibu stadium', 'South Francescoview, 5819 Pons Laffitte', 36024),
       (3, 'Golf stadium', 'Le gallview, 6690 Lucienne de l''Abbaye', 54355),
       (4, 'A8 stadium', 'Port Micheleland, 69216 Shanie de Caumartin', 88948),
       (6, 'Model 3 stadium', 'Noelfurt, 78883 Perrin des Lombards', 57266),
       (7, 'Mercielago stadium', 'South Toreyburgh, 586 Meunier d''Argenteuil', 33130),
       (9, 'Accord stadium', 'New Marty, 72939 Irving d''Assas', 24689),
       (11, 'PT Cruiser stadium', 'Lemairebury, 077 Fleury Delesseux', 67722),
       (12, 'Explorer stadium', 'New Emilianostad, 399 Eileen des Lombards', 98454),
       (15, 'Fiesta stadium', 'South Kolbyhaven, 627 Pierre de Tilsitt', 61879),
       (16, 'Expedition stadium', 'West Helena, 611 Jacquet de Presbourg', 75697),
       (17, 'Civic stadium', 'West Dougstad, 5354 Fritz Charlemagne', 61127),
       (18, 'Impala stadium', 'South Ciceromouth, 67327 Domingo Joubert', 71547),
       (21, 'Focus stadium', 'East Amina, 046 Guillaume des Rosiers', 78453),
       (22, 'Roadster stadium', 'Baileyside, 8333 Huet d''Orsel', 83580),
       (23, 'LeBaron stadium', 'Lake Oscar, 8603 Myrl des Lombards', 79073),
       (25, 'XTS stadium', 'North Chasefort, 005 Dubois Saint-Honoré', 83418),
       (26, 'ATS stadium', 'Port Mariloustad, 33940 Vasseur de Montmorency', 45092),
       (27, 'Grand Cherokee stadium', 'New Cletus, 8818 Hubert du Chat-qui-Pêche', 86537),
       (28, 'Countach stadium', 'North Bonitaview, 3815 Prevost d''Argenteuil', 60233),
       (29, 'El Camino stadium', 'Rubyville, 49450 Dorothea de la Chaussée-d''Antin', 46375),
       (31, 'F-150 stadium', 'Cloydside, 64679 Brunet de la Huchette', 69271),
       (32, 'Element stadium', 'Port Friedrichfurt, 46609 Boyer de Paris', 14924),
       (33, 'Taurus stadium', 'New Makaylaton, 5954 Zena du Bac', 40014),
       (38, 'Charger stadium', 'Nicolasstad, 285 Ernestina Saint-Honoré', 40169),
       (39, 'Volt stadium', 'West Jessica, 6816 Deschamps Dauphine', 35596),
       (40, 'Altima stadium', 'West Ward, 2869 D''angelo de la Huchette', 39658),
       (41, '911 stadium', 'Lake Travisport, 22200 Karine Montorgueil', 36106),
       (42, 'Prius stadium', 'Francoisshire, 2392 Mortimer de Seine', 14285),
       (43, 'Sentra stadium', 'South Jovani, 61069 Savanah de la Huchette', 18896),
       (48, 'CTS stadium', 'South Linneashire, 00752 Jena Lepic', 74262),
       (30, 'Vaudoise Aréna', 'Prilly, Lausanne, Switzerland', 9600);

-- FEDERATION
INSERT INTO public.federation (id, name, sportid, active)
VALUES (1, 'Swiss Basketball', 1, TRUE),
       (2, 'SFL', 2, TRUE),
       (3, 'Swiss Handball League', 6, TRUE),
       (4, 'Swiss Hockey', 3, TRUE);

-- CLUB
INSERT INTO public.club (id, name, sportid, active)
VALUES (6, 'Servette FC', 2, TRUE),
       (4, 'BBC Nyon', 1, TRUE),
       (5, 'FC Sion', 2, TRUE),
       (3, 'Fribourg Olympic', 1, TRUE),
       (7, 'Kadetten Schaffhouse', 6, TRUE),
       (2, 'Lions de Genève', 1, TRUE),
       (1, 'Morges St-Prex Red Devils', 1, TRUE),
       (8, 'Wacker Thoune', 6, TRUE),
       (9, 'Lausanne Hockey Club', 3, TRUE),
       (10, 'Genève Servette', 3, TRUE);

-- LEAGUE
INSERT INTO public.league (id, level, gender, federationid, active)
VALUES (1, 'SBL League', 'M', 1, TRUE),
       (3, 'WLNB', 'F', 1, TRUE),
       (4, 'Raiffeisen Super League', 'M', 2, TRUE),
       (5, 'Nationalliga A', 'M', 3, TRUE),
       (6, 'National League A', 'M', 4, TRUE);

-- CHAMPIONSHIP
INSERT INTO public.championship (id, name, startat, endat, leagueid, active)
VALUES (4, 'SHL 2021', '2021-01-19', '2021-09-30', 5, TRUE),
       (5, 'Raiffaisen Super League 2021', '2021-01-01', '2021-12-31', 4, TRUE),
       (2, 'WLNB - Playoffs 2021', '2020-05-09', '2020-08-19', 3, TRUE),
       (6, 'Swiss League 2021', '2021-01-20', '2021-11-30', 6, TRUE),
       (3, 'SBL Cup 2021', '2021-01-17', '2021-02-26', 1, TRUE);


-- ADMINISTRATOR
INSERT INTO public.administrator (uid, email, lastname, firstname, password)
VALUES ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'nicolas.crausaz@ik.me', 'Crausaz', 'Nicolas',
        '$2b$10$WBmCa/oefxYdDElENGo.bek6iNhFDFCfWnFYKlRAhxDCduyiFKrPu'),
       ('7da5ac24-2c51-407e-a74b-31337e7de7d0', 'maxscharwath@gmail.com', 'Scharwath', 'Maxime',
        '$2b$10$ylGsXJQl0vpX9tI6DWuHRu9d/qCFMnfN5O.gSlERQW60CXSsayKku');

-- PLAYER
INSERT INTO public.player (uid, lastname, firstname, birthdate, height, weight, sex, active)
VALUES ('c8c7186f-8299-41ad-b192-0f72a971e463', 'Crausaz', 'Nicolas', '1999-08-02', 190, 70, 'M', TRUE),
       ('17fedd38-d4a8-49c5-becc-9b8b2bde39a8', 'Watts', 'Jolyon', '1996-05-15', 193, 112, 'M', TRUE),
       ('8e99eb15-7e75-4cd5-863a-52b351d70349', 'Grainger', 'Eugene', '1956-01-10', 140, 75, 'M', TRUE),
       ('54d25f0f-9b2f-4a67-9734-2b53e6f105fa', 'Griffiths', 'Annie', '2021-01-19', 170, 61, 'F', TRUE),
       ('0288428e-e57c-45d0-a5c4-bd9540818238', 'Schroeder', 'Hebe', '2020-06-07', 170, 96, 'M', TRUE),
       ('fb148c35-3128-4592-8281-0fd64ed10002', 'Wakatsuki', 'Yamato', '2001-05-09', 160, 76, 'M', TRUE),
       ('202f4469-53ad-49a2-a97b-60c0f26b209b', 'Friedli', 'Reto', '2021-01-19', 164, 86, 'M', TRUE),
       ('6b615f85-d727-4685-9439-393fb64f7be6', 'Raemy', 'Nicolas', '1979-02-09', 214, 106, 'M', TRUE),
       ('5fc0bdb4-931b-45f8-8345-917a04e15255', 'Guignet', 'Damien', '1968-02-04', 146, 81, 'M', TRUE),
       ('8e614847-ec64-492c-af1a-f24044f78235', 'Khasa', 'Jared', '1996-08-07', 164, 81, 'M', TRUE),
       ('e1128353-9194-4690-ba7f-5ebc41cbf73d', 'Hoarau', 'Guillaume', '1990-01-09', 162, 84, 'M', TRUE),
       ('3be416ee-388b-4ee1-a41a-3a0470ef2252', 'Scharwath', 'Maxime', '1997-03-22', 192, 70, 'M', TRUE),
       ('fe0ff1cb-c6ef-4f61-8aa7-faa95f43ebfd', 'Bruce Fayulu', 'Timothy', '1999-07-24', 184, 80, 'M', TRUE),
       ('1ad86934-4379-4d3a-8696-5acd04928cad', 'Andersson', 'Erik Mattias', '1998-03-13', 191, 90, 'M', TRUE),
       ('21d04095-2eff-440d-9447-e69bf7ac9eaa', 'Quina', 'Domingos', '1987-05-05', 153, 81, 'M', TRUE),
       ('446964b6-98fc-4a27-a38c-8bf5bd8c6cc9', 'Otasowie', 'Owen', '2004-04-05', 181, 100, 'M', TRUE),
       ('8d3d4440-370e-460f-b72a-3e30dad89638', 'Shaw', 'Luke', '1997-05-07', 177, 96, 'M', TRUE),
       ('6312dc10-88df-4df7-973e-17d6285f3d43', 'Hinds', 'Kaylen', '1973-01-09', 174, 94, 'M', TRUE),
       ('bf78a84c-87dd-4bc2-89a5-f13a0ee1a8e6', 'Silvo', 'Adrien', '2004-05-10', 164, 111, 'M', TRUE),
       ('c213031e-f512-470a-998b-eebe79ca88b7', 'Janmaat', 'Daryl', '1999-01-05', 136, 84, 'M', TRUE),
       ('69e64463-48ac-4d8d-9923-8ac5e1d72dba', 'Cotture', 'Arnaud', '1995-01-11', 164, 112, 'M', TRUE),
       ('5a71cacb-2fc2-4e6e-8249-9228f9626ace', 'Soares', 'Cédric', '1999-01-05', 180, 85, 'M', TRUE),
       ('1c5c5822-d590-4a5f-b1f0-a981f5c95458', 'Cahill', 'Gary', '1970-05-08', 197, 61, 'M', TRUE),
       ('8ddfe713-7499-4933-99c9-0f2cc7a3977a', 'Arter', 'Harry', '2005-06-15', 140, 82, 'M', TRUE),
       ('528aadf3-4b83-4119-964c-2fed03a7dc94', 'Gibson', 'Ben', '2003-06-02', 153, 80, 'M', TRUE),
       ('04abf440-fa51-43c2-afca-cfad45e118a8', 'Shabani', 'Meritan', '2000-05-19', 181, 89, 'M', TRUE),
       ('16cc283c-2fef-4d64-b5d5-69892abd2517', 'Dusan', 'Mladjan', '1995-01-10', 210, 91, 'M', TRUE),
       ('be5b564e-c7f8-4214-b287-64187c794133', 'Timothy', 'Derksen', '2005-05-25', 181, 94, 'M', TRUE),
       ('ee933874-936c-4377-9d28-dabc4c537df0', 'Vernon', 'Taylor', '1997-01-06', 166, 77, 'M', TRUE),
       ('cc8718ec-37b1-42f2-8fe0-9ed47cbb1e4c', 'Arthur', 'Edwards', '1974-02-02', 198, 84, 'M', TRUE),
       ('abcc9ede-bd4a-47e6-ab19-3f01cb8f4734', 'Toumi', 'Anissa', '2002-01-09', 166, 77, 'F', TRUE);

-- TEAM
INSERT INTO public.team (id, name, clubid, leagueid, active)
VALUES (6, 'Wacker Thoune 1', 8, 5, TRUE),
       (4, 'FC Sion 1', 5, 4, TRUE),
       (7, 'Fribourg Olympic 1', 3, 1, TRUE),
       (10, 'Lausanne HC', 9, 6, TRUE),
       (8, 'Lions de Genève 1', 2, 1, TRUE),
       (9, 'Servette FC 1', 6, 4, TRUE),
       (3, 'Red Devils 2LF', 1, 3, TRUE),
       (2, 'BBC Nyon 1', 4, 1, TRUE),
       (11, 'Servette 1', 10, 6, TRUE),
       (5, 'Kadetten Schaffhouse 1', 7, 5, TRUE),
       (1, 'Red Devils 1', 1, 1, TRUE);


-- PLAYER PLAY FOR TEAM
INSERT INTO public.player_play_for_team (jerseynumber, startat, endat, playeruid, teamid)
VALUES (5, '2021-01-19 16:08:57.762641', NULL, 'c8c7186f-8299-41ad-b192-0f72a971e463', 1),
       (4, '2021-01-19 16:14:18.707672', NULL, '8e99eb15-7e75-4cd5-863a-52b351d70349', 1),
       (6, '2021-01-19 16:14:28.262662', NULL, '0288428e-e57c-45d0-a5c4-bd9540818238', 1),
       (60, '2021-01-19 16:15:31.988044', NULL, '54d25f0f-9b2f-4a67-9734-2b53e6f105fa', 3),
       (15, '2021-01-19 16:23:13.131775', NULL, 'fb148c35-3128-4592-8281-0fd64ed10002', 4),
       (3, '2021-01-19 16:32:12.784084', NULL, '5fc0bdb4-931b-45f8-8345-917a04e15255', 6),
       (5, '2021-01-19 16:32:20.424404', NULL, '6b615f85-d727-4685-9439-393fb64f7be6', 6),
       (10, '2021-01-19 16:32:26.786659', NULL, '202f4469-53ad-49a2-a97b-60c0f26b209b', 6),
       (29, '2021-01-19 16:46:00.845491', NULL, '8e614847-ec64-492c-af1a-f24044f78235', 4),
       (99, '2021-01-19 16:48:17.780985', NULL, 'e1128353-9194-4690-ba7f-5ebc41cbf73d', 4),
       (3, '2021-01-19 17:48:51.725483', NULL, '1ad86934-4379-4d3a-8696-5acd04928cad', 4),
       (1, '2021-01-19 17:49:07.690308', NULL, 'fe0ff1cb-c6ef-4f61-8aa7-faa95f43ebfd', 4),
       (22, '2021-01-19 17:49:28.268537', NULL, '3be416ee-388b-4ee1-a41a-3a0470ef2252', 2),
       (1, '2021-01-19 17:58:07.954733', NULL, '21d04095-2eff-440d-9447-e69bf7ac9eaa', 5),
       (0, '2021-01-19 17:58:18.612581', NULL, '446964b6-98fc-4a27-a38c-8bf5bd8c6cc9', 5),
       (NULL, '2021-01-19 17:58:28.853817', '2021-01-19 17:59:22.639249', '8d3d4440-370e-460f-b72a-3e30dad89638', 5),
       (10, '2021-01-19 17:59:33.662865', NULL, '8d3d4440-370e-460f-b72a-3e30dad89638', 5),
       (21, '2021-01-19 18:04:38.889832', NULL, 'c213031e-f512-470a-998b-eebe79ca88b7', 2),
       (4, '2021-01-19 18:04:49.131295', NULL, '6312dc10-88df-4df7-973e-17d6285f3d43', 2),
       (89, '2021-01-19 18:05:00.787882', NULL, 'bf78a84c-87dd-4bc2-89a5-f13a0ee1a8e6', 2),
       (7, '2021-01-19 18:06:29.140820', NULL, '69e64463-48ac-4d8d-9923-8ac5e1d72dba', 7),
       (80, '2021-01-19 18:06:36.874828', NULL, '1c5c5822-d590-4a5f-b1f0-a981f5c95458', 7),
       (2, '2021-01-19 18:06:44.109878', NULL, '5a71cacb-2fc2-4e6e-8249-9228f9626ace', 7),
       (4, '2021-01-19 18:08:42.767390', NULL, '04abf440-fa51-43c2-afca-cfad45e118a8', 10),
       (90, '2021-01-19 18:08:50.655877', NULL, '528aadf3-4b83-4119-964c-2fed03a7dc94', 10),
       (12, '2021-01-19 18:08:57.889718', NULL, '8ddfe713-7499-4933-99c9-0f2cc7a3977a', 10),
       (68, '2021-01-19 18:11:01.798788', NULL, '16cc283c-2fef-4d64-b5d5-69892abd2517', 8),
       (421, '2021-01-19 18:11:15.746553', NULL, 'be5b564e-c7f8-4214-b287-64187c794133', 8),
       (5, '2021-01-19 18:13:00.357207', NULL, 'cc8718ec-37b1-42f2-8fe0-9ed47cbb1e4c', 9),
       (78, '2021-01-19 18:13:34.463581', NULL, 'ee933874-936c-4377-9d28-dabc4c537df0', 9),
       (45, '2021-01-19 18:15:16.272513', NULL, 'abcc9ede-bd4a-47e6-ab19-3f01cb8f4734', 3);

-- ADMIN CLUB
INSERT INTO public.administrator_club (administratoruid, clubid)
VALUES ('1da28e7d-39ab-46c8-ba22-1752129850e0', 1),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 2),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 3),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 4),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 5),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 6),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 7),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 8),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 9),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 10);

-- ADMIN FEDERATION
INSERT INTO public.administrator_federation (administratoruid, federationid)
VALUES ('1da28e7d-39ab-46c8-ba22-1752129850e0', 1),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 2),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 3),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 4);

-- ADMIN PLAYER
INSERT INTO public.administrator_player (administratoruid, playeruid)
VALUES ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'c8c7186f-8299-41ad-b192-0f72a971e463'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '17fedd38-d4a8-49c5-becc-9b8b2bde39a8'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '8e99eb15-7e75-4cd5-863a-52b351d70349'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '54d25f0f-9b2f-4a67-9734-2b53e6f105fa'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '0288428e-e57c-45d0-a5c4-bd9540818238'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'fb148c35-3128-4592-8281-0fd64ed10002'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '202f4469-53ad-49a2-a97b-60c0f26b209b'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '6b615f85-d727-4685-9439-393fb64f7be6'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '5fc0bdb4-931b-45f8-8345-917a04e15255'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '8e614847-ec64-492c-af1a-f24044f78235'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'e1128353-9194-4690-ba7f-5ebc41cbf73d'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '3be416ee-388b-4ee1-a41a-3a0470ef2252'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'fe0ff1cb-c6ef-4f61-8aa7-faa95f43ebfd'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '1ad86934-4379-4d3a-8696-5acd04928cad'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '21d04095-2eff-440d-9447-e69bf7ac9eaa'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '446964b6-98fc-4a27-a38c-8bf5bd8c6cc9'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '8d3d4440-370e-460f-b72a-3e30dad89638'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '6312dc10-88df-4df7-973e-17d6285f3d43'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'bf78a84c-87dd-4bc2-89a5-f13a0ee1a8e6'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'c213031e-f512-470a-998b-eebe79ca88b7'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '69e64463-48ac-4d8d-9923-8ac5e1d72dba'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '5a71cacb-2fc2-4e6e-8249-9228f9626ace'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '1c5c5822-d590-4a5f-b1f0-a981f5c95458'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '8ddfe713-7499-4933-99c9-0f2cc7a3977a'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '528aadf3-4b83-4119-964c-2fed03a7dc94'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '04abf440-fa51-43c2-afca-cfad45e118a8'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', '16cc283c-2fef-4d64-b5d5-69892abd2517'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'be5b564e-c7f8-4214-b287-64187c794133'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'ee933874-936c-4377-9d28-dabc4c537df0'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'cc8718ec-37b1-42f2-8fe0-9ed47cbb1e4c'),
       ('1da28e7d-39ab-46c8-ba22-1752129850e0', 'abcc9ede-bd4a-47e6-ab19-3f01cb8f4734');

-- EVENT
INSERT INTO public.event (uid, name, startat, endat, createdat, updatedat, stadiumid)
VALUES ('8a82947a-eba3-4a41-b2f3-4d9555d27c83', 'Meeting', '2021-01-19 15:00:00.000000', '2021-01-19 16:00:00.000000',
        '2021-01-19 16:08:34.482416', '2021-01-19 16:08:34.482416', 30),
       ('18a7faf0-f44c-4659-ae7d-5d62b8310ce7', 'Outside', '2021-03-09 18:00:00.000000', '2021-03-09 20:00:00.000000',
        '2021-01-19 16:39:24.212090', '2021-01-19 16:39:24.212090', 27),
       ('a0fab8b5-907a-4ec9-b739-b68fd884a2a1', 'Game 1', '2021-04-14 08:00:00.000000', '2021-04-14 10:00:00.000000',
        '2021-01-19 16:33:04.593252', '2021-01-19 16:33:04.593252', 40),
       ('6a57fcf9-278c-4c70-8d5f-e2ddc8f6434f', 'Game #1321', '2020-10-06 02:00:00.000000',
        '2020-10-06 05:00:00.000000', '2021-01-19 16:37:30.269164', '2021-01-19 16:37:30.269164', 9),
       ('39adfc26-051b-4912-a067-5327d5544766', 'Game 23', '2021-01-29 06:00:00.000000', '2021-01-29 08:00:00.000000',
        '2021-01-19 17:48:56.313231', '2021-01-19 17:48:56.313231', 3),
       ('8038526a-4f37-4409-ad2c-3a561d54f6d0', 'Game 45', '2021-01-27 07:00:00.000000', '2021-01-27 08:00:00.000000',
        '2021-01-19 17:48:26.664500', '2021-01-19 17:48:26.664500', 21),
       ('51ba6301-4a5d-493e-af00-492f686d0706', 'Cardio', '2021-01-22 17:00:00.000000', '2021-01-22 19:00:00.000000',
        '2021-01-19 18:01:31.713330', '2021-01-19 18:01:31.713330', 30),
       ('6568268d-9a78-4830-8e68-968b0bb0c764', '1/2 Final', '2021-04-15 02:00:00.000000', '2021-04-15 02:00:00.000000',
        '2021-01-20 09:26:08.398841', '2021-01-20 09:26:08.398841', 23),
       ('4bd7bbb6-1631-4c02-8436-75194c7a0cf4', 'Game 2222', '2021-04-14 02:00:00.000000', '2021-04-14 02:00:00.000000',
        '2021-01-20 09:35:18.578566', '2021-01-20 09:35:18.578566', 21),
       ('93d40df5-855f-4feb-a21c-009f19b47478', 'Official 1121', '2021-01-21 01:00:00.000000',
        '2021-01-21 01:00:00.000000', '2021-01-20 09:57:44.078470', '2021-01-20 09:57:44.078470', 18),
       ('8c77371a-7b23-4c9e-89e2-0d8bd294c72e', 'SCHAFFHOUSE - WACKER THOUNE', '2021-01-20 01:00:00.000000',
        '2021-01-20 01:00:00.000000', '2021-01-20 09:53:32.731604', '2021-01-20 09:53:32.731604', 9),
       ('b2cad0a3-9127-454f-b832-512582388ef8', 'LIONS DE GENÈVE 1 - BBC NYON 1', '2021-01-11 01:00:00.000000',
        '2021-01-11 01:00:00.000000', '2021-01-19 16:04:05.781298', '2021-01-19 16:04:05.781298', 41),
       ('01c0e46a-2fe2-486b-99ed-2544731376b9', 'Final', '2021-05-13 02:00:00.000000', '2021-05-13 02:00:00.000000',
        '2021-01-20 10:26:54.556749', '2021-01-20 10:26:54.556749', 27),
       ('6e533990-2d19-4031-9157-ac42e87557b9', 'BBC NYON 1 - FRIBOURG OLYMPIC 1', '2021-02-22 01:00:00.000000',
        '2021-02-22 01:00:00.000000', '2021-01-20 09:56:25.495377', '2021-01-20 09:56:25.495377', 4);

-- GAME
INSERT INTO public.game (eventuid, gameid, scorehome, scoreguest, canceled, championshipid, teamhomeid, teamguestid)
VALUES ('a0fab8b5-907a-4ec9-b739-b68fd884a2a1', '1231231', 3, 2, FALSE, 4, 5, 6),
       ('6a57fcf9-278c-4c70-8d5f-e2ddc8f6434f', '123123123', 12, 16, FALSE, 4, 6, 5),
       ('8038526a-4f37-4409-ad2c-3a561d54f6d0', '3434232', 0, 0, FALSE, 3, 8, 7),
       ('39adfc26-051b-4912-a067-5327d5544766', '43435', 0, 0, FALSE, 3, 7, 8),
       ('6568268d-9a78-4830-8e68-968b0bb0c764', '566556', 0, 0, FALSE, 3, 8, 7),
       ('4bd7bbb6-1631-4c02-8436-75194c7a0cf4', '124123412', 0, 0, FALSE, 5, 9, 4),
       ('93d40df5-855f-4feb-a21c-009f19b47478', '778', 0, 0, FALSE, 4, 5, 6),
       ('8c77371a-7b23-4c9e-89e2-0d8bd294c72e', 'dfds', 0, 0, FALSE, 4, 5, 6),
       ('b2cad0a3-9127-454f-b832-512582388ef8', '7546812', 65, 63, FALSE, 3, 8, 2),
       ('01c0e46a-2fe2-486b-99ed-2544731376b9', '34234', 0, 0, FALSE, 6, 11, 10),
       ('6e533990-2d19-4031-9157-ac42e87557b9', '234234', 0, 0, FALSE, 3, 2, 7);

-- TRAINING
INSERT INTO public.training (eventuid, description, teamid)
VALUES ('8a82947a-eba3-4a41-b2f3-4d9555d27c83', 'Outside running !!', 1),
       ('18a7faf0-f44c-4659-ae7d-5d62b8310ce7', 'Let''s go', 3),
       ('51ba6301-4a5d-493e-af00-492f686d0706',
        'Petit footing avec la team! Pour booster le cardio, car	Christoph Bertschy avait un peu de la peine à souffler hier au match.',
        10);

-- Reset Serials Increments
SELECT SETVAL('league_id_seq', (SELECT MAX(id) FROM league));
SELECT SETVAL('sport_id_seq', (SELECT MAX(id) FROM sport));
SELECT SETVAL('championship_id_seq', (SELECT MAX(id) FROM championship));
SELECT SETVAL('federation_id_seq', (SELECT MAX(id) FROM federation));
SELECT SETVAL('team_id_seq', (SELECT MAX(id) FROM team));
SELECT SETVAL('event_log_id_seq', (SELECT MAX(id) FROM event_log));
SELECT SETVAL('stadium_id_seq', (SELECT MAX(id) FROM stadium));
SELECT SETVAL('club_id_seq', (SELECT MAX(id) FROM club));

-- Service Account for backend
--DROP OWNED BY bdruser;
--DROP USER bdruser;
CREATE USER bdruser WITH ENCRYPTED PASSWORD 'password';
GRANT CONNECT ON DATABASE bdr_proj_crausaz_scharwath TO bdruser;
GRANT USAGE ON SCHEMA public TO bdruser;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO bdruser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bdruser;