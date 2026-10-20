# Analyse des vidéos fournies

20 octobre 2026. Quatre aperçus MPEG d’environ 9,46 secondes, 640 × 480, flux vidéo déclaré à 60 images/seconde. Examen par extraction d’images à 2 images/seconde, puis à 6 images/seconde sur les passages aériens. Les clips contiennent des images répétées et des changements rapides de situation ; ils ne permettent pas de mesurer avec certitude la vitesse normale exacte du jeu original. Aucun sprite, décor, son ou plan n’en a été extrait pour le jeu.

| Fichier | Passage observé, approximatif | Ce qui guide notre jeu |
| --- | --- | --- |
| preview_lost_vikings_de.mpg | 1,5–3,5 s : montée collective à l’échelle ; 4–5,5 s : confrontation sur une corniche | Une véritable pose de grimpe de dos, des bras et jambes alternés, une formation protecteur/tireur et des actions lisibles. |
| preview_lost_vikings_gen.mpg | 0,5–2,5 s : changement d’étage ; 2,5–5,5 s : présence de créatures mobiles sur la route | Le décor organise les trajets ; les menaces se déplacent et imposent de choisir qui passe devant. |
| preview_lost_vikings(1).mpg | 0,5–2,5 s : franchissement aérien avec plusieurs poses très différentes ; 4–6 s : face-à-face au sommet | Silhouettes aériennes distinctes, bouclier orienté selon son usage, relief qui rend les capacités utiles et adversaires visibles. |
| preview_lost_vikings_2.mpg | 3,5–6 s : descente dans une cavité vers d’autres personnages | Une lecture verticale du niveau et des animations propres à l’action. Cet aperçu concerne la suite : ses capacités ne doivent pas toutes être attribuées au premier jeu. |

## Changements retenus dans la v0.5

1. Marche plus vive : +13 à +16 % selon le croco, montée aux échelles accélérée. Les valeurs sont ajustées pour notre physique, pas présentées comme une copie mesurée de l’original.
2. Poses articulées de course, saut, échelle, charge, recul, effort et vol plané, plus réactions de peur et de joie. Le croco reste accroché à l’échelle lorsqu’on relâche la commande ou sélectionne un équipier.
3. Bouclier à trois usages : protection frontale, marchepied, planeur. L’étape 11 nécessite réellement le planeur ; la même traversée échoue bouclier abaissé. Le joueur se laisse tomber, il ne vole pas librement et ne gagne pas d’altitude.
4. Animaux qui patrouillent : hippopotames, lionceaux et vautours farceurs. Le bouclier frontal les repousse, les boulettes ou charges les font dormir. L’état est sauvegardé et rembobiné.
5. Géométries et dépendances : un retour vers une sortie à gauche, trois étages reliés, des passagers transportés séparément et une longue traversée aérienne qui prépare le passage des deux autres.
6. Univers propre : crocodiles cartoon, zèbres pour les bonus, grands éléphants intimidants mais amicaux, quête de la bannière du retour et musique de comptine arrangée.

## Limites

Le moteur reste un prototype Canvas 2D : il ne reproduit pas l’inventaire, tous les ennemis, tous les mouvements ou tous les reliefs des deux jeux de référence. Douze étapes ont désormais leur carte particulière ; les vingt-cinq autres utilisent encore des compositions de passages à retravailler progressivement. Le plaisir, le dosage des menaces et la difficulté doivent être validés en jouant, au-delà des parcours automatiques.
