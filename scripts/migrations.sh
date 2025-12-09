#!/bin/bash -e

# Migrations KNEX
npm ci
./node_modules/.bin/knex migrate:latest

# Création de toutes les procédures stockées
./procedures_stockees/cree_toutes_les_procedures.sh