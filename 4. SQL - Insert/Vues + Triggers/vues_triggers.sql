--
-- Création des vues & triggers
-- Nicolas Crausaz & Maxime Scharwath
-- Version 1 - 27.11.2020
-- 

-- Vue pour evénement de type match
CREATE VIEW event_game AS (
    SELECT *
    FROM event
        INNER JOIN game ON event.uid = eventuid
);

-- Vue pour evénement de type entrâinement
CREATE VIEW event_training AS (
    SELECT *
    FROM event
        INNER JOIN training ON event.uid = eventuid
);

-- Match joués par 1 equipe

--creer une vue qui affiche les matchs joué par chaque équipe et indique si le match est gagnant/perdant/égalité dans un nouveau champs result
CREATE VIEW team_played_games AS
(
SELECT *,
       CASE
           WHEN scorehome < scoreguest AND teamhomeid = t.teamid THEN 'W'
           WHEN scorehome = scoreguest THEN 'D'
           ELSE 'L' end as result
FROM (
         SELECT teamhomeid AS teamid, *
         FROM event_game
         UNION
         SELECT teamguestid AS teamid, *
         FROM event_game
     ) as t
    );



CREATE VIEW event_list AS
(
    SELECT *, 'training' AS eventtype
    FROM event
             JOIN training ON uid = training.eventuid
    UNION
    SELECT *, 'game' AS eventtype
    FROM event
             JOIN game ON uid = game.eventuid;
);

-- Triggers
CREATE TABLE event_log
(
    id          SERIAL PRIMARY KEY,
    event       VARCHAR NOT NULL,
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
        INSERT INTO event_log (event, resourceid, operation, tablename) VALUES (CONCAT(lower(tg_op), ' ', tg_table_name), OLD.id, lower(tg_op), tg_table_name);
        RETURN OLD;
    ELSE
        INSERT INTO event_log (event, resourceid, operation, tablename) VALUES (CONCAT(lower(tg_op), ' ', tg_table_name), NEW.id, lower(tg_op), tg_table_name);
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
        INSERT INTO event_log (event, resourceid, operation, tablename) VALUES (CONCAT(lower(tg_op), ' ', tg_table_name), OLD.uid, lower(tg_op), tg_table_name);
        RETURN OLD;
    ELSE
        INSERT INTO event_log (event, resourceid, operation, tablename) VALUES (CONCAT(lower(tg_op), ' ', tg_table_name), NEW.uid, lower(tg_op), tg_table_name);
        RETURN NEW;
    END IF;
END
$$;


CREATE TRIGGER log_player_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON player
    FOR EACH ROW
EXECUTE FUNCTION log_event_uid();

CREATE TRIGGER log_club_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON club
    FOR EACH ROW
EXECUTE FUNCTION log_event();


DROP TRIGGER log_federation_trigger ON federation;

DROP TRIGGER log_league_trigger ON league;

DROP TRIGGER log_team_trigger ON team;


CREATE TRIGGER log_federation_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON federation
    FOR EACH ROW
EXECUTE FUNCTION log_event();

CREATE TRIGGER log_league_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON league
    FOR EACH ROW
EXECUTE FUNCTION log_event();

CREATE TRIGGER log_team_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON team
    FOR EACH ROW
EXECUTE FUNCTION log_event();

CREATE TRIGGER log_player_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON player
    FOR EACH ROW
EXECUTE FUNCTION log_event_uid();

CREATE TRIGGER log_club_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON club
    FOR EACH ROW
EXECUTE FUNCTION log_event();


