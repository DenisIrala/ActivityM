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
	ListName VARCHAR (60),
	SharedIDs[],
	PRIMARY KEY (listID),
	FOREIGN KEY (ownerID) REFERENCES Accounts(accID)
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
CREATE PROCEDURE IF NOT EXISTS getLists (IN accountID INT) 
BEGIN 
    SELECT listID, listName 
    FROM     Lists 
    WHERE ownerID = accountID; 
END;

CREATE PROCEDURE IF NOT EXISTS addList (IN accountID INT, IN listName VARCHAR(60)) 
BEGIN 
	INSERT INTO Lists (ownerID, ListName)
	VALUES (accountID, listName); 
END; 

CREATE PROCEDURE updateList(IN listID INT, IN accountID INT, IN newName VARCHAR(60))
BEGIN
	UPDATE Lists
	SET ListName = newName
	WHERE listID = listID AND ownerID = accountID;
END; 

CREATE PROCEDURE deleteList(IN listID INT, IN accountID INT) 
BEGIN 
    DELETE FROM Lists
    WHERE listID = listID AND ownerID = accountID; 
END;
