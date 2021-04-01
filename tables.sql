CREATE TABLE unit(
    mac varchar(19) PRIMARY KEY,
    userId INTEGER NOT NULL,
    type varchar(20),
    FOREIGN KEY (userId) REFERENCES user(id)
);
