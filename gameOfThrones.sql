--- ##### DROP TABLES WITH SAME NAME #####

drop table childrengot;
drop table leadergot;
drop table othernamesgot;
drop table charactergot;
drop table placegot;
drop table usersgot;
drop table seasongot;
drop table groupgot;

--- ##### CREATES TABLES #####
/*
Note: that we are using varchar and not date for birthday because the months and days in GoT are different than in real life

Please also note that often we are not using the not null constraint simply because we do not have the data (for example year of birth)
*/

CREATE TABLE GroupGoT
(name VARCHAR(30) NOT NULL PRIMARY KEY);

CREATE TABLE SeasonGoT
(num INTEGER NOT NULL PRIMARY KEY,
approx_year INTEGER NOT NULL);

CREATE TABLE UsersGoT
(username VARCHAR(30) NOT NULL PRIMARY KEY,
password VARCHAR(30) NOT NULL UNIQUE,
season INTEGER NOT NULL,
isModerator NUMBER(1) DEFAULT 0 NOT NULL,
CONSTRAINT fk_userSeason
FOREIGN KEY (season)
REFERENCES SeasonGoT(num));

/*
Note: name of the place is not really necessary but is still a candidate the primary key because we can not define a combination of attribute to be the key if they contain null values
*/

CREATE TABLE PlaceGot
(name VARCHAR(30) NOT NULL PRIMARY KEY,
name_group VARCHAR(30) NOT NULL,
name_island VARCHAR(30),
name_region VARCHAR(30),
name_city VARCHAR(30),
name_castle VARCHAR(30),
CONSTRAINT fk_groupNamePlace
FOREIGN KEY (name_group)
REFERENCES GroupGoT(name));

CREATE TABLE CharacterGoT
(name VARCHAR(30) NOT NULL PRIMARY KEY,
year_of_birth INTEGER,
gender CHAR(1) NOT NULL,
job VARCHAR(30),
first_appearance INTEGER NOT NULL,
name_partner VARCHAR(30) REFERENCES CharacterGoT(name),
name_killer VARCHAR(30) REFERENCES CharacterGoT(name),
killed_in_season INTEGER,
name_group VARCHAR(30),
place_of_living VARCHAR(30) NOT NULL,
number_episodes INTEGER NOT NULL,
CONSTRAINT fk_firstAppearance
FOREIGN KEY (first_appearance)
REFERENCES SeasonGoT(num),
CONSTRAINT fk_killedSeason
FOREIGN KEY (killed_in_season)
REFERENCES SeasonGoT(num),
CONSTRAINT fk_groupNameCharacter
FOREIGN KEY (name_group)
REFERENCES GroupGoT(name),
CONSTRAINT fk_placeLiving
FOREIGN KEY (place_of_living)
REFERENCES PlaceGoT(name));

CREATE TABLE OtherNamesGot
(other_name VARCHAR(30) NOT NULL PRIMARY KEY,
real_name VARCHAR(30) NOT NULL,
CONSTRAINT fk_otherName
FOREIGN KEY (real_name)
REFERENCES CharacterGot(name));

CREATE TABLE LeaderGoT
(name VARCHAR(30) NOT NULL PRIMARY KEY,
aspires_to_throne NUMBER(1) DEFAULT 0 NOT NULL,
name_group VARCHAR(30) NOT NULL,
since_season INTEGER,
CONSTRAINT fk_nameLeader
FOREIGN KEY (name)
REFERENCES CharacterGot(name),
CONSTRAINT fk_groupNameLeader
FOREIGN KEY (name_group)
REFERENCES GroupGoT(name),
CONSTRAINT fk_sinceSeason
FOREIGN KEY (since_season)
REFERENCES SeasonGoT(num));

--- should have at least a father or a mother (if not should not save him)

CREATE TABLE ChildrenGoT
(name VARCHAR(30) NOT NULL PRIMARY KEY,
name_mother VARCHAR(30),
name_father VARCHAR(30),
CONSTRAINT check_parents CHECK (name_mother IS NOT NULL OR name_father IS NOT NULL),
CONSTRAINT fk_nameChild
FOREIGN KEY (name)
REFERENCES CharacterGot(name),
CONSTRAINT fk_nameMother
FOREIGN KEY (name_mother)
REFERENCES CharacterGot(name),
CONSTRAINT fk_nameFather
FOREIGN KEY (name_father)
REFERENCES CharacterGot(name));


