CREATE TABLE bread(
    id INTEGER PRIMARY KEY NOT NULL,
    string TEXT,
    integer INTEGER,
    float FLOAT,
    date DATE,
    boolean BOOLEAN
);

INSERT INTO bread (string, integer, float, date, boolean) VALUES ('test', 123, '1,1', '2020-02-02', 'true');