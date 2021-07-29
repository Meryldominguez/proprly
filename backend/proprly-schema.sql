CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  notes TEXT,
  parent_id INTEGER
    REFERENCES location ON DELETE CASCADE
);

CREATE TABLE lot (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  loc_id INTEGER
    REFERENCES location ON DELETE CASCADE,
  quantity INTEGER 
    CHECK (quantity >= 0 OR quantity = NULL),
  description TEXT NOT NULL,
  price MONEY
);

CREATE TABLE production (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date_start DATE,
  date_end DATE,
  active BOOLEAN DEFAULT TRUE,
  notes TEXT NOT NULL
);
CREATE TABLE prop (
  lot_id INTEGER
    REFERENCES lot ON DELETE CASCADE,
  prod_id INTEGER
    REFERENCES production ON DELETE CASCADE,
  PRIMARY KEY ( prod_id,lot_id),
  quantity INTEGER 
    CHECK (quantity >= 0 OR quantity = NULL),
  notes TEXT 
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  phone VARCHAR(15),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE tag (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE lot_tag (
  lot_id INTEGER
    REFERENCES lot ON DELETE CASCADE,
  tag_id INTEGER
    REFERENCES tag ON DELETE CASCADE,
  PRIMARY KEY (lot_id, tag_id)
);

CREATE OR REPLACE FUNCTION tag_something(lot_param INTEGER,tag_title VARCHAR)
RETURNS TABLE ("lotId" INT,  "lotName" TEXT, "tagId" INT, "tagTitle" TEXT)
AS 
$$
  DECLARE
    new_tag_id INT;
  BEGIN
    IF NOT EXISTS (SELECT * FROM tag WHERE title=tag_title) 
    THEN
        INSERT INTO tag(title)
        VALUES(tag_title)
        RETURNING id INTO new_tag_id;

        INSERT INTO lot_tag(lot_id,tag_id)
        VALUES(lot_param,new_tag_id);
    ELSE

        SELECT id INTO new_tag_id FROM tag WHERE title=tag_title;

        IF EXISTS (SELECT * FROM lot_tag WHERE lot_id=lot_param AND tag_id=new_tag_id) THEN
          RETURN;
        END IF;

        INSERT INTO lot_tag(lot_id,tag_id)
        VALUES(lot_param, new_tag_id); 
    END IF;

    RETURN QUERY
    SELECT
          l.id,
          l.name,
          t.id, 
          t.title
      FROM lot_tag AS x 
      JOIN lot AS l ON l.id=x.lot_id
      JOIN tag AS t ON t.id=x.tag_id
      WHERE l.id=lot_param AND t.id=new_tag_id;
END;
$$ 
LANGUAGE plpgsql
;