--- ##### POPULATES TABLES #####

--- GroupGot

insert into GroupGot values
('Stark');
insert into GroupGot values
('Tully');
insert into GroupGot values
('Baratheon');
insert into GroupGot values
('Bolton');
insert into GroupGot values
('Lannister');
insert into GroupGot values
('Greyjoy');
insert into GroupGot values
('Nights Watch');
insert into GroupGot values
('Tyrell');
insert into GroupGot values
('Arryn');
insert into GroupGot values
('Baelish');


--- SeasonGot

insert into SeasonGot values
(1,298);
insert into SeasonGot values
(2,299);
insert into SeasonGot values
(3,300);
insert into SeasonGot values
(4,301);
insert into SeasonGot values
(5,302);
insert into SeasonGot values
(6,303);
insert into SeasonGot values
(7,304);


--- PlaceGot

insert into PlaceGot
(name, name_group, name_island)
values
('Iron Islands', 'Greyjoy', 'Westeros');

insert into PlaceGot
(name, name_group, name_island, name_region, name_city)
values
('Winterfell', 'Stark', 'Westeros', 'North', 'Winterfell');

insert into PlaceGot
(name, name_group, name_island, name_region, name_castle)
values
('Castle Black', 'Nights Watch', 'Westeros', 'North', 'Castle Black');

insert into PlaceGot
(name, name_group, name_island, name_region)
values
('North', 'Stark', 'Westeros', 'North');

insert into PlaceGot
(name, name_group, name_island, name_region, name_city, name_castle)
values
('Casterly Rock', 'Lannister', 'Westeros', 'Crownlands', 'Kings Landing', 'Casterly Rock');

insert into PlaceGot
(name, name_group, name_island, name_region, name_city)
values
('Eyrie', 'Arryn', 'Westeros', 'Vale of Arryn', 'Eyrie');


--- CharacterGot

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_group, place_of_living, number_episodes)
values
('Tyrion Lannister', 265, 'M', 'Hand of the Queen', 1, 'Lannister', 'Casterly Rock', 54);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_killer, killed_in_season, name_group, place_of_living, number_episodes)
values
('Tywin Lannister', 234, 'M', 'Lord of Casterly Rock', 1, 'Tyrion Lannister', 5, 'Lannister', 'Casterly Rock',27);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_group, place_of_living, number_episodes)
values
('Cersei Lannister', 261, 'F', 'Queen', 1, 'Lannister', 'Casterly Rock', 52);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living, number_episodes)
values
('Robert Baratheon',262, 'M', 'Lord of the Seven Kingdoms', 1, 'Cersei Lannister', 'Cersei Lannister', 1, 'Baratheon', 'Casterly Rock', 7);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_group, place_of_living, number_episodes)
values
('Jaime Lannister', 261, 'M', 'Knight', 1, 'Lannister', 'Casterly Rock', 43);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_group, place_of_living, number_episodes)
values
('Petyr Baelish', 268, 'M', 'Lord Protector of the Vale', 1, 'Baelish', 'North', 34);

insert into CharacterGot
(name, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living, number_episodes)
values
('Lysa Arryn', 'F', 'Lady Regent of the Vale', 1, 'Petyr Baelish', 'Petyr Baelish', 4, 'Arryn', 'Eyrie', 5);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_killer, killed_in_season, name_group, place_of_living, number_episodes)
values
('Joffrey Baratheon', 282, 'M', 'Lord of the Seven Kingdoms', 1,'Petyr Baelish', 4, 'Lannister', 'Casterly Rock', 26);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living,number_episodes)
values
('Margaery Tyrell', 283, 'F', 'Queen', 2, 'Joffrey Baratheon', 'Cersei Lannister', 6, 'Tyrell', 'Casterly Rock', 26);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_killer, killed_in_season, name_group, place_of_living,number_episodes )
values
('Eddard Stark', 263, 'M', 'Lord of Winterfell', 1, 'Joffrey Baratheon', 1, 'Stark', 'Winterfell', 17);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_partner, killed_in_season, name_group, place_of_living, number_episodes)
values
('Catelyn Stark', 264, 'F', 'Lady of Winterfell', 1, 'Eddard Stark', 3, 'Stark', 'Winterfell',25);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_group, place_of_living, number_episodes)
values
('Jon Snow', 281, 'M', 'King of the North', 1, 'Stark', 'North', 49);

