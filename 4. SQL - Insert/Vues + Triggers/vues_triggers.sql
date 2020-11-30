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