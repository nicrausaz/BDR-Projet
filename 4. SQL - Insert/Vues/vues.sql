--
-- Création des vues
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
CREATE VIEW team_played_games AS
(
    SELECT teamhomeid as teamid, * FROM event_game
    UNION
    SELECT teamguestid as teamid, * FROM event_game
);