insert into CharacterGot
(name, year_of_birth, gender, first_appearance, name_group, place_of_living,number_episodes)
values
('Sansa Stark', 285, 'F', 1, 'Stark', 'North',47);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living,number_episodes)
values
('Ramsay Bolton', 282, 'M', 'Lord of the Dreadfort', 3, 'Sansa Stark', 'Jon Snow', 6, 'Bolton', 'North', 20);

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_killer, killed_in_season, name_group, place_of_living,number_episodes)
values
('Roose Bolton', 260, 'M', 'Lord of the Dreadfort', 2, 'Ramsay Bolton', 6,'Bolton', 'North',19);

insert into CharacterGot
(name, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living,number_episodes)
values
('Walda Frey', 'F', 'Lady of the Dreadfort', 4, 'Roose Bolton', 'Ramsay Bolton', 6, 'Bolton', 'North',5);


--- Has to update afterwards due to dependencies

UPDATE CharacterGot
SET name_partner = 'Robert Baratheon'
WHERE name = 'Cersei Lannister';

UPDATE CharacterGot
SET name_partner = 'Lysa Arryn'
WHERE name = 'Petyr Baelish';

UPDATE CharacterGot
SET name_partner = 'Margaery Tyrell'
WHERE name = 'Joffrey Baratheon';

UPDATE CharacterGot
SET name_partner = 'Catelyn Stark'
WHERE name = 'Eddard Stark';

UPDATE CharacterGot
SET name_partner = 'Ramsay Bolton'
WHERE name = 'Sansa Stark';

UPDATE CharacterGot
SET name_partner = 'Walda Frey'
WHERE name = 'Roose Bolton';

--- LeaderGot

insert into LeaderGot
(name, aspires_to_throne, name_group, since_season)
values
('Eddard Stark', 0, 'Stark', 1);

insert into LeaderGot
(name, aspires_to_throne, name_group, since_season)
values
('Ramsay Bolton', 0, 'Bolton', 6);

insert into LeaderGot
(name, aspires_to_throne, name_group, since_season)
values
('Robert Baratheon', 1, 'Baratheon', 1);

insert into LeaderGot
(name, aspires_to_throne, name_group, since_season)
values
('Jon Snow', 1, 'Stark', 6);

insert into LeaderGot
(name, aspires_to_throne, name_group, since_season)
values
('Joffrey Baratheon', 1, 'Lannister', 2);


--- ChildrenGot

insert into ChildrenGot
(name, name_mother, name_father)
values
('Sansa Stark', 'Catelyn Stark', 'Eddard Stark');

insert into ChildrenGot
(name, name_mother, name_father)
values
('Joffrey Baratheon', 'Cersei Lannister', 'Jaime Lannister');

insert into ChildrenGot
(name, name_father)
values
('Ramsay Bolton', 'Roose Bolton');

insert into ChildrenGot
(name, name_father)
values
('Jaime Lannister', 'Tywin Lannister');

insert into ChildrenGot
(name, name_father)
values
('Cersei Lannister', 'Tywin Lannister');


--- OtherNamesGot

insert into OtherNamesGot
(other_name,real_name)
values
('The Lioness','Cersei Lannister');

insert into OtherNamesGot
(other_name,real_name)
values
('Ned','Eddard Stark');

insert into OtherNamesGot
(other_name,real_name)
values
('Kingslayer','Jaime Lannister');

insert into OtherNamesGot
(other_name,real_name)
values
('Oathbreaker','Jaime Lannister');

insert into OtherNamesGot
(other_name,real_name)
values
('Darnell','Jaime Lannister');

insert into OtherNamesGot
(other_name,real_name)
values
('Lord Snow','Jon Snow');

insert into OtherNamesGot
(other_name,real_name)
values
('The Bastard of Winterfell','Jon Snow');

insert into OtherNamesGot
(other_name,real_name)
values
('King Crow','Jon Snow');

insert into OtherNamesGot
(other_name,real_name)
values
('The Prince That Was Promised','Jon Snow');

insert into OtherNamesGot
(other_name,real_name)
values
('The White Wolf','Jon Snow');

