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
    REFERENCES location
    ON DELETE CASCADE,
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
  active BOOLEAN NOT NULL DEFAULT TRUE,
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

