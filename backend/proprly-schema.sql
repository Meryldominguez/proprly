CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE parent_loc (
  parent_loc INTEGER
    REFERENCES location
    ON DELETE CASCADE,
  loc_id INTEGER
    REFERENCES location
    ON DELETE CASCADE,
  PRIMARY KEY (parent_loc, loc_id)
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
    REFERENCES lot,
  prod_id INTEGER
    REFERENCES production,
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

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE parent_cat (
  parent_id INTEGER
    REFERENCES category 
    ON DELETE CASCADE,
  cat_id INTEGER
    REFERENCES category 
    ON DELETE CASCADE,
  PRIMARY KEY (parent_id, cat_id)
);

CREATE TABLE lot_cat (
  lot_id INTEGER
    REFERENCES lot,
  cat_id INTEGER
    REFERENCES category,
  PRIMARY KEY (lot_id, cat_id)
);

