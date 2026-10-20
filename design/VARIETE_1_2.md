# Campagne 1.2.0 — réduire la répétition

Le retour utilisateur porte sur la répétition des énigmes, pas seulement sur les décors. Audit du paquet 1.1.3 : 84 niveaux sur 100 comportaient des objets à transporter ; les salles utilisaient 14 plans distincts, avec des grilles de plus en plus grandes et des allers-retours similaires.

## Modifications effectives

66 niveaux remplacés, 34 expéditions et rencontres conservées. La campagne reste à 100 niveaux et 300 étoiles facultatives.

| Famille | Nombre | Problème à résoudre |
|---|---:|---|
| Circuits | 10 | Chaque levier inverse plusieurs lampes ; atteindre un motif précis, avec des lampes allumées et éteintes. |
| Séquences | 10 | Lire et jouer une partition, parfois avec des cloches éloignées ou réservées à certains personnages. Une erreur remet la séquence à zéro. |
| Postes simultanés | 11 | Maintenir deux postes pendant un tir, puis déplacer les gardiens pour la cible suivante ; certains départs sont séparés. |
| Balances | 7 | Répartir des masses entre deux plateaux. Il faut utiliser la masse totale prévue : deux plateaux vides ne suffisent pas. |
| Aiguillages | 8 | Un opérateur ouvre différentes branches pendant qu’un équipier valide les signaux. Certains tirs demandent aussi un troisième gardien. |
| Parcours de plateforme | 20 | Parcours réintégrés depuis l’ancienne aventure : bouclier, ascenseurs, portails, ponts incompatibles, ressorts, tapis roulants et tirs protégés. |
| Expéditions et animaux | 34 | Mécaniques déjà présentes, avec transport, réemploi, animaux, plané et grands défis finaux. |

Les 46 nouvelles énigmes sont spécifiées dans `content/varied-campaign.cjs` : chaque câblage, partition, distribution de poids, série de postes et ordre de branches est explicite. Les familles sont intercalées dans la campagne. Les 20 parcours de plateforme réutilisent des cartes existantes ; ce ne sont pas 20 créations nouvelles.

Les niveaux avec objets transportables passent de 84 à 35. Les 80 cartes à salles utilisent désormais 44 plans distincts ; les 20 parcours physiques possèdent leur géométrie propre. Les nouvelles cartes sont souvent plus courtes : couloirs, branches, tours étroites et terrasses ouvertes remplacent une partie des grandes grilles.

## Jouabilité et sauvegardes

Les leviers indiquent les lampes qu’ils inversent et chaque lampe indique son objectif. La partition reste visible. Une balance affiche ses totaux. Les commandes réservées à un personnage indiquent son nom. Le type d’énigme apparaît dans le carnet des niveaux.

Les étapes déjà terminées et les étoiles restent enregistrées. Une partie en cours dans un niveau remplacé reprend au départ de sa nouvelle version (révision 120), avec le message de migration existant. Le zoom est conservé. Les parties des niveaux conservés reprennent normalement. Sur les parcours sans objets, B est le raccourci de saut ; sur les expéditions, B sert aux objets et commandes.

## Vérifications

- 100 parcours rejoués avec les sélections et entrées ordinaires du moteur ; 100 sorties atteintes, 300 étoiles, zéro retour après chute/collision sur ces solutions.
- 1 873 états intermédiaires validés et restaurés, dont les lampes, partitions et objets.
- Tests des inversions réversibles, des erreurs de partition, des restrictions de personnage, des distributions de poids et de la migration d’une sauvegarde 1.1.3.
- Contrôles, zoom et sauvegarde vérifiés dans Chromium avec trois formats mobiles simulés ; huit niveaux de familles différentes ouverts et rendus, y compris leur Plan.
- Paquet PWA et cache hors ligne vérifiés par les tests du projet.

Les replays prouvent une solution réalisable et la récupération des étoiles. Ils ne mesurent pas le plaisir, le temps de réflexion humain ou l’équilibrage perçu. Les familles ont plusieurs variantes ; les 100 niveaux ne prétendent pas proposer 100 mécaniques différentes. Safari sur iPhone physique n’a pas été utilisé pour cette validation.
