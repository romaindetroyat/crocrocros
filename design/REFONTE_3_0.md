# Refonte 3.0 — 75 énigmes, une troupe vivante

## Demande et diagnostic

Objectif fixé par le joueur : 75 niveaux, sans remplissage par variantes de distance. Une difficulté de réflexion croissante, des animaux utiles aux énigmes, une troupe expressive, des lieux riches et une campagne plus agréable à jouer. Les 100 niveaux de la version 2.0 restent accessibles comme archive, avec leur sauvegarde séparée. La campagne principale contient 75 niveaux.

La version 2.0 prouvait l'existence de solutions pour 100 parcours. Ses 76 assemblages de passages indépendants rendaient les parcours plus longs sans garantir une énigme nouvelle. La note de difficulté suivait le numéro du niveau. Ces deux procédés sont exclus de la nouvelle sélection.

## Méthode de conception

1. Définir la découverte propre au niveau : ce que le joueur comprend ici et ne pouvait pas simplement répéter au niveau précédent.
2. Dessiner les dépendances entre actions, les rôles des trois crocos et le chemin de retour du dernier opérateur.
3. Donner aux commandes une raison d'être dans le lieu : irrigation, atelier, récolte, pont vivant, observatoire.
4. Construire un espace connecté. Deux salles ajoutées bout à bout ne comptent pas comme une nouvelle combinaison.
5. Écrire une solution par entrées réelles, tester les mauvaises configurations prévisibles, la récupération et les sauvegardes.
6. Comparer les signatures des énigmes : même logique avec des distances, noms ou couleurs différents = doublon à enlever.
7. Séparer la durée de déplacement de la difficulté. La montée en complexité vient de dépendances, réversibilité, répartition des rôles et anticipation.
8. Prévoir un détour optionnel qui teste une idée supplémentaire. Les étoiles ne bloquent pas la sortie.
9. Vérifier en vue de jeu mobile, pas seulement sur une carte générale.

Les tests ne permettent pas de certifier le plaisir. Les critères de playtest humain restent : compréhension sans solution connue, fréquence des nouvelles découvertes, déplacements subis, frustration récupérable et envie de continuer. Ne pas présenter un replay parfait comme une preuve de fun.

## Références étudiées

