--- ##### DROP TABLES WITH SAME NAME #####

drop table childrengot;
drop table leadergot;
drop table charactergot;
drop table placegot;
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
(num INTEGER NOT NULL PRIMARY KEY);

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
(1);
insert into SeasonGot values
(2);
insert into SeasonGot values
(3);
insert into SeasonGot values
(4);
insert into SeasonGot values
(5);
insert into SeasonGot values
(6);


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
(name, gender, job, first_appearance, name_group, place_of_living)
values
('Tyrion Lannister', 'M', 'Hand of the Queen', 1, 'Lannister', 'Casterly Rock');

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_killer, killed_in_season, name_group, place_of_living)
values
('Tywin Lannister', 234, 'M', 'Lord of Casterly Rock', 1, 'Tyrion Lannister', 5, 'Lannister', 'Casterly Rock');

insert into CharacterGot
(name, gender, job, first_appearance, name_group, place_of_living)
values
('Cersei Lannister', 'F', 'Queen', 1, 'Lannister', 'Casterly Rock');

insert into CharacterGot
(name, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living)
values
('Robert Baratheon', 'M', 'Lord of the Seven Kingdoms', 1, 'Cersei Lannister', 'Cersei Lannister', 1, 'Baratheon', 'Casterly Rock');

insert into CharacterGot
(name, gender, job, first_appearance, name_group, place_of_living)
values
('Jaime Lannister', 'M', 'Knight', 1, 'Lannister', 'Casterly Rock');

insert into CharacterGot
(name, gender, job, first_appearance, name_group, place_of_living)
values
('Petyr Baelish', 'M', 'Lord Protector of the Vale', 1, 'Baelish', 'North');

insert into CharacterGot
(name, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living)
values
('Lysa Arryn', 'F', 'Lady Regent of the Vale', 1, 'Petyr Baelish', 'Petyr Baelish', 4, 'Arryn', 'Eyrie');

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_killer, killed_in_season, name_group, place_of_living)
values
('Joffrey Baratheon', 282, 'M', 'Lord of the Seven Kingdoms', 1,'Petyr Baelish', 4, 'Lannister', 'Casterly Rock');

insert into CharacterGot
(name, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living)
values
('Margaery Tyrell', 'F', 'Queen', 2, 'Joffrey Baratheon', 'Cersei Lannister', 6, 'Tyrell', 'Casterly Rock');

insert into CharacterGot
(name, gender, job, first_appearance, name_killer, killed_in_season, name_group, place_of_living)
values
('Eddard Stark', 'M', 'Lord of Winterfell', 1, 'Joffrey Baratheon', 1, 'Stark', 'Winterfell');

insert into CharacterGot
(name, gender, job, first_appearance, name_partner, killed_in_season, name_group, place_of_living)
values
('Catelyn Stark', 'F', 'Lady of Winterfell', 1, 'Eddard Stark', 3, 'Stark', 'Winterfell');

insert into CharacterGot
(name, year_of_birth, gender, job, first_appearance, name_group, place_of_living)
values
('Jon Snow', 281, 'M', 'King of the North', 1, 'Stark', 'North');

insert into CharacterGot
(name, gender, first_appearance, name_group, place_of_living)
values
('Sansa Stark', 'F', 1, 'Stark', 'North');

insert into CharacterGot
(name, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living)
values
('Ramsay Bolton', 'M', 'Lord of the Dreadfort', 3, 'Sansa Stark', 'Jon Snow', 6, 'Bolton', 'North');

insert into CharacterGot
(name, gender, job, first_appearance, name_killer, killed_in_season, name_group, place_of_living)
values
('Roose Bolton', 'M', 'Lord of the Dreadfort', 2, 'Ramsay Bolton', 6,'Bolton', 'North');

insert into CharacterGot
(name, gender, job, first_appearance, name_partner, name_killer, killed_in_season, name_group, place_of_living)
values
('Walda Frey', 'F', 'Lady of the Dreadfort', 4, 'Roose Bolton', 'Ramsay Bolton', 6, 'Bolton', 'North');


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
