SET FOREIGN_KEY_CHECKS=0;

SET SQL_SAFE_UPDATES = 0;

DROP TABLE IF EXISTS  Org;
DROP TABLE IF EXISTS  Officer;
DROP TABLE IF EXISTS  Area;
DROP TABLE IF EXISTS  Client;
DROP TABLE IF EXISTS  Topic;
DROP TABLE IF EXISTS  Service;
DROP TABLE IF EXISTS  Certificate;
DROP TABLE IF EXISTS  Message;
DROP TABLE IF EXISTS  Calls;
DROP TABLE IF EXISTS  CTransaction;
DROP TABLE IF EXISTS  LTransaction;
DROP TABLE IF EXISTS  RecordCall;


CREATE TABLE Org
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	title                VARCHAR(255) NOT NULL,
	type                 INTEGER NOT NULL,
	fee                  DECIMAL(10,2) NULL,
	status               INTEGER NOT NULL,
	PRIMARY KEY (ID)
);

CREATE UNIQUE INDEX XPKОрганизация ON Org
(
	ID ASC
);

CREATE TABLE Officer
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	OrgID                INTEGER NULL,
	BlockID              INTEGER NULL,
	lastName             VARCHAR(255) NOT NULL,
	phone                VARCHAR(20) NOT NULL,
	login                VARCHAR(20) NOT NULL,
	password             VARCHAR(20) NOT NULL,
	typeOfficer          INTEGER NOT NULL,
	roleOfficer          INTEGER NOT NULL,
	rating               INTEGER NOT NULL,
	status               INTEGER NOT NULL,
	created              DATETIME NOT NULL,
	updated              DATETIME NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (OrgID) REFERENCES Org (ID)
		ON DELETE CASCADE
);

CREATE UNIQUE INDEX XPKСотрудник ON Officer
(
	ID ASC
);

CREATE INDEX XIF1Сотрудник ON Officer
(
	OrgID ASC
);

CREATE TABLE Area
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	title                VARCHAR(100) NOT NULL,
	content              VARCHAR(1000) NOT NULL,
	PRIMARY KEY (ID)
);

CREATE UNIQUE INDEX XPKОбласть_права ON Area
(
	ID ASC
);

CREATE TABLE Client
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	lastname             VARCHAR(255) NOT NULL,
	phone                VARCHAR(20) NOT NULL,
	login                VARCHAR(20) NOT NULL,
	password             VARCHAR(20) NOT NULL,
	counter              INTEGER NOT NULL,
	amount               DECIMAL(10,2) NOT NULL,
	status               INTEGER NOT NULL,
	created              DATETIME NOT NULL,
	updated              DATETIME NULL,
	PRIMARY KEY (ID)
)
 AUTO_INCREMENT = 1;

CREATE UNIQUE INDEX XPKКлиент ON Client
(
	ID ASC
);

CREATE TABLE Topic
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	AreaID               INTEGER NOT NULL,
	OfficerID            INTEGER NULL,
	title                VARCHAR(100) NOT NULL,
	status               INTEGER NOT NULL,
	created              DATETIME NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (AreaID) REFERENCES Area (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (OfficerID) REFERENCES Officer (ID)
);

CREATE UNIQUE INDEX XPKТемы ON Topic
(
	ID ASC
);

CREATE INDEX XIF1Темы ON Topic
(
	AreaID ASC
);

CREATE INDEX XIF2Темы ON Topic
(
	OfficerID ASC
);