- [The Lost Vikings, rétrospective de Blizzard](https://news.blizzard.com/en-gb/article/23609765/the-lost-vikings-and-how-we-learned-to-love-multiplayer-puzzles) : spécialisation des personnages, entraide, énigmes resserrées et apprentissage sans punition immédiate. Application : limiter les longs trajets de regroupement, faire dépendre les passages d'actions réellement complémentaires.
- [Baba Is You, Hempuli](https://www.hempuli.com/baba/) : le changement des règles produit de nouvelles lectures d'une situation connue. Application : introduire des contraintes qui changent l'usage d'un mécanisme, pas seulement sa position. Pas de copie des niveaux ou du système de mots.
- [Snipperclips, Nintendo](https://www.nintendo.com/fr-fr/Jeux/Jeux-a-telecharger-sur-Nintendo-Switch/Snipperclips-Les-deux-font-la-paire-1173331.html) : coopération et expérimentation expressive. Application : personnages lisibles, erreurs réversibles, gestes avec anticipation et chute comique.
- [Frozenbyte, Environmental Storytelling](https://wiki.frozenbyte.com/index.php/Level_Art:_Environmental_Storytelling) : cohérence entre le lieu, les interactions, les habitants et les accessoires. Application : mécanismes intégrés dans le monde, animaux ayant une fonction, repères visuels qui aident à lire le niveau.

## Troupe — réalisé et vérifié

45 petites animations d'attente (15 par personnage), 8 scènes à deux, réactions au contexte, poses de passagers et de porteur, célébrations individuelles. Un directeur d'animation choisit sans répétition immédiate, espace les scènes communes et donne la priorité au contrôle du joueur. Les états de présentation restent hors de la simulation et des sauvegardes. Une scène consultable depuis l'accueil ou Pause permet de regarder chaque numéro. Le réglage suit les préférences de réduction des animations de l'appareil, avec choix manuel.

## Des quêtes pour donner une raison au voyage

La grande crue a isolé les habitants et arrêté le théâtre. Les 15 missions font préparer une fête : courrier, entraide, balises, récolte, livraisons, irrigation, machines, décors, instruments, lanternes, jardins, voyageurs, coulisses, répétitions et réunion finale.

Chaque mission forme un groupe de cinq niveaux : une entrée, trois préparatifs dans l’ordre choisi, puis une conclusion. Le carnet affiche l’objectif actif, l’avancement par mission et région, les étoiles individuelles et les collections complètes. La victoire décrit la contribution du niveau. Le village montre cinq lieux remis en état, avec des étapes de restauration entre les missions.

Les étoiles sont des découvertes facultatives. Chaque niveau possède trois identifiants stables et trois noms de découverte. Après une victoire, les identifiants trouvés sont réunis avec ceux des précédentes victoires : on peut compléter une collection en plusieurs parties sans devoir tout refaire d’un coup. Le total est plafonné à 225, sans récompense répétée pour la même étoile. Six paliers embellissent visiblement le village : 15, 45, 90, 135, 180 et 225. La progression de l’histoire ne demande aucune étoile.

## Sélection et difficulté

La campagne retient 15 scènes distinctes de la 2.0 et ajoute 60 scènes nouvelles. Aucun niveau ne concatène des passages indépendants pour augmenter artificiellement sa durée. Les ressources réutilisées, les relations entre actions et les retours des opérateurs servent de fil conducteur.

Cinq bandes éditoriales décrivent le raisonnement : découverte, exploration, combinaisons, anticipation et grand défi. Elles ne sont pas calculées à partir du numéro du niveau. Une région peut commencer plus doucement pour enseigner une nouvelle interaction. Les niveaux tardifs demandent davantage de préparation et de réaffectation des mêmes outils ; les temps des replays sont ceux d’une solution déjà connue et ne mesurent pas la difficulté d’un premier essai.

L’audit compare des graphes de dépendances anonymisés et typés, sans noms ni coordonnées, avec six passes de raffinement. Aucun groupe identique n’a été détecté. Cela permet de repérer une répétition logique évidente, mais ne prouve ni l’originalité ressentie ni l’absence de toute équivalence. Le catalogue ci-dessous rend l’intention de chaque énigme contrôlable.

## Décors et habitants

Deux commandes animales nouvelles : tortues servant de plateformes mobiles ou de supports de miroirs, et grenouilles associées aux notes et aux lumières. Les vagues des éléphants, les souffles des hippopotames, les noix de coco des oiseaux et les bonds des lions déclenchent des récepteurs lisibles. Des leurres et des changements de poste modifient leur rôle selon l’énigme.

Neuf espèces décoratives ajoutent une vie périphérique : loutre, canard, crabe, hérisson, escargot, papillon, souris, chouette et luciole. Les bâtiments, vergers, moulins, ateliers, observatoires et théâtres donnent une identité aux lieux ; leurs éclairages et accessoires réagissent aux objectifs. Les dessins sont locaux, sans chargement d’images externes.

## Vérification et limites

- 75 solutions par entrées réelles du moteur, 225 étoiles, aucun retour après choc ou chute sur ces trajets.
- 1 314 interruptions sauvegardées puis reprises jusqu’à la victoire : objets portés, passagers, plateformes, projectiles et partitions en cours.
- Tests de mauvaises configurations : surcharge, compte exact, erreurs de partition puis récupération, orientation du bouclier, rappel des ascenseurs à chaque étage, transport de charges et rejet d’états invalides.
- Tests des 15 missions, du cumul des étoiles distinctes, des 6 récompenses, des 5 restaurations, du mode libre et de l’isolation des sauvegardes historiques.
- Rendu des 75 cartes en deux cadrages dans Chromium, 16 scènes de partie avec Plan et carnet, trois formats mobiles en paysage, pause en portrait, scène pleine largeur et joypad dessous.
- 45 animations d’attente à six moments de leur déroulement, 8 duos, priorité à l’entrée du joueur, pause et réduction des animations ; état de simulation inchangé.
- Archives 2.0 et 1.2 rejouées : 200 victoires, 600 étoiles et 4 071 reprises au total.

Les résultats et les rapports reproductibles sont dans `VALIDATION.json` et `tests/campaign75-*.json`. Ces contrôles ne remplacent pas un parcours humain des 75 énigmes ni Safari sur iPhone physique. Les chemins alternatifs n’ont pas été explorés exhaustivement. La lisibilité, les temps de réflexion et le plaisir doivent encore être confrontés à des joueurs qui ne connaissent pas les solutions.

## Catalogue des 75 intentions

Les étoiles sont facultatives et leurs noms figurent dans le carnet. « Bande » est l’appréciation éditoriale de 1 à 5 décrite ci-dessus, pas une mesure issue d’un playtest humain.

| N° | Énigme | Découverte ou contrainte structurante | Bande |
| --- | --- | --- | --- |
| 1 | Le bac n’attend personne | bac et retour | 1 |
| 2 | Le petit pois prend l’escalier | ricochet et protection | 1 |
| 3 | Et le dernier, on le laisse ? | sauvetage et relève | 2 |
| 4 | Une porte peut en cacher une autre | portes complémentaires | 2 |
| 5 | Le quatrième équipier | contrepoids et raccourci | 2 |
| 6 | Taxi pour trois museaux | vol en équipe | 2 |
| 7 | En haut, en bas, et dans cet ordre | aiguillage de tirs | 2 |
| 8 | Ce pont a un étage de moins | décor transformable | 2 |
| 9 | Un monte, l’autre descend | ascenseurs en opposition | 2 |
| 10 | La photo de famille | coordination simultanée | 2 |
| 11 | La boulette qui prend les virages | labyrinthe de ricochets | 3 |
| 12 | La tournée du sauveteur | sauvetage sur deux balcons | 3 |
| 13 | Passez-moi le courant | relais de souffleries | 3 |
| 14 | Trois billets pour les nuages | tremplin et vol plané | 2 |
| 15 | La livraison transdimensionnelle | tir et voyage par portail | 3 |
| 16 | Le pied qui réveille le moulin | Intercepter une onde après son récepteur | 2 |
| 17 | À tes souhaits, la balance | Contourner un contrepoids avant de le faire pousser par le vent | 3 |
| 18 | La livraison de Paulette | Faire tomber un projectile dans un panier suspendu | 2 |
| 19 | Le lion saute la sonnette | Utiliser la trajectoire d’un bond pour toucher une sonnette haute | 3 |
| 20 | La tortue et le rayon de lune | Garer un réflecteur mobile sous sa cible | 3 |
| 21 | Basile, joue-la encore | Transformer une première onde en accès au poste qui autorise la seconde | 3 |
| 22 | L’éternuement à double service | Choisir successivement les deux directions d’une même force | 3 |
| 23 | Deux paniers et un bec | Préparer le deuxième récepteur avant de laisser passer la prochaine noix | 3 |
| 24 | Le chœur qui chante de travers | Inverser des voisins pour obtenir une configuration, sans appuyer partout au hasard | 2 |
| 25 | Le dernier invité de Tortille | Utiliser deux états d’un passage pour organiser une relève avec retour | 3 |
| 26 | Le pont préfère le silence | Couper volontairement le courant après avoir mis l’équipe en sûreté | 3 |
| 27 | Prends ma place, je pousse | Remplacer un poids par un équipier avant de déplacer ce poids hors d’un tir | 4 |
| 28 | Le bouclier fait des reflets | Employer le protecteur comme réflecteur mobile pour deux rayons verticaux | 3 |
| 29 | Le courrier arrive par derrière | Utiliser le sens d’un tir et le retour d’un portail pour atteindre un verrou blindé | 3 |
| 30 | Tout le monde au pique-nique | Faire coopérer deux animaux pour fixer le trajet de retour du dernier opérateur | 4 |
| 31 | Trop de courant dans le moulin | Distinguer la configuration d’accès de la configuration de fonctionnement | 3 |
| 32 | Le studio veut du calme | Observer sous pression puis libérer la scène avant le tir | 4 |
| 33 | Trois pour ouvrir, deux pour jouer | Changer une majorité de trois en équilibre de deux sans perdre le résultat | 4 |
| 34 | La répétition des trois grenouilles | Lire une partition et retrouver ses notes dans un espace à deux étages | 3 |
| 35 | Un atelier au plafond | Préparer un miroir à quai puis verrouiller son arrivée depuis un autre étage | 4 |
| 36 | La manivelle n’a pas de jumelle | Réemployer une même pièce après avoir sécurisé le premier mécanisme | 3 |
| 37 | Le colis passe avant le livreur | Passer un colis pendant qu’un autre croco tient le chemin, puis transmettre la relève | 4 |
| 38 | Dix kilos de confettis | Répartir quatre poids différents en deux charges égales | 4 |
| 39 | Le croco qui pesait une plume | Remplacer un opérateur par une charge pour libérer ses capacités | 4 |
| 40 | L’aiguillage à trois humeurs | Mémoriser des réparations en changeant une distribution à trois états | 4 |
| 41 | Léon garde le ballon | Installer un leurre pour obtenir le poids d’un animal sur un plateau | 4 |
| 42 | Une cloche pour deux pupitres | Déplacer un instrument pour jouer une partition alternée | 4 |
| 43 | La batterie veut passer aussi | Maintenir un passage pendant le transport de sa propre source d’énergie | 4 |
| 44 | Le dernier sac appartient au pont | Libérer un contrepoids après avoir fixé le chemin qu’il tenait | 4 |
| 45 | L’orchestre tient à un fil | Faire circuler deux outils entre les réparations d’un même instrument | 5 |
| 46 | L’escalier préfère la nuit | Prendre un chemin dans l’obscurité, puis modifier son état depuis un refuge | 3 |
| 47 | Deux lunes pour Tortille | Utiliser les deux mouillages d’un miroir mobile sans oublier le premier | 4 |
| 48 | La constellation se joue au canon | Composer une partition en orientant un même tir vers deux cibles musicales | 4 |
| 49 | Le voyage finit au commencement | Préparer un raccourci de retour avant de refermer la route d’aller | 4 |
| 50 | Le prisme partage la lune | Déplacer une ressource entre deux branches d’un réseau optique | 4 |
| 51 | Les veilleuses se chamaillent | Raisonner sur les effets croisés de quatre interrupteurs | 4 |
| 52 | Le passager descend pour mieux monter | Prévoir un débarquement intermédiaire pour rappeler un transport | 4 |
| 53 | Les voisins des deux balcons | Débloquer l’autre rive avant que l’autre rive puisse vous débloquer | 4 |
| 54 | L’astronome a perdu son miroir | Combiner un objet optique et un réflecteur vivant à la bonne hauteur | 4 |
| 55 | Le pont regarde ailleurs | Changer la destination d’une passerelle après avoir placé le tireur | 5 |
| 56 | Il faut ranger le ballon | Retirer un leurre après l’avoir utilisé pour placer un animal | 4 |
| 57 | Vingt-quatre secondes pour les lucioles | Préparer une coordination avant de lancer un mécanisme temporaire | 4 |
| 58 | Trois fenêtres dans la nuit | Démêler une dépendance circulaire grâce à un secours temporaire | 5 |
| 59 | Tortille transporte sa cloche | Envoyer un passager stabiliser l’autre quai avant de transporter l’appel | 5 |
| 60 | Le réveil des jardins suspendus | Faire circuler la lumière entre accès, musique et départ | 5 |
| 61 | Un invité vaut deux sacs | Équilibrer deux postes avec un objet, un animal et deux crocos | 4 |
| 62 | Le décor fait le tour du propriétaire | Préparer les deux côtés d’une boucle avant de déplacer son contrepoids | 5 |
| 63 | Le rayon arrive avant les invités | Préparer un réflecteur à destination pour un tir venu d’un portail | 4 |
| 64 | Les instruments font des poids | Changer la fonction d’un objet après avoir mémorisé un équilibre | 5 |
| 65 | Paulette ferme les coulisses | Coordonner deux animaux et conserver un poste jusqu’à l’arrivée de la livraison | 5 |
| 66 | La fanfare n’a pas de musiciens | Diriger les animaux pour produire les notes d’une partition | 5 |
| 67 | Le spectateur qui déteste courir | Ouvrir un détour calme après une relève de plateau | 4 |
| 68 | L’ascenseur fait sa tournée | Planifier les arrêts de trois passagers avec deux colis de destinations opposées | 5 |
| 69 | Un piano dans les courants d’air | Transporter une charge lourde sans abandonner les deux passagers | 4 |
| 70 | La répétition générale des lanternes | Conserver deux préparatifs avant d’échanger la source d’un troisième | 5 |
| 71 | Trois rendez-vous pour une cloche | Réutiliser un appel dans un ordre dicté par les accès qu’il ouvre | 5 |
| 72 | Le bon étage n’est pas le dernier | Garer un ascenseur-réflecteur au bon niveau après une livraison au sommet | 5 |
| 73 | Le bouclier joue tous les rôles | Passer du marchepied au miroir puis au planeur sans perdre un équipier | 5 |
| 74 | Quatre postes pour trois crocos | Remplacer deux opérateurs avant de répartir les trois rôles vivants | 5 |
| 75 | Le rideau se lève pour tout le marais | Réunir les habitants, réemployer les outils et libérer le dernier régisseur | 5 |
