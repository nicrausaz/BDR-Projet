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

--Example d'utlisation: Donne pour chaque équipe le nb de match, le nb de match gagnant, le nombre de match perdu, le nombre de match égalité
SELECT teamid,
       COUNT(*)                                      AS nbGame,
       SUM(CASE WHEN result = 'W' then 1 else 0 end) AS nbWin,
       SUM(CASE WHEN result = 'L' then 1 else 0 end) AS nbLost,
       SUM(CASE WHEN result = 'D' then 1 else 0 end) AS nbDraw
FROM team_played_games
GROUP BY teamid;
