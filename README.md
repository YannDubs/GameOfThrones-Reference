The Game Of Thrones Reference

###Goal of the project###
The aim of this project is to build a database and an graphical interface to interact with it by the mean of queries. 
Different queries can be done, such as normal queries, normal queries with simple and more complex user inputs, update and delete queries. 
Also, there is a login system which allows a "moderator" users to change the data in the database. The normal logged-in users are allowed
to change their actual viewed GoT season, which will have an impact on the data retrived

###What this project solves####
Games of Thrones is a very complex TV series with many seasons, characters and actions, and sometimes it is not possible for the GoT lovers
to watch every single episode. Other people would like to begin watching GoT from season 5, because they weren't interested in it before, but 
they can't since they missed every other season and wouldn't understand anything. This project is the solution!
With our database, any user can ask many different questions to it and get important informations about what happened. If I am currently watching
season 5, but season 6 is already finished, no problem! You can just the last watched season and the data displayed for you is going to be 
adapted to make sure that you don't get spoiled! 
Also, this database is easily maintainable since we provide a moderator interface that can manipulate the data in the database (Note that for
this release of the project, only a couple of data management queries are available). 

###Architecture#####
By using a combination between my SQL, PHP and JS (with Angular and Bootstrap), we were able to come with a fast and responsive webside that can
be used on many plattforms. Every single query is in its own PHP file and can also be displayed using the glyphicon information button. An angular 
controller provides a flexible link between the query and the HTML page. 



