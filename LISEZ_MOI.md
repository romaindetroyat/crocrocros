# Les Cro Cro Cros — La bannière du retour

Version 0.8.0 · 20 octobre 2026

Jeu de plateforme et de réflexion en solo, en français. Trois crocodiles complémentaires, 37 étapes, six chapitres, 111 étoiles facultatives. Aucun compte, publicité, achat ou serveur de jeu. Tout le contenu est inclus et fonctionne hors ligne.

## Jouer

Adresse publique : **https://crocrocros.vercel.app/**

Ouvrir **Les_Cro_Cro_Cros.html** dans un navigateur sur ordinateur. La musique démarre après une première interaction. Pour reprendre la progression d’un ancien fichier HTML dont le nom ou l’emplacement change, exporter la sauvegarde depuis les réglages de l’ancien jeu, puis l’importer dans le nouveau. Selon le navigateur, le stockage local des fichiers dépend de leur chemin.

Le dossier **dist/** contient la PWA installable. Il doit être servi en HTTPS, ou sur localhost pour un essai local. Le site public est déployé sur Vercel. L’installation depuis un simple fichier téléchargé n’est pas une installation PWA.

```sh
python3 -m http.server 8080 --directory dist --bind 127.0.0.1
```

Ouvrir ensuite http://localhost:8080. Sur un hébergement HTTPS, attendre « PRÊT HORS LIGNE », puis utiliser l’installation proposée par le navigateur. Après le premier chargement, le jeu n’a pas besoin de connexion.

## Commandes

| Action | Clavier |
| --- | --- |
| Choisir Croquinet, Croquefort, Croqueboum | W, X, C |
| Marcher | ← et → |
| Sauter avec Croquinet / monter à l’échelle | ↑ |
| Descendre une échelle | ↓ |
| Capacité, levier, passage, prendre l’étoile d’un zèbre | Espace |
| Revenir jusqu’à environ 8 secondes en arrière | R |
| Vue d’ensemble en pause | M |
| Pause | Échap |

Les boutons tactiles permettent de marcher et agir simultanément. Un portrait sélectionne directement un croco. Près d’une échelle, un bouton tactile ↓ apparaît pour redescendre. Sur une échelle, relâcher la direction laisse le croco accroché ; changer de personnage le laisse également sur son barreau.

- **Croquinet** saute, charge, casse les caisses et assomme les animaux avec sa charge.
- **Croquefort** bloque les tirs et les animaux avec son bouclier frontal, du côté qu’il regarde. Espace lève le bouclier : il sert alors de marchepied et de planeur. Pour planer, quitter une corniche en maintenant la direction, bouclier levé. Il ne saute pas. Son bouclier levé ne protège plus son avant. Il pousse aussi les contrepoids.
- **Croqueboum** tire des boulettes pour actionner les cibles ou envoyer les gêneurs faire une sieste.
- Espace prend l’étoile d’un zèbre prêt à l’offrir à proximité ; sinon, il privilégie un levier ou une arche avant la capacité du personnage.
- Les trois doivent rejoindre l’arrivée. Une sortie avec un sceau manquant demande d’abord de résoudre son mécanisme.

## Nouveautés 0.8 : des rencontres en chemin

Cinq zèbres seulement (niveaux 4, 12, 19, 27 et 35), placés au cours du parcours, loin des arches d’arrivée. Le curieux approche si vous attendez sans bouger ; le gourmand mange pendant quatre secondes après une boulette de Croqueboum ; le flâneur broute trois secondes entre ses trottinements. Approchez et utilisez Espace ou le bouton « Étoile ». Aucun encerclement requis. Les bonus restent facultatifs.

Les étoiles des autres niveaux redeviennent fixes. Les niveaux terminés et leurs étoiles sont conservés à la mise à jour ; seule la tentative en cours redémarre avec la nouvelle disposition. Pour passer du fichier local au site Vercel, exporter la progression puis l’importer dans les réglages du site.

`vercel.json` publie le dossier `dist/` déjà construit depuis la racine du dépôt GitHub. Aucun serveur de jeu n’est ajouté. Le service worker et la page sont revalidés à chaque connexion ; le jeu conserve son fonctionnement hors ligne après le premier chargement complet.

## Correctif 0.7.1 : dépassement de l’arrivée

Un croco placé après l’arche, du côté de la sortie, compte désormais pour terminer le niveau. Cette règle fonctionne vers la droite et pour la sortie de retour à gauche de l’étape 9. Les trois crocos doivent toujours être arrivés au bon étage et les conditions de sortie doivent être remplies. Les sauvegardes existantes sont compatibles, y compris si un croco avait déjà dépassé l’arche.

## Nouveautés 0.7 : identité visuelle et dessin

Le projet est versionné dans `romaindetroyat/crocrocros`. Les sources, la campagne, les tests, la PWA compilée dans `dist/` et l’édition HTML autonome à la racine sont conservés ensemble.

- Croquinet : silhouette affinée, peau vert vif, casquette rouge et foulard à deux pointes.
- Croquefort : corps et joues plus larges, peau olive doré, casque à relief, bretelle et bouclier riveté portant un écusson.
- Croqueboum : peau turquoise, béret bleu, lunettes cerclées, sacoche à graines et lance-boulettes en bois et métal.
- Écailles discrètes, ventre segmenté, reflets dans les yeux, ombres douces, coutures, relief des accessoires et contours hiérarchisés. Les silhouettes restent simples et utilisent le même dessin vectoriel animé en jeu, dans les portraits et sur l’écran d’accueil.
- Bestiaire harmonisé : volumes du museau de l’hippopotame, crinière et moustaches du lionceau, plumage du vautour, sacoche et regard du zèbre, oreilles et couverture brodée de l’éléphant.
- Cette mise à jour est visuelle : commandes, collisions, niveaux et mécanismes sont inchangés. Une sauvegarde 0.6 reprend à la position exacte. Les versions de cartes antérieures conservent leur migration habituelle.

La planche `docs/personnages-v07.png` est générée à partir des fonctions de dessin réellement utilisées par le jeu. `tests/design-preview.cjs` permet de la reconstruire avec `@napi-rs/canvas`.

## Nouveautés 0.6 : un bestiaire qui intervient dans le jeu

- **Zèbres** : le système de tenaille de la version 0.6 est remplacé par les rencontres décrites en 0.8 ci-dessus.
- **Éléphants** : ils lèvent un pied pendant 1,3 seconde avant de frapper le sol. L’onde renvoie un croco touché au ralliement. Croquinet peut la sauter ; Croquefort l’arrête avec son bouclier frontal tourné vers l’éléphant. Résoudre le mécanisme associé calme l’animal. Les trompes restent des portes et des ascenseurs.
- **Hippopotames** : joues gonflées, inspiration puis éternuement. La bourrasque déplace un croco de 94 unités, peut lui faire quitter une plaque ou tomber d’un bord et s’arrête sur le bouclier frontal. Le souffle ne fait pas perdre une vie directement.
- **Lionceaux** : accroupissement, bond avec trajectoire en arc, puis récupération avec grimace et langue tirée. Les collisions, boulettes et charges utilisent leur position pendant le bond.
- **Vautours** : décollage avec une noix de coco, cercle d’avertissement, lâcher soumis à la gravité et retour au repos. La noix touche les crocos, se casse sur un sol ou sur le bouclier levé. Esquiver reste possible. Les oiseaux endormis ne lancent plus de noix ; une noix déjà lâchée continue sa chute.
- Le vautour apparaît dès l’étape 5, le lionceau dès l’étape 6. Les autres patrouilles de la campagne conservent leurs rôles avec ces nouveaux comportements.
- **Animations liées aux actions** : pattes articulées, oreilles, queue, cou, ailes, gonflement des joues, bouche ouverte, anticipation, bond, récupération, fuite, saut d’esquive, capture et sieste. Les avertissements sonores complètent les signes visuels.
- **Neuf paysages enrichis** : maisons sur pilotis et barques au port ; racines, lianes et orchidées dans la canopée ; falaises à facettes, embruns et arc-en-ciel aux cascades ; statues de crocodiles dans les ruines ; champignons lumineux au clair de lune ; roue à eau et tuyaux du moulin ; acacias et termitières en savane ; carrousel de la foire ; maçonnerie et herse du fort. Les sols et premiers plans changent aussi selon le lieu.
- Journal ⚑ détaillant les farces et les parades, message contextuel pour le premier zèbre aperçu et bouton tactile de capture.

Le jeu conserve ses 37 étapes, dont 12 cartes particulières et 25 fondées sur les familles de passages existantes. Cette version enrichit le bestiaire et les décors ; elle n’ajoute pas de niveaux. La quête des six morceaux de bannière, les contrôles W/X/C, la vitesse, le planeur et l’arrangement local de la comptine restent présents.

## Sauvegardes

Sauvegarde locale environ toutes les deux secondes, aux pauses et lors du passage en arrière-plan. Positions, échelles, bouclier, contrepoids, ascenseurs, mécanismes, animaux, phases d’attaque, noix de coco en vol, zèbres, étoiles et étapes terminées sont conservés. La réussite est enregistrée avant la célébration.

Les cartes remaniées portent une nouvelle révision. Une tentative en cours sur une de ces cartes reprend au départ de cette étape, avec un message explicite. Les étapes terminées et les étoiles restent acquises. Utiliser « Exporter ma progression » pour une copie indépendante et « Importer » pour changer de navigateur ou d’appareil. Les données ne sont pas synchronisées ; effacer les données du navigateur efface la copie locale. Clé interne inchangée : `crocrocros.progress.v1`.

## Sources, extension et reconstruction

**ANALYSE_VIDEOS.md** résume les quatre vidéos fournies et les changements qu’elles ont guidés. **CARNET_ADAPTATION.md** contient les sources des guides et les solutions de nos cartes : attention aux révélations. **DIFFICULTE.md** décrit la progression visée.

La campagne utilise des identifiants stables et un catalogue paginé. Le catalogue a été vérifié avec un jeu de données de 200 entrées ; la livraison contient réellement 37 étapes. L’extension vers 100 ou 200 demande encore de créer et de faire tester les énigmes.

Reconstruction :

```sh
node content/author-campaign.cjs
python3 build.py
node tests/engine.test.js
node tests/exit.test.cjs
node tests/blocks.test.cjs
node tests/wildlife.test.cjs
node tests/pranks.test.cjs
node tests/music.test.cjs
node tests/package.test.cjs
```

`content/handcrafted.cjs` définit les cartes 1 à 6 ; `content/elephant-chapter.cjs` les cartes 7 à 12, le bestiaire et les variantes de décor. `content/campaign.json` est généré. Le moteur, le dessin, la musique et l’interface sont dans `src/`. `src/wildlife.js` porte les comportements, les dangers et leur sérialisation. Le jeu n’a aucune dépendance externe.

Les tests d’interface `tests/app.test.cjs`, les rendus `tests/render.cjs` et l’aperçu vidéo `tests/preview.cjs` utilisent facultativement `@napi-rs/canvas` ; le dernier nécessite aussi FFmpeg. Ces outils ne sont pas requis pour jouer.

## Vérifications et limites

Les 37 étapes ont une solution rejouée à 60 Hz, avec les trois personnages à l’arrivée, toutes les étoiles et aucune réapparition utilisée pour avancer. Des tests ciblés contrôlent la protection directionnelle, le planeur obligatoire, la capture coopérative, les attaques et leurs parades, la sauvegarde en plein bond ou avec une noix en vol, les conditions des éléphants, les contrepoids, les échelles, la sauvegarde et le rembobinage.

L’interface est exécutée avec un DOM minimal et le véritable moteur de dessin Canvas ; Web Audio et le cache hors ligne sont vérifiés par des simulations de leurs API. Des images et un aperçu vidéo du rendu réel du moteur ont été inspectés.

**Pas de test dans un navigateur réel ni sur un iPhone physique dans cet environnement.** Le rendu CSS, le son sur appareil et l’installation PWA restent à confirmer sur les appareils cibles. Les solutions automatiques prouvent la faisabilité, pas la difficulté ressentie ni le plaisir de jeu. La campagne a encore besoin de retours humains avant son extension.
