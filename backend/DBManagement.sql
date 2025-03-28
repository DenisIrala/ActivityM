USE ActivityM;

-- Create Tables [Ollie]

CREATE TABLE IF NOT EXISTS Accounts (
	accID INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(30) NOT NULL UNIQUE,
	pass VARCHAR(60) NOT NULL,
	PRIMARY KEY(accID)
);

CREATE TABLE IF NOT EXISTS Lists (
	listID INT NOT NULL AUTO_INCREMENT,
	ownerID INT NOT NULL,
	listName VARCHAR (60) NOT NULL, 
	PRIMARY KEY (listID),
	FOREIGN KEY (ownerID) REFERENCES Accounts(accID)
);

CREATE TABLE IF NOT EXISTS ListShares (
    listID INT NOT NULL,
    sharedWithID INT NOT NULL,
    PRIMARY KEY (listID, sharedWithID),
    FOREIGN KEY (listID) REFERENCES Lists(listID),
    FOREIGN KEY (sharedWithID) REFERENCES Accounts(accID)
);

CREATE TABLE IF NOT EXISTS Items (
	itemID INT NOT NULL AUTO_INCREMENT,
	listID INT NOT NULL,
	time DATE,
	description VARCHAR(100),
	mark BOOLEAN,
	PRIMARY KEY (itemID),
	FOREIGN KEY (listID) REFERENCES Lists(listID)
);

-- List Management Functions (SQL Base) [Lindsey]
-- Ollie will be formatting these into the API.

DROP PROCEDURE IF EXISTS getLists;
DELIMITER $$
CREATE PROCEDURE getLists (IN accountID INT) 
BEGIN 
    SELECT listID, listName 
    FROM Lists 
    WHERE ownerID = accountID; 
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS addList;
DELIMITER $$
CREATE PROCEDURE addList (IN accountID INT, IN listName VARCHAR(60)) 
BEGIN 
	INSERT INTO Lists (ownerID, listName) 
	VALUES (accountID, listName); 
END $$ 
DELIMITER ;

DROP PROCEDURE IF EXISTS updateList;
DELIMITER $$
CREATE PROCEDURE updateList(IN listID_param INT, IN accountID_param INT, IN newName VARCHAR(60))
BEGIN
    UPDATE Lists
    SET listName = newName
    WHERE listID = listID_param AND ownerID = accountID_param;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS deleteList;
DELIMITER $$
CREATE PROCEDURE deleteList(IN listID INT, IN accountID INT)
BEGIN
    DELETE FROM Lists
    WHERE Lists.listID = listID AND Lists.ownerID = accountID;
END$$
DELIMITER ;


-- Task Functions [Lindsey]
-- Ollie will format into API

DROP PROCEDURE IF EXISTS getTasks;
DELIMITER $$
CREATE PROCEDURE getTasks(IN getList INT)
BEGIN
    SELECT itemID, description, time, mark
    FROM Items
    WHERE listID = getList; -- O: Fixed self-reference
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS addTask;
DELIMITER $$
CREATE PROCEDURE addTask(IN listID INT, IN taskDescription VARCHAR(100), IN taskTime DATE)
BEGIN
    INSERT INTO Items (listID, description, time, mark)
    VALUES (listID, taskDescription, taskTime, FALSE);
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS markTask;
DELIMITER $$
CREATE PROCEDURE markTask(IN itemID INT, IN taskMark BOOLEAN)
BEGIN
    UPDATE Items
    SET mark = taskMark
    WHERE Items.itemID = itemID; -- O: Fixed self-reference
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS updateTask;
DELIMITER $$
CREATE PROCEDURE updateTask(IN itemID INT, IN newDescription VARCHAR(100), IN newTime DATE)
BEGIN
    UPDATE Items
    SET description = newDescription, time = newTime
    WHERE Items.itemID = itemID; -- O: Fixed self-reference
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS deleteTask;
DELIMITER $$
CREATE PROCEDURE deleteTask(IN itemID INT)
BEGIN
    DELETE FROM Items
    WHERE Items.itemID = itemID; -- O: Fixed self-reference
END $$
DELIMITER ;
