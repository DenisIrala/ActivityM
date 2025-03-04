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
	PRIMARY KEY (listID),
	FOREIGN KEY (ownerID) REFERENCES Accounts(accID)
);

CREATE TABLE IF NOT EXISTS Items (
	itemID INT NOT NULL AUTO_INCREMENT,
	listID INT NOT NULL,
	time DATE,
	description VARCHAR(100),
	PRIMARY KEY (itemID),
	FOREIGN KEY (listID) REFERENCES Lists(listID)
);

-- Log In / Register [Lindsey]

DELIMITER $$

CREATE PROCEDURE LoginUser(
    IN p_username VARCHAR(30)
)
BEGIN
    SELECT pass FROM Accounts WHERE username = p_username;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE RegisterUser(
    IN p_username VARCHAR(30),
    IN p_pass VARCHAR(60)
)
BEGIN
    INSERT INTO Accounts (username, pass) VALUES (p_username, p_pass);
END $$

DELIMITER ;
