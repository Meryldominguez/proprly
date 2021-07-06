\echo 'Delete and recreate proprly db?'
\prompt 'Return for yes or control-C to cancel > ' yes

DROP DATABASE proprly;
CREATE DATABASE proprly;
\connect proprly

\i proprly-schema.sql
\i proprly-seed.sql

\echo 'Delete and recreate proprly_test db?'
\prompt 'Return for yes or control-C to cancel > ' yes

DROP DATABASE proprly_test;
CREATE DATABASE proprly_test;
\connect proprly_test

\i proprly-schema.sql