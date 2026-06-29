# Audit final du catalogue

Generation: 2026-06-29T08:55:35.135Z

## Synthese

- Nombre total d outils: 594
- Outils analyses et enrichis: 204
- Outils restant en revue: 373
- Outils en echec documente: 14
- Outils marques doublons: 3
- Descriptions reecrites ou normalisees: 594
- Tags distincts apres normalisation: 45
- Groupes de doublons traites: 6
- URLs mortes ou en erreur HTTP detectees: 48
- Projets archives detectes: 6
- Licences inconnues sur depots publics: 55
- Outils open source confirmes par licence: 180
- Outils self-hosted confirmes par source: 215
- Outils Docker confirmes par source: 129

## Statuts d enrichissement

- needs_review: 373
- enriched: 204
- failed: 14
- duplicate: 3

## Categories avant

- Intelligence artificielle: 393
- À vérifier: 85
- Infrastructure et systèmes: 50
- Développement: 20
- Cybersécurité: 16
- Multimédia: 13
- Productivité: 10
- Automatisation: 5
- Réseau: 2

## Categories apres

- ia-agents-assistants: 120
- multimedia: 117
- ia-developpement-code: 51
- systemes-infrastructure: 41
- cybersecurite-osint: 33
- ia-modeles-evaluation: 31
- utilitaires: 26
- developpement-logiciel: 23
- creation-web-cms: 22
- devops-conteneurs: 19
- ia-image-video-design: 19
- ia-rag-documents: 18
- recherche-veille: 14
- design-creation: 14
- productivite-collaboration: 9
- ia-audio-transcription: 9
- automatisation-integration: 8
- donnees-backend: 7
- reseaux-acces-distant: 5
- ressources-apprentissage: 5
- monitoring-observabilite: 2
- documentation-connaissances: 1

## Tags fusionnes

- open source, opensource -> open-source
- self hosted, selfhosted -> self-hosted
- command line, command-line-interface -> cli
- github, outil, application, logiciel, web, interessant, a voir et a verifier supprimes comme tags publics

## Doublons traites

Voir `docs/catalog-duplicates.md`.

## Revue et limites

- Les outils non recuperables, bloques par anti-bot, pages de connexion ou metadata insuffisante sont listes dans `docs/catalog-review-needed.md`.
- Les licences ne sont renseignees que lorsqu elles sont detectees dans les sources publiques consultees.
- Docker et self-hosted ne sont confirmes que lorsqu un signal public explicite a ete trouve.
- L import preserve les favoris, recommandations, scores, statuts personnels, notes et dates historiques.

## Validations

- Issues de validation catalogue detectees: 45
- Tests ajoutes: canonicalisation URL, doublons, categories/tags, descriptions generiques, preservation personnelle et idempotence d import.