CREATE TABLE Calls
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	AreaID               INTEGER NOT NULL,
	TopicID              INTEGER NULL,
	OfficerID            INTEGER NOT NULL,
	ClientID             INTEGER NULL,
	typeCall             INTEGER NOT NULL,
	rating               INTEGER NULL,
	status               INTEGER NOT NULL,
	dateFrom             DATETIME NOT NULL,
	dateTo               DATETIME NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (AreaID) REFERENCES Area (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (OfficerID) REFERENCES Officer (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (ClientID) REFERENCES Client (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (TopicID) REFERENCES Topic (ID)
);

CREATE UNIQUE INDEX XPKСеанс_связи ON Calls
(
	ID ASC
);

CREATE INDEX XIF1Сеанс_связи ON Calls
(
	AreaID ASC
);

CREATE INDEX XIF2Сеанс_связи ON Calls
(
	OfficerID ASC
);

CREATE INDEX XIF3Сеанс_связи ON Calls
(
	ClientID ASC
);

CREATE INDEX XIF4Сеанс_связи ON Calls
(
	TopicID ASC
);

CREATE TABLE LTransaction
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	OfficerID            INTEGER NOT NULL,
	CallID               INTEGER NULL,
	amount               DECIMAL(10,2) NULL,
	typeTransaction      INTEGER NOT NULL,
	content              VARCHAR(1000) NULL,
	created              DATETIME NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (OfficerID) REFERENCES Officer (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (CallID) REFERENCES Calls (ID)
		ON DELETE CASCADE
);

CREATE UNIQUE INDEX XPKТранзакция_адвоката ON LTransaction
(
	ID ASC
);

CREATE INDEX XIF1Транзакция_адвоката ON LTransaction
(
	OfficerID ASC
);

CREATE INDEX XIF2Транзакция_адвоката ON LTransaction
(
	CallID ASC
);


CREATE TABLE Service
(
	OfficerID            INTEGER NOT NULL,
	AreaID               INTEGER NOT NULL,
	Rating               INTEGER NULL,
	PRIMARY KEY (OfficerID,AreaID),
	FOREIGN KEY (OfficerID) REFERENCES Officer (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (AreaID) REFERENCES Area (ID)
		ON DELETE CASCADE
);

CREATE UNIQUE INDEX XPKОбслуживание ON Service
(
	OfficerID ASC,
	AreaID ASC
);

CREATE INDEX XIF1Обслуживание ON Service
(
	OfficerID ASC
);

CREATE INDEX XIF2Обслуживание ON Service
(
	AreaID ASC
);

CREATE TABLE RecordCall
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	CallID               INTEGER NOT NULL,
	created              DATETIME NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (CallID) REFERENCES Calls (ID)
		ON DELETE CASCADE
);

CREATE UNIQUE INDEX XPKЗаписи_сеанса_связи ON RecordCall
(
	ID ASC
);

CREATE INDEX XIF1Записи_сеанса_связи ON RecordCall
(
	CallID ASC
);

CREATE TABLE Message
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	OfficerID            INTEGER NULL,
	ClientID             INTEGER NULL,
	address              VARCHAR(20) NOT NULL,
	typeMessage          INTEGER NOT NULL,
	content              VARCHAR(1000) NOT NULL,
	dateFrom             DATETIME NOT NULL,
	created              DATETIME NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (ClientID) REFERENCES Client (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (OfficerID) REFERENCES Officer (ID)
		ON DELETE CASCADE
);

CREATE UNIQUE INDEX XPKСообшения ON Message
(
	ID ASC
);

CREATE INDEX XIF1Сообшения ON Message
(
	ClientID ASC
);

CREATE INDEX XIF2Сообшения ON Message
(
	OfficerID ASC
);

CREATE TABLE Certificate
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	OrgID                INTEGER NOT NULL,
	ClientID             INTEGER NOT NULL,
	amount               DECIMAL(10,2) NOT NULL,
	dateTo               DATETIME NOT NULL,
	codeCertificate      VARCHAR(20) NOT NULL,
	status               INTEGER NOT NULL,
	created              DATETIME NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (OrgID) REFERENCES Org (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (ClientID) REFERENCES Client (ID)
		ON DELETE CASCADE
);

CREATE UNIQUE INDEX XPKСертификат ON Certificate
(
	ID ASC
);

CREATE INDEX XIF1Сертификат ON Certificate
(
	OrgID ASC
);

CREATE INDEX XIF2Сертификат ON Certificate
(
	ClientID ASC
);

CREATE TABLE CTransaction
(
	ID                   INTEGER NOT NULL AUTO_INCREMENT,
	ClientID             INTEGER NOT NULL,
	CallID               INTEGER NULL,
	CertificateID        INTEGER NULL,
	amount               DECIMAL(10,2) NOT NULL,
	typeTransaction      INTEGER NOT NULL,
	content              VARCHAR(1000) NULL,
	created              DATETIME NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (CertificateID) REFERENCES Certificate (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (ClientID) REFERENCES Client (ID)
		ON DELETE CASCADE,
	FOREIGN KEY (CallID) REFERENCES Calls (ID)
		ON DELETE CASCADE
)
 AUTO_INCREMENT = 1;

CREATE UNIQUE INDEX XPKТранзакция_клиента ON CTransaction
(
	ID ASC
);

CREATE INDEX XIF1Транзакция_клиента ON CTransaction
(
	CertificateID ASC
);

CREATE INDEX XIF2Транзакция_клиента ON CTransaction
(
	ClientID ASC
);

CREATE INDEX XIF3Транзакция_клиента ON CTransaction
(
	CallID ASC
);

INSERT INTO `lexis`.`area`
(`ID`, `title`, `content`)
VALUES
(1, 'area 1', 'content');

INSERT INTO `lexis`.`officer`
(`ID`, `lastName`, `phone`, `login`, `password`, `roleOfficer`, `typeOfficer`,
`rating`, `status`, `created`)
VALUES
(4, "lawyer", "9173450123", "9173450123", "1000", 0, 0, 140, 1, "12.12.2017");
INSERT INTO `lexis`.`officer`
(`ID`, `lastName`, `phone`, `login`, `password`, `roleOfficer`, `typeOfficer`,
`rating`, `status`, `created`)
VALUES
(5, "lawyer", "9173450120", "9173450120", "1000", 0, 0, 140, 1, "12.12.2017");

INSERT INTO `lexis`.`service`
(`OfficerID`, `AreaID`, `Rating`)
VALUES
(4, 1, 0);

INSERT INTO `lexis`.`client`
(`ID`, `lastname`, `phone`, `login`, `password`, `amount`, `counter`, `status`, `created`)
VALUES
(120, 'aminev', '9173450123', '9173450123', '1000', 0, 0, 1, '12.12.2017');
