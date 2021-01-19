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
           WHEN scorehome < scoreguest AND teamhomeid = t.teamid THEN 'W'
           WHEN scorehome = scoreguest THEN 'D'
           ELSE 'L' END AS result
FROM (
         SELECT teamhomeid AS teamid, *
         FROM event_game
         UNION
         SELECT teamguestid AS teamid, *
         FROM event_game
     ) AS t
    );


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
