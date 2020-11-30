--
-- Selections des données
-- Nicolas Crausaz & Maxime Scharwath
-- Version 1 - 28.11.2020
--
-- PS: Les champs variables sont écrits entre <>
--

-- Selectionner les évenements d'une équipe
    -- Entrainements
    SELECT uid as event_uid, name as event_name, startat, endat, createdat, updatedat, stadiumid, description as training_description
    FROM event
        INNER JOIN training t ON event.uid = t.eventuid
    WHERE teamid = <teamid>;

    -- Matchs
    SELECT uid as event_uid, name as event_name, startat, endat, createdat, updatedat, stadiumid, gameid, scorehome, scoreguest, championshipid
    FROM event
        INNER JOIN game g ON event.uid = g.eventuid
    WHERE teamguestid = <teamid> OR teamhomeid = <teamid>;

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

-- Selectionner un club et son sport
SELECT c.id as club_id, c.name as club_name, s.name as sport_name
FROM club c
    INNER JOIN sport s ON s.id = c.sportid
WHERE c.id = <clubid>

-- Selectionner les équipes d'un club
SELECT t.id as team_id, t.name as team_name
FROM club c
    INNER JOIN team t ON c.id = t.clubid
WHERE  c.id = <clubid>;

-- Selectionner les championnats d'une saison
SELECT c.id, c.name, c.startat, c.endat
FROM championship c
         INNER JOIN season s ON s.id = c.seasonid
WHERE s.id = <seasonid>;

-- Selectionner les championnats d'une ligue
SELECT c.id, c.name, c.startat, c.endat
FROM championship c
         INNER JOIN league l ON l.id = c.leagueid
WHERE l.id = <leagueid>;

-- Selectionner les équipes d'une ligue
SELECT t.id, t.name
FROM team t
    INNER JOIN league l ON t.leagueid = l.id
WHERE l.id = <leagueid>;

-- Selectionner un administrateur et ses ressources
    -- Clubs
    SELECT uid, email, lastname, firstname, clubid
    FROM administrator
        INNER JOIN administrator_club ac ON uid = ac.administratoruid
    WHERE uid = <uid>;

    -- Federations
    SELECT uid, email, lastname, firstname, federationid
    FROM administrator
        INNER JOIN administrator_federation ON uid = administratoruid
    WHERE uid = <uid>;

    -- Joueurs
    SELECT uid, email, lastname, firstname, playeruid
    FROM administrator
        INNER JOIN administrator_player ac ON uid = administratoruid
    WHERE uid = <uid>;


-- Selectionner une fédération et son sport
SELECT f.id, f.name, s.name as sport
FROM federation f
    INNER JOIN sport s ON f.sportid = s.id
WHERE f.id = <federationid>;

-- Selectionner les ligues d'une fédération
SELECT l.id, l.level, l.gender
FROM federation f
         INNER JOIN league l ON f.id = l.federationid
WHERE f.id = <federationid>

-- Selectionner les saisons
SELECT *
FROM season;

-- Selectionner les sports
SELECT *
FROM sport;

-- Selectionner les stades
SELECT *
FROM stadium;

-- Selectionner un stade
SELECT *
FROM stadium
WHERE id = <stadiumid>

-- Récupère le nb de match, le nb de match gagnant, le nombre de match perdu, le nombre de match égalité pour chaque équipe
SELECT teamid,
       COUNT(*)                                      AS nbGame,
       SUM(CASE WHEN result = 'W' then 1 else 0 end) AS nbWin,
       SUM(CASE WHEN result = 'L' then 1 else 0 end) AS nbLost,
       SUM(CASE WHEN result = 'D' then 1 else 0 end) AS nbDraw
FROM team_played_games
GROUP BY teamid;

