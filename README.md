# Les Cro Cro Cros — La folle traversée

Jeu de plateforme et d’énigmes en solo, en français. **Version 2.0.0 : nouvelle coopération physique et campagne de 100 parcours.**

[Jouer](https://crocrocros.vercel.app/) · [Explorer les 100 niveaux librement](https://crocrocros.vercel.app/?essai=libre) · [Retrouver la campagne 1.2 et sa progression](https://crocrocros.vercel.app/?campagne=archive) · [Aventure classique de 37 niveaux](https://crocrocros.vercel.app/?campagne=classique)

Le bouclier devient un moyen de transport : les deux équipiers peuvent embarquer, voyager sur une nacelle, planer, prendre un courant d’air et descendre à destination. Les tirs rebondissent sur des réflecteurs orientables et traversent certains portails. Les nacelles transportent réellement les personnages ; casser un support transforme le trajet d’une passerelle.

La campagne emploie 16 situations fondatrices : bac, cheminée à ricochets, vol en équipe, pont descendant, relève d’un opérateur, contrepoids, aiguillage de tirs, ascenseurs opposés, tremplin, postes simultanés, chaîne de réflecteurs, portes complémentaires, sauvetage de deux balcons, souffleries alternées, course au frein et portail pour projectiles. Le catalogue compose **24 parcours concentrés, 65 traversées en deux passages et 11 traversées en trois passages**. Les situations reviennent et se combinent ; ce ne sont pas 100 règles indépendantes. Les grands parcours atteignent 5 580 unités de largeur et 1 780 de hauteur.

Les passages d’un niveau sont reliés physiquement. Aucun repositionnement automatique ne remplace les déplacements : les solutions enregistrées utilisent les mêmes commandes que le joueur. Le dernier opérateur doit rejoindre la sortie. Des points de ralliement, le rembobinage, le plan et des indices progressifs permettent de reprendre après une erreur.

## Commandes

| Action | Clavier | iPhone / tactile |
| --- | --- | --- |
| Marcher | ← / → | Croix : appui court, maintien ou glissement |
| Sauter avec Croquinet, monter à l’échelle | ↑ | Haut de la croix |
| Descendre à l’échelle | ↓ | Bas de la croix |
| Charge / bouclier / tir | Espace | A |
| Embarquer, descendre, manœuvrer | F | B, dont le libellé suit le contexte |
| Changer de personnage | W / X / C | Trois portraits |
| Pause | Échap | START |
| Revenir jusqu’à huit secondes en arrière | R | ↶ |
| Vue complète, en pause | M | Plan |

Pour voyager ensemble : sélectionner Croquefort, lever le bouclier avec A, rapprocher les deux autres puis B. Sélectionner un passager et B pour débarquer. Le bouclier frontal protège ; le bouclier levé permet de transporter et de planer.

Sur iPhone : paysage, scène sur toute la largeur, commandes en dessous. Le zoom va de 2,4× à « Tout » ; toucher sa valeur restaure 1,9×. Les portraits indiquent les passagers à bord. Les pointillés du Plan relient les commandes aux passages qu’elles actionnent.

## Progression et installation

La nouvelle campagne possède une sauvegarde distincte. La progression 1.2 reste consultable par le lien d’archive, et la campagne classique conserve aussi sa sauvegarde. Le mode libre ouvre les 100 cartes dans un emplacement séparé. Les préférences de son et de zoom de la campagne 1.2 sont reprises au premier lancement de la nouvelle aventure.

La partie se sauvegarde automatiquement sur le navigateur. Export et import sont disponibles dans les réglages. Pour importer une sauvegarde d’une ancienne campagne, ouvrir d’abord cette campagne. Effacer les données du navigateur efface les sauvegardes locales.

Le fichier [Les_Cro_Cro_Cros.html](Les_Cro_Cro_Cros.html) fonctionne directement sur ordinateur, sans connexion. Pour l’installation PWA : ouvrir le site HTTPS, puis Safari → Partager → Sur l’écran d’accueil sur iPhone. Attendre « Prêt hors ligne » avant de couper la connexion. Après une mise à jour, recharger la page pour charger le nouveau jeu.

Le jeu livré n’a ni dépendance à installer, ni compte, publicité, achat ou serveur de jeu.

## Validation de la version 2.0

- 100 parcours terminés avec les commandes du moteur ; 300 étoiles obtenues ; aucun retour après choc ou chute dans ces parcours.
- 2 198 interruptions par sauvegarde/reprise intégrées aux replays, dont 974 avec passagers, 744 après déplacement de nacelles et 51 avec projectiles en vol.
- Vérification des collisions du groupe transporté, du débarquement, des orientations des réflecteurs, des portails, des chronos et des retours au ralliement.
- Interface réelle Chromium à 667 × 375, 844 × 390 et 932 × 430 : scène pleine largeur, contrôles dessous, sélection directe, zoom complet et persistance.
- Rendu détaillé et complet des 100 cartes dans Chromium ; 13 scènes en cours de partie vérifiées avec leur Plan.
- Replays et sauvegardes de la campagne 1.2 toujours valides : 100 victoires, 300 étoiles, 1 873 états.

Ces contrôles établissent la possibilité des parcours et les comportements testés. Ils ne constituent pas une étude du plaisir de jeu, une recherche de toutes les solutions possibles, ni une validation de Safari sur iPhone physique. Détails et catalogue : [REFONTE_2_0.md](design/REFONTE_2_0.md).

## Reconstruire et vérifier

Node.js et Python 3 suffisent pour la compilation et les tests du moteur. Les tests d’interface utilisent `@napi-rs/canvas`, ceux de navigateur Playwright avec Chromium. Aucun de ces outils n’est requis pour jouer.

```sh
node content/adventure-campaign.cjs
node tests/adventure.test.cjs
node tests/adventure-state.test.cjs
node tests/adventure-mechanics.test.cjs
node tests/adventure-app.test.cjs
node tests/joypad.test.cjs
node tests/campaign100-state.test.cjs
node tests/campaign100-app.test.cjs
node tests/variety.test.cjs
python3 build.py
node tests/package.test.cjs
node tests/mobile-layout.test.cjs
node tests/adventure-browser.test.cjs
```

`content/adventure-campaign.cjs` contient les scènes, les variantes, le catalogue explicite des combinaisons et leurs plans de solution. `src/adventure.js` gère les nouvelles interactions ; `src/engine.js` reste la simulation commune aux campagnes. Les scripts historiques `content/campaign100.cjs` et `content/author-campaign.cjs` servent à reconstruire leurs anciennes éditions : ne pas les lancer pour compiler la version 2.0.

Vercel sert le dossier `dist/` déjà compilé. Tout changement de jeu doit donc être suivi de `python3 build.py` et de la publication des fichiers compilés avec les sources.

Les personnages et décors sont dessinés en Canvas. L’arrangement instrumental de la comptine traditionnelle est documenté dans [MUSIQUE.md](MUSIQUE.md).
