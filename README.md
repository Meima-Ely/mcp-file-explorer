# MCP File Explorer

Ce projet est mon premier serveur MCP que j'ai construit 
pour apprendre comment connecter une IA aux fichiers locaux.

## Pourquoi ce projet ?

Je suis étudiant en Big Data à Kénitra et je voulais 
comprendre comment Claude peut accéder à mon ordinateur 
via le protocole MCP. Ce projet m'a appris comment 
créer un serveur MCP de zéro.

## Ce que fait ce projet

Il permet à Claude de lire des fichiers .txt, .csv 
et .md sur mon ordinateur en utilisant le protocole MCP.

## Comment j'ai construit ça

1. J'ai créé un serveur MCP avec Node.js
2. J'ai créé un outil appelé lire_fichier
3. J'ai testé avec l'inspecteur MCP officiel d'Anthropic

## Installation

npm install
node server.js

## Ce que j'ai appris

- Comment fonctionne le protocole MCP
- La différence entre client, serveur et outil
- Comment connecter une IA au système de fichiers

## Prochaine étape

Projet 2 — connecter Claude à une base de données SQLite

## Stack technique

- Node.js
- MCP SDK Anthropic
- Zod
- JavaScript
