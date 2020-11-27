--
-- Selections des données
-- Nicolas Crausaz & Maxime Scharwath
-- Version 1 - 27.11.2020
-- 

-- Selectionner les évenements d'une équipe

-- Selectionner les joueurs d'une équipe
SELECT uid as player_id,
       lastname,
       firstname,
       birthdate,
       jerseynumber,
       startat,
       endat,
       name as team_name,
       clubid
FROM player
         INNER JOIN player_play_for_team ppft ON player.uid = ppft.playeruid
         INNER JOIN team t ON ppft.teamid = t.id

WHERE t.id = <teamid> AND (endat IS NULL OR endat > NOW());

-- Selectionner les matchs d'un championnat

SELECT eventuid,
       gameid,
       scorehome AS host_team_score,
       scoreguest AS guest_team_score,
       canceled,
       teamhomeid AS host_team_id,
       teamguestid AS guest_team_id,
       t.name  AS host_team_name,
       t2.name AS guest_team_name
FROM championship c
         INNER JOIN game g ON c.id = g.championshipid
         INNER JOIN team t ON t.id = g.teamhomeid
         INNER JOIN team t2 ON t2.id = g.teamguestid
WHERE c.id = <championshipid>;

-- Selectionner les equipes d'un club

-- Selectionner les championnats d'une saison

-- Selectionner les ligues d'un championnat

-- Selectionner les équipes d'une ligue

-- Selectionner les leagues d'un championnat

-- Selectionner les ressources d'un admin

-- Selectionner les saisons
SELECT *
FROM season;

-- Selectionner les sports
SELECT *
FROM sport;

-- Selectionner les stades
SELECT *
FROM stadium;