insert into OtherNamesGot
(other_name,real_name)
values
('Littlefinger','Petyr Baelish');

insert into OtherNamesGot
(other_name,real_name)
values
('Ramsay Snow','Ramsay Bolton');

insert into OtherNamesGot
(other_name,real_name)
values
('The Bastard of Bolton','Ramsay Bolton');

insert into OtherNamesGot
(other_name,real_name)
values
('The Usurper','Robert Baratheon');

insert into OtherNamesGot
(other_name,real_name)
values
('The Stag King','Robert Baratheon');

insert into OtherNamesGot
(other_name,real_name)
values
('Little dove','Sansa Stark');

insert into OtherNamesGot
(other_name,real_name)
values
('Little bird','Sansa Stark');

insert into OtherNamesGot
(other_name,real_name)
values
('Alayne','Sansa Stark');

insert into OtherNamesGot
(other_name,real_name)
values
('The Imp','Tyrion Lannister');

insert into OtherNamesGot
(other_name,real_name)
values
('Halfman','Tyrion Lannister');

insert into OtherNamesGot
(other_name,real_name)
values
('The Little Lion','Tyrion Lannister');

insert into OtherNamesGot
(other_name,real_name)
values
('Demon Monkey','Tyrion Lannister');

insert into OtherNamesGot
(other_name,real_name)
values
('Fat Walda Frey','Walda Frey');

--- UsersGoT

insert into UsersGoT
(username,password,season,isModerator)
values
('yann','ypass',6,0);

insert into UsersGoT
(username,password,season,isModerator)
values
('simon','spass',1,0);

insert into UsersGoT
(username,password,season,isModerator)
values
('chase','cpass',2,0);

insert into UsersGoT
(username,password,season,isModerator)
values
('lotus','lpass',5,0);

insert into UsersGoT
(username,password,season,isModerator)
values
('TA','tpass',7,0);

insert into UsersGoT
(username,password,season,isModerator)
values
('prof','ppass',7,1);




--- ### SQL QUERIES ###


