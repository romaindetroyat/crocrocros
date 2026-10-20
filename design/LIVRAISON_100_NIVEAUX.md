> Bilan historique de la version 1.0.0. La campagne actuelle est décrite dans [VARIETE_1_2.md](VARIETE_1_2.md).

# Campagne 1.0.0 — périmètre livré

100 cartes en dix chapitres, trois étoiles facultatives chacune. Les derniers niveaux atteignent quatre étages et seize salles. Les graphes de salles, leurs conditions et les plans de résolution sont écrits explicitement dans `content/campaign100.cjs` ; les aides génèrent la géométrie de ces cartes.

## Ce qui fonctionne

- Objets posables, transportables, transmissibles et réutilisables. Un objet par personnage ; seuls les bras de Croquefort portent les colis lourds.
- Emplacements, plateaux sensibles au poids et commandes réversibles à deux ou trois états ; les portes se recalculent selon l’état présent.
- Lion attiré par son ballon, paniers recevant les noix des vautours, voiles recevant le souffle des hippopotames et plateaux sensibles aux ondes des éléphants.
- Ascenseurs, bouclier servant de marchepied, traversées en plané avec un colis, boucles et retours par les étages.
- F au clavier et bouton tactile dédié. Plan M avec conditions des liaisons, trois indices dont un parcours détaillé.
- Nouvelle sauvegarde indépendante, mode libre et ancienne aventure conservée.
- Trompe redessinée avec une base large, une pointe amincie et une courbure animée.

## Adaptations du dossier de conception

Le document de recherche ne décrit pas exactement chaque réalisation finale. Les bassins ont des états de remplissage associés aux passages et aux ascenseurs ; ils ne simulent pas un fluide. Les oiseaux fournissent des noix aux récepteurs, sans transporter librement les objets du joueur. Les énigmes utilisent la présence et le comportement des animaux, sans simulation d’un cortège autonome complet. L’architecture visuelle repose sur des salles reliées par des échelles et des portes, avec les décors des dix chapitres.

## Vérifications

- 100 parcours rejoués avec sélection et commandes ordinaires du moteur, sans téléportation ou modification de drapeaux dans le test.
- 300 étoiles récupérées et zéro retour après chute/collision sur ces parcours.
- 2 187 états intermédiaires : validation du format et restauration des objets, positions et commandes.
- Interface testée avec le vrai Canvas et un DOM simulé : F, prise et dépôt tactiles, reprise, modes isolés, carte paginée et verrouillage.
- Scripts construits et cache hors ligne testés ; vues Canvas examinées.

Les durées dans `tests/campaign100-report.json` sont celles des parcours automatisés, pas des estimations du temps de réflexion humain. Une solution prouvée ne prouve pas l’unicité ni la difficulté ressentie. Les comportements Safari/iPhone réels nécessitent une validation sur appareil.
