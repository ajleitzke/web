---
title: "NFL Data Project"
date: 2023-05-10T07:27:54-06:00
draft: false
categories: ["analytics", "projects"]
tags: ["analytics", "data visualization", "data collection", "SQL"]
---

As a final project for my Database Management class, my group and I decided to analyze NFL statistics and front offices from 2009-2019 using SQL. The project site is linked [here](https://apex.oracle.com/pls/apex/r/nfl_data_project/nfl-data-analysis/home?session=100636108704812), where you can find our analysis, visualizations, and tables.

## SQL Queries

Q1: Team Success

```sql
SELECT TEAMNAME, WINS, CASE 
    WHEN WINS >= 14 THEN 'Great' 
    WHEN WINS >= 10 THEN 'Good' 
    WHEN WINS >= 7 THEN 'Okay' 
    ELSE 'Poor' 
END AS SeasonPerformance 
FROM TEAM 
JOIN STATS ON TEAM.TEAMID = STATS.TEAMID
JOIN SEASON ON STATS.SeasonID = SEASON.SeasonID
WHERE SEASON.SEASONID = '2019' 
ORDER BY WINS DESC;
```

Q2: Head Coach Visualization

```sql
SELECT
  CONCAT(CONCAT(FirstName, ' '), LastName) AS HeadCoachName, 
  COUNT(DISTINCT TeamName) AS NumTeamsCoached, 
  SUM(Wins) AS TotalWins,
  CONCAT(ROUND(SUM(WINS) / SUM(WINS + LOSSES) * 100, 2), '%') AS WinPercentage,
  ROUND(AVG(WINS),2) AS AverageWins
FROM COACHES
JOIN STATS ON COACHES.CoachID = STATS.CoachID
JOIN TEAM ON STATS.TeamID = TEAM.TeamID
GROUP BY FirstName, LastName
ORDER BY TotalWins DESC;
```

Q3: Wins Visualization

```sql
SELECT TeamName, SUM(WINS) AS TotalWins, SUM(POINTSSCORED) AS TotalPointsScored
FROM TEAM
JOIN STATS ON TEAM.TeamID = STATS.TeamID
GROUP BY TeamName
ORDER BY TotalWins DESC
FETCH FIRST 10 ROWS ONLY;
```

Q3: Points Visualization

```sql
SELECT TeamName, SUM(WINS) AS TotalWins, SUM(POINTSSCORED) AS TotalPointsScored
FROM TEAM
JOIN STATS ON TEAM.TeamID = STATS.TeamID
GROUP BY TeamName
ORDER BY TotalWins DESC
FETCH FIRST 10 ROWS ONLY;
```

Q4: Passing Yards Visualization

```sql
SELECT TeamName, SUM(PassingYards) AS PassingYards, SUM(PassingTds) AS PassingTDs
FROM STATS
JOIN TEAM ON STATS.TeamID = TEAM.TeamID
GROUP BY TeamName
ORDER BY PassingYards DESC;
```

Q4: Passing Touchdowns Visualization

```sql
SELECT TeamName, SUM(PassingYards) AS PassingYards, SUM(PassingTds) AS PassingTDs
FROM STATS
JOIN TEAM ON STATS.TeamID = TEAM.TeamID
GROUP BY TeamName
ORDER BY PassingTds DESC;
```

Q4: Rushing Yards Visualization

```sql
SELECT TeamName, SUM(RushingYards) AS RushingYards, SUM(RushingTds) AS RushingTDs
FROM STATS
JOIN TEAM ON STATS.TeamID = TEAM.TeamID
GROUP BY TeamName
ORDER BY RushingYards DESC;
```

Q4: Rushing Touchdowns Visualization

```sql
SELECT TeamName, SUM(RushingYards) AS RushingYards, SUM(RushingTds) AS RushingTDs
FROM STATS
JOIN TEAM ON STATS.TeamID = TEAM.TeamID
GROUP BY TeamName
ORDER BY RushingTds DESC;
```

Q5: Division Success

```sql
SELECT Conference, Division, SUM(Wins) AS TotalWins
FROM TEAM 
JOIN STATS ON TEAM.TeamID = STATS.TeamID
GROUP BY Division, Conference
ORDER BY TotalWins DESC;
```
