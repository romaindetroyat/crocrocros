# Difficulté, progression et satisfaction

## Objectif

La difficulté doit augmenter par les décisions et leurs conséquences : occupation simultanée de postes, ressources communes, ordre des opérations, séparation et réunion des personnages, retour de celui qui commande. Un niveau terminé doit signifier que le joueur a compris puis exécuté un plan.

## Mise en œuvre dans la v0.5

| Étape | Compétence travaillée | Décision structurante |
| --- | --- | --- |
| 1 | Découvrir la complémentarité | Le passage supérieur prépare le tir du héros resté au sol. |
| 2 | Coordonner des positions | Deux crocos maintiennent les signaux pendant que le troisième agit. |
| 3 | Organiser une expédition | Le premier parti doit ouvrir la traversée des autres et ramasser la clé. |
| 4 | Trouver un remplacement | Le contrepoids libère le croco chargé de tenir la porte. |
| 5 | Prévoir le retour | Le dernier opérateur doit pouvoir rejoindre ses équipiers après la traversée. |
| 6 | Recomposer un plan | Les trois départs séparés, le contrepoids et l’alimentation partagée imposent plusieurs phases. |

| 7 | Sang-froid et orientation | Soutenir une trompe pendant que le tireur contourne une cloche blindée. |
| 8 | Organiser des voyages | Transporter deux héros séparément, puis rendre le silence nécessaire au tir. |
| 9 | Préparer le retour | Récupérer un sceau à droite pour ouvrir une sortie à gauche et le raccourci des éclaireurs. |
| 10 | Coordonner trois étages | Positionner le tireur avant de déplacer un contrepoids ; libérer ensuite le dernier opérateur. |
| 11 | Maîtriser le planeur | Envoyer Croquefort seul au-dessus du vide pour ouvrir le pont aux autres. |
| 12 | Escorter et observer | Protéger le tireur sur deux étages et récupérer le sceau après le passage des patrouilles. |

Cette progression est une intention de conception. Les tests automatiques valident la faisabilité, les dépendances et la sauvegarde ; ils ne mesurent pas la difficulté ressentie. Les étapes 7 à 12 sont maintenant des cartes particulières. Les étapes 13 à 37 gardent leurs assemblages de base, avec des patrouilles ajoutées : leur difficulté reste à calibrer avec des joueurs.

## Conditions de qualité pour les prochaines refontes

- Une idée principale par niveau, puis une combinaison nouvelle d’idées déjà apprises.
- Les commandes et les objets doivent être lisibles avant d’être combinés de façon exigeante.
- Chaque personnage doit contribuer au résultat et pouvoir retrouver les autres.
- Les dépendances doivent demander une décision, pas seulement un aller-retour sans choix.
- Une erreur d’ordre doit pouvoir se corriger ; les indices et le rembobinage restent disponibles.
- Les trois étoiles proposent une recherche supplémentaire et ne bloquent jamais la campagne.
- Une réussite valide immédiatement la progression. La célébration et le bilan soulignent ce que l’équipe a accompli, sans noter la rapidité.
- Avant extension vers 100 ou 200 niveaux, recueillir pour chaque carte : compréhension initiale, moment de découverte, blocage éventuel, indices utilisés et satisfaction à la sortie.

## Validation de cette livraison

37 parcours résolus avec les commandes de production et trois étoiles, sans réapparition utilisée comme raccourci. Vérification spécifique : seul Croquefort pousse les contrepoids ; ils maintiennent la dalle sans personnage ; sauvegarde, restauration et rembobinage les conservent ; la cible du niveau 6 refuse le tir tant que l’atelier détourne son alimentation.

La vue d’ensemble, la célébration, l’enregistrement immédiat et le passage au niveau suivant sont exécutés dans un banc d’essai avec DOM minimal et véritable Canvas. Aucun test de navigateur réel, d’installation PWA sur téléphone ou de difficulté auprès d’un joueur humain n’a été réalisé dans cet environnement.

## Bestiaire 0.6

Les étoiles portées par les zèbres deviennent des défis de placement facultatifs : encerclement avec deux héros puis action de capture. Les farces se lisent avant leur déclenchement : pied levé de l’éléphant (1,3 s), inspiration de l’hippopotame (1,15 s), lionceau accroupi (0,9 s), envol du vautour (1,1 s). Chaque attaque est suivie d’un repos. Les animaux remarquent le personnage actif ; les dangers déjà déclenchés peuvent aussi toucher un coéquipier laissé sur leur trajectoire.

L’étape 5 introduit le vautour sur l’îlot ; l’étape 6 un lionceau dans l’atelier haut. L’étape 9 demande de penser au sens du bouclier lorsque Croquefort reste sur la plaque près de l’éléphant. Les 37 solutions de contrôle intègrent la capture des zèbres et ces nouveaux placements. La durée des solutions scriptées ne constitue pas une estimation du temps de découverte par un joueur.