/*
##### Is character X dead ? If so who killed him and in what season?  (UI needs to output yes or no based on Null or not) #####

SELECT killed_in_season , name_killer
FROM CharacterGoT, UsersGoT
WHERE name = 'Ramsay Bolton' AND killed_in_season < (SELECT season FROM UsersGoT WHERE username = 'prof')

# null if name = 'Jaime Lannister'
# null if username = ‘simon’

##### Who is the current leader of group G (given the user last season )  and does he aspires to the throne? #####

SELECT name, aspires_to_throne
FROM LeaderGot
WHERE name_group = 'Stark' AND since_season = (
SELECT max(since_season )
FROM LeaderGot
WHERE name_group = 'Stark' AND since_season < (SELECT season FROM UsersGoT WHERE username = 'prof')
)

#  Jon Snow if username = 'prof'
#  Eddard Stark if username = 'chase’

##### Does the owner of the place where X live aspires to the throne? #####

SELECT l.name, l.aspires_to_throne
FROM LeaderGot l, PlaceGot p, CharacterGoT c
WHERE c.name = 'Sansa Stark' AND p.name = c.place_of_living  AND l.name_group = p.name_group AND  l.since_season = (
SELECT max(l.since_season )
FROM LeaderGot l, PlaceGot p, CharacterGoT c
WHERE c.name = 'Sansa Stark' AND p.name = c.place_of_living  AND l.name_group = p.name_group AND since_season < (
SELECT season FROM UsersGoT WHERE username = 'prof'
)
)

#  Jon Snow if username = 'prof'
#  Eddard Stark if username = 'chase’
# Joffrey Baratheon if c.name ='Jaime Lannister'

##### How old was the character X when he died ? #####

SELECT  s.approx_year - c.year_of_birth AS age
FROM CharacterGoT c, SeasonGot s
WHERE c.name ='Tywin Lannister' AND s.num = c.killed_in_season AND c.killed_in_season < (
SELECT season FROM UsersGoT WHERE username = 'prof'
)

##### Which character killed parents with a child  ? #####

SELECT character.name_killer
FROM ChildrenGot child, CharacterGoT character
WHERE character.name IN (child.name_father, child.name_mother) AND character.name_killer IS NOT NULL AND character.killed_in_season < (
SELECT season FROM UsersGoT WHERE username = 'prof'
)

##### Which character killed someone (and who) that was less than 20? #####

SELECT name_killer, name
FROM CharacterGoT, SeasonGoT
WHERE name_killer IS NOT NULL AND killed_in_season = num AND year_of_birth > (approx_year - 20) AND killed_in_season < (
SELECT season FROM UsersGoT WHERE username = 'prof'
)

##### In which season did character X first appear ?  #####

SELECT first_appearance
FROM CharacterGoT
WHERE name = 'Ramsay Bolton' AND first_appearance < (
SELECT season FROM UsersGoT WHERE username = 'prof'
)

#  empty if username = 'chase'

##### In which season did most character appear and how many did ? #####

SELECT query1.first_appearance
FROM (SELECT first_appearance, Count(*) AS order_count
      FROM CharacterGoT c
      GROUP BY c.first_appearance) query1,
     (SELECT max(query2.order_count) AS highest_count
      FROM (SELECT first_appearance, Count(*) AS order_count
            FROM CharacterGoT c
            GROUP BY c.first_appearance) query2) query3
WHERE query1.order_count = query3.highest_count

##### In which season did most character appear and who many did ?

SELECT name, first_appearance
FROM CharacterGoT
WHERE first_appearance= (SELECT query1.first_appearance
FROM (SELECT first_appearance, Count(*) AS order_count
      FROM CharacterGoT c
      GROUP BY c.first_appearance) query1,
     (SELECT max(query2.order_count) AS highest_count
      FROM (SELECT first_appearance, Count(*) AS order_count
            FROM CharacterGoT c
            GROUP BY c.first_appearance) query2) query3
WHERE query1.order_count = query3.highest_count)

##### In which season did most character die and who many did ?

SELECT name, killed_in_season
FROM CharacterGoT
WHERE killed_in_season IN (SELECT query1.killed_in_season
FROM (SELECT killed_in_season, Count(*) AS order_count
      FROM CharacterGoT c
	WHERE c.killed_in_season IS NOT NULL AND c.killed_in_season <  (
		SELECT season FROM UsersGoT WHERE username = 'lotus'
		)
      GROUP BY c.killed_in_season
      ) query1,
     (SELECT max(query2.order_count) AS highest_count
      FROM (SELECT killed_in_season, Count(*) AS order_count
            FROM CharacterGoT c
	    WHERE c.killed_in_season IS NOT NULL AND c.killed_in_season <  (
		SELECT season FROM UsersGoT WHERE username = 'lotus'
		)
            GROUP BY c.killed_in_season) query2) query3
WHERE query1.order_count = query3.highest_count)

#  1 and 4  if username = 'lotus'
#  6  if username = 'prof'

##### Who had a child youngest ?  #####

SELECT characterParent.name
FROM ChildrenGot child, CharacterGoT characterParent, CharacterGoT characterChild
WHERE characterParent.name IN (child.name_father, child.name_mother) AND characterChild.name = child.name AND ( characterChild.year_of_birth - characterParent.year_of_birth ) = (
SELECT  MIN(characterChild.year_of_birth - characterParent.year_of_birth)
FROM ChildrenGot child, CharacterGoT characterParent, CharacterGoT characterChild
WHERE characterParent.name IN (child.name_father, child.name_mother) AND characterChild.name = child.name
)

##### What is the percentage of women  and men death?  #####
SELECT query1.gender, query1.deathCount / query2.totalCount AS average_death
FROM
(SELECT gender, COUNT(*) AS deathCount
FROM CharacterGoT
WHERE killed_in_season IS NOT NULL
GROUP BY gender) query1,
(SELECT gender, COUNT(*) AS totalCount
FROM CharacterGoT
GROUP BY gender) query2
WHERE query1.gender = query2.gender

##### Who is the character that was in the most episodes #####
SELECT name, number_episodes
FROM CharacterGoT
WHERE number_episodes = (
SELECT MAX(number_episodes)
FROM CharacterGoT
)

##### Moderator: change other name. #####

UPDATE OtherNamesGot
SET other_name = 1
WHERE other_name = 'Fat Walda Frey'  AND (
SELECT isModerator
FROM UsersGoT
WHERE username = 'prof') = 1


##### User change the last season he watched. #####

UPDATE UsersGoT
SET season = 3
WHERE username = 'chase'
*/
