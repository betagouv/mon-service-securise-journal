#!/bin/bash

echo "💻 Création de toutes les procédures stockées…"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

for file in "$SCRIPT_DIR"/*.sql; do
    [ -f "$file" ] || continue
    echo "🚚 Traitement du fichier $file..."
    psql -d "$URL_SERVEUR_BASE_DONNEES" -f "$file"
done

echo "✅ Création terminée"