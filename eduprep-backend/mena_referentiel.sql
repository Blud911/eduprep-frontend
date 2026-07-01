-- REFERENTIEL MENA-CI COMPLET
-- EduPrep CI - Programme officiel Cote d Ivoire
-- College (6eme->3eme) + Lycee (2nde->Terminale)

DELETE FROM programmes_mena;

-- ============================================================
-- COLLEGE 6EME
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','6eme','mathematiques',1,'Les nombres entiers naturels',
 ARRAY['Lire, ecrire et comparer les entiers naturels','Effectuer les quatre operations sur les entiers','Maitriser la division euclidienne'],
 ARRAY['entiers naturels','ordre','addition','soustraction','multiplication','division euclidienne','quotient','reste'],12,1),
('college','6eme','mathematiques',2,'La numeration decimale',
 ARRAY['Comprendre le systeme decimal positionnel','Convertir fractions decimales en ecriture decimale','Comparer et ranger les decimaux'],
 ARRAY['decimaux','virgule','dixieme','centieme','millieme','rang'],10,2),
('college','6eme','mathematiques',3,'Les fractions',
 ARRAY['Comprendre la notion de fraction','Comparer des fractions de meme denominateur','Effectuer additions et soustractions de fractions simples'],
 ARRAY['numerateur','denominateur','fraction irreductible','PGCD','simplification'],14,3),
('college','6eme','mathematiques',4,'Les multiples et diviseurs',
 ARRAY['Identifier les multiples et diviseurs','Appliquer les criteres de divisibilite','Determiner le PGCD et le PPCM'],
 ARRAY['multiple','diviseur','criteres de divisibilite','PGCD','PPCM','nombres premiers'],10,4),
('college','6eme','mathematiques',5,'Figures geometriques planes',
 ARRAY['Reconnaitre et construire des figures planes','Calculer perimetres et aires','Utiliser les instruments de geometrie'],
 ARRAY['triangle','quadrilatere','cercle','perimetre','aire','axe de symetrie'],16,5),
('college','6eme','mathematiques',6,'Angles et droites',
 ARRAY['Identifier et mesurer des angles','Reconnaitre droites paralleles et perpendiculaires','Construire des figures avec regle et rapporteur'],
 ARRAY['angle','degre','rapporteur','droites paralleles','droites perpendiculaires','bissectrice'],8,6),
('college','6eme','mathematiques',7,'Introduction aux statistiques',
 ARRAY['Recueillir et organiser des donnees','Calculer la moyenne','Lire et construire un tableau de donnees'],
 ARRAY['effectif','frequence','moyenne','tableau statistique'],6,7);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','6eme','francais',1,'Le nom et le groupe nominal',
 ARRAY['Identifier les noms communs et propres','Analyser la structure du GN','Accorder le determinant et adjectif avec le nom'],
 ARRAY['nom commun','nom propre','determinant','adjectif qualificatif','GN','accord'],8,1),
('college','6eme','francais',2,'Le verbe et la conjugaison au present',
 ARRAY['Identifier le verbe dans la phrase','Conjuguer les verbes du 1er et 2e groupe au present','Conjuguer les auxiliaires etre et avoir'],
 ARRAY['infinitif','radical','terminaison','groupe','auxiliaire','present de l indicatif'],10,2),
('college','6eme','francais',3,'La phrase et ses types',
 ARRAY['Identifier les types de phrases','Transformer des phrases','Ponctuer correctement'],
 ARRAY['phrase declarative','interrogative','exclamative','imperative','ponctuation'],6,3),
('college','6eme','francais',4,'Lecture et comprehension - texte narratif',
 ARRAY['Lire et comprendre un texte narratif','Identifier les elements du recit','Distinguer narrateur et personnages'],
 ARRAY['texte narratif','narrateur','personnage','cadre spatio-temporel','schema narratif'],10,4),
('college','6eme','francais',5,'Le passe compose et l imparfait',
 ARRAY['Conjuguer au passe compose','Conjuguer a l imparfait','Distinguer et employer les deux temps dans un recit'],
 ARRAY['passe compose','imparfait','auxiliaire','participe passe','accord','valeurs des temps'],10,5),
('college','6eme','francais',6,'La description - texte descriptif',
 ARRAY['Identifier les caracteristiques du texte descriptif','Enrichir une description avec des adjectifs','Produire un texte descriptif'],
 ARRAY['adjectif qualificatif','champ lexical','comparaison','metaphore','point de vue'],8,6),
('college','6eme','francais',7,'Production ecrite - le recit',
 ARRAY['Planifier et rediger un recit court','Respecter la structure narrative','Soigner la coherence et l orthographe'],
 ARRAY['situation initiale','element perturbateur','peripeties','denouement','situation finale'],8,7);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','6eme','svt',1,'La cellule, unite du vivant',
 ARRAY['Decrire l organisation cellulaire','Distinguer cellule animale et vegetale','Realiser une observation microscopique'],
 ARRAY['cellule','membrane','noyau','cytoplasme','chloroplaste','vacuole','microscope'],8,1),
('college','6eme','svt',2,'La nutrition des plantes vertes',
 ARRAY['Expliquer la photosynthese','Identifier les besoins mineraux des plantes','Decrire l absorption racinaire'],
 ARRAY['photosynthese','chlorophylle','CO2','eau','lumiere','mineraux','absorption'],10,2),
('college','6eme','svt',3,'La digestion',
 ARRAY['Decrire le trajet des aliments','Expliquer la digestion mecanique et chimique','Identifier les nutriments absorbes'],
 ARRAY['tube digestif','enzymes','absorption','nutriments','villosites intestinales'],10,3),
('college','6eme','svt',4,'La respiration',
 ARRAY['Expliquer les echanges gazeux respiratoires','Decrire les organes respiratoires','Comparer la respiration au repos et a l effort'],
 ARRAY['oxygene','dioxyde de carbone','poumons','alveoles','frequence respiratoire'],8,4),
('college','6eme','svt',5,'La circulation sanguine',
 ARRAY['Decrire le trajet du sang','Identifier les composants du sang','Comprendre le role du coeur'],
 ARRAY['coeur','arteres','veines','capillaires','globules rouges','plasma','frequence cardiaque'],8,5),
('college','6eme','svt',6,'La reproduction des etres vivants',
 ARRAY['Distinguer reproduction sexuee et asexuee','Decrire la reproduction des plantes a fleurs','Comparer differents modes de reproduction'],
 ARRAY['fleur','pollinisation','fecondation','graine','fruit','bouturage','marcottage'],8,6);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','6eme','histoire-geo',1,'La Prehistoire',
 ARRAY['Situer la prehistoire dans la chronologie','Decrire les modes de vie des premiers hommes','Expliquer la revolution neolithique'],
 ARRAY['Homo sapiens','Paleolithique','Neolithique','sedentarisation','agriculture','elevage'],8,1),
('college','6eme','histoire-geo',2,'Les premieres civilisations - Mesopotamie et Egypte',
 ARRAY['Identifier les caracteristiques des premieres civilisations','Comprendre l organisation sociale de l Egypte','Decrire les grandes realisations architecturales'],
 ARRAY['pharaon','pyramide','hieroglyphes','Nil','empire','cite-etat','ecriture cuneiforme'],10,2),
('college','6eme','histoire-geo',3,'La Grece antique',
 ARRAY['Decrire l organisation de la cite grecque','Comprendre la democratie athenienne','Identifier les apports culturels de la Grece'],
 ARRAY['cite','democratie','agora','Acropole','Jeux olympiques','philosophie'],8,3),
('college','6eme','histoire-geo',4,'La Cote d Ivoire - relief et hydrographie',
 ARRAY['Decrire le relief ivoirien','Localiser les principaux fleuves et cours d eau','Lire une carte topographique simple'],
 ARRAY['relief','plateau','montagne','Comoe','Bandama','Sassandra','N zi','courbe de niveau'],6,4),
('college','6eme','histoire-geo',5,'Le climat et la vegetation en Cote d Ivoire',
 ARRAY['Identifier les types de climat en Cote d Ivoire','Decrire les zones de vegetation','Etablir les relations climat-vegetation'],
 ARRAY['climat equatorial','climat tropical','foret dense','savane','saison seche','saison des pluies'],8,5),
('college','6eme','histoire-geo',6,'La population ivoirienne',
 ARRAY['Analyser la repartition de la population','Identifier les grands groupes ethniques','Comprendre les migrations internes'],
 ARRAY['densite','migration','groupe ethnique','Akan','Mande','Gur','Krou','repartition'],6,6);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','6eme','anglais',1,'Greetings and introductions',
 ARRAY['Se presenter en anglais','Saluer et prendre conge','Demander et donner des informations personnelles'],
 ARRAY['greetings','personal information','to be','subject pronouns','possessive adjectives'],8,1),
('college','6eme','anglais',2,'Family and daily life',
 ARRAY['Decrire sa famille','Parler de sa routine quotidienne','Utiliser le present simple'],
 ARRAY['family members','present simple','adverbs of frequency','telling time','daily routine'],8,2),
('college','6eme','anglais',3,'School and classroom',
 ARRAY['Nommer les objets de la classe','Decrire l ecole','Utiliser there is / there are'],
 ARRAY['classroom objects','there is/are','prepositions of place','school subjects','imperatives'],8,3),
('college','6eme','anglais',4,'Food and health',
 ARRAY['Nommer les aliments','Exprimer ses gouts','Parler d habitudes alimentaires'],
 ARRAY['countable/uncountable','like/dislike','some/any','food vocabulary','healthy eating'],8,4);

-- ============================================================
-- COLLEGE 5EME
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','5eme','mathematiques',1,'Les nombres relatifs',
 ARRAY['Comprendre la notion de nombre relatif','Situer les relatifs sur une droite graduee','Additionner et soustraire des relatifs'],
 ARRAY['nombre relatif','positif','negatif','valeur absolue','droite graduee','oppose'],10,1),
('college','5eme','mathematiques',2,'La proportionnalite',
 ARRAY['Reconnaitre une situation de proportionnalite','Utiliser le coefficient de proportionnalite','Resoudre des problemes de pourcentages'],
 ARRAY['proportionnalite','coefficient','quatrieme proportionnelle','pourcentage','echelle'],12,2),
('college','5eme','mathematiques',3,'Les fractions - operations',
 ARRAY['Multiplier et diviser des fractions','Additionner des fractions de denominateurs differents','Resoudre des problemes avec des fractions'],
 ARRAY['multiplication','division','PPCM','denominateur commun','fraction complexe'],14,3),
('college','5eme','mathematiques',4,'Triangles - proprietes et construction',
 ARRAY['Construire un triangle connaissant ses elements','Utiliser les proprietes des triangles particuliers','Calculer le perimetre et l aire'],
 ARRAY['triangle equilateral','isocele','rectangle','hauteur','mediane','mediatrice','inegalite triangulaire'],12,4),
('college','5eme','mathematiques',5,'Parallelogrammes et quadrilateres',
 ARRAY['Reconnaitre et construire des quadrilateres','Calculer les aires des quadrilateres','Demontrer des proprietes des parallelogrammes'],
 ARRAY['parallelogramme','rectangle','losange','carre','trapeze','aire','diagonale'],10,5),
('college','5eme','mathematiques',6,'Le cercle et le disque',
 ARRAY['Calculer le perimetre du cercle','Calculer l aire du disque','Resoudre des problemes faisant intervenir les cercles'],
 ARRAY['cercle','disque','rayon','diametre','pi','perimetre','aire','arc'],8,6);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','5eme','svt',1,'La nutrition chez les animaux',
 ARRAY['Comparer les regimes alimentaires','Decrire la chaine alimentaire','Expliquer le bilan energetique'],
 ARRAY['herbivore','carnivore','omnivore','chaine alimentaire','reseau trophique','energie'],8,1),
('college','5eme','svt',2,'La reproduction sexuee chez les animaux',
 ARRAY['Decrire la reproduction chez les vertebres','Comparer oviparite et viviparite','Expliquer la fecondation'],
 ARRAY['ovipare','vivipare','fecondation interne','externe','gametes','embryon','developpement'],10,2),
('college','5eme','svt',3,'La geologie - roches et mineraux',
 ARRAY['Identifier les types de roches','Decrire le cycle des roches','Comprendre la formation des fossiles'],
 ARRAY['roche magmatique','sedimentaire','metamorphique','mineral','fossile','erosion','sedimentation'],10,3),
('college','5eme','svt',4,'L ecosysteme et l environnement',
 ARRAY['Definir un ecosysteme','Decrire les relations entre etres vivants','Identifier les perturbations humaines'],
 ARRAY['ecosysteme','biocenose','biotope','biodiversite','equilibre','pollution','deforestation'],8,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','5eme','histoire-geo',1,'L Afrique precoloniale',
 ARRAY['Identifier les grands empires africains','Decrire l organisation sociale et politique','Situer les empires sur une carte'],
 ARRAY['empire du Mali','Ghana','Songhai','Oyo','traite negriere','or','sel'],10,1),
('college','5eme','histoire-geo',2,'La traite negriere et l esclavage',
 ARRAY['Comprendre les mecanismes de la traite','Analyser les consequences pour l Afrique','Identifier les resistances'],
 ARRAY['traite atlantique','esclavage','triangulaire','plantation','resistance','abolition'],10,2),
('college','5eme','histoire-geo',3,'La colonisation de l Afrique',
 ARRAY['Decrire le partage colonial de l Afrique','Analyser les methodes de colonisation','Identifier les consequences economiques'],
 ARRAY['colonisation','conference de Berlin','administration directe','indirecte','resistance','exploitation'],10,3),
('college','5eme','histoire-geo',4,'L Afrique - milieux et ressources naturelles',
 ARRAY['Identifier les grands milieux africains','Localiser les principales ressources','Analyser l exploitation des ressources'],
 ARRAY['desert','savane','foret equatoriale','ressources minieres','petrole','agriculture'],8,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','5eme','physique',1,'La matiere et ses etats',
 ARRAY['Identifier les etats de la matiere','Decrire les changements d etat','Interpreter les changements a l echelle microscopique'],
 ARRAY['solide','liquide','gazeux','fusion','vaporisation','solidification','condensation','sublimation'],10,1),
('college','5eme','physique',2,'Les melanges et la dissolution',
 ARRAY['Distinguer corps pur et melange','Realiser des dissolutions','Separer les constituants d un melange'],
 ARRAY['corps pur','melange homogene','heterogene','solvant','solute','filtration','decantation','distillation'],10,2),
('college','5eme','physique',3,'Les forces',
 ARRAY['Definir une force et ses caracteristiques','Distinguer forces de contact et a distance','Utiliser un dynamometre'],
 ARRAY['force','newton','dynamometre','gravite','poids','masse','reaction','frottement'],8,3);

-- ============================================================
-- COLLEGE 4EME
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','4eme','mathematiques',1,'Les nombres relatifs - multiplication et division',
 ARRAY['Multiplier et diviser des relatifs','Appliquer les regles des signes','Resoudre des equations simples avec relatifs'],
 ARRAY['regle des signes','produit','quotient','relatif','equation','inconnue'],10,1),
('college','4eme','mathematiques',2,'Calcul litteral',
 ARRAY['Developper et factoriser des expressions','Reduire des expressions algebriques','Substituer des valeurs numeriques'],
 ARRAY['expression algebrique','developpement','factorisation','distributivite','identites remarquables'],12,2),
('college','4eme','mathematiques',3,'Equations du premier degre',
 ARRAY['Resoudre des equations du premier degre','Traduire un probleme en equation','Verifier la solution'],
 ARRAY['equation','inconnue','membre','solution','transposition','verification'],12,3),
('college','4eme','mathematiques',4,'Le theoreme de Thales',
 ARRAY['Enoncer et appliquer le theoreme de Thales','Calculer des longueurs par proportionnalite','Utiliser la reciproque'],
 ARRAY['Thales','droites paralleles','rapport','proportionnalite','reciproque','configuration'],14,4),
('college','4eme','mathematiques',5,'Trigonometrie dans le triangle rectangle',
 ARRAY['Definir sinus, cosinus et tangente','Calculer des angles et des longueurs','Resoudre des problemes concrets'],
 ARRAY['sinus','cosinus','tangente','hypotenuse','angle','triangle rectangle','calculatrice'],12,5),
('college','4eme','mathematiques',6,'Statistiques et probabilites - introduction',
 ARRAY['Calculer mediane et etendue','Construire des diagrammes','Comprendre la notion de probabilite'],
 ARRAY['mediane','etendue','diagramme','frequence','probabilite','experience aleatoire'],8,6);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','4eme','francais',1,'Le roman - lecture et analyse',
 ARRAY['Identifier les caracteristiques du roman','Analyser un extrait romanesque','Etudier les personnages et le narrateur'],
 ARRAY['roman','narrateur','point de vue','personnage','intrigue','incipit','excipit'],10,1),
('college','4eme','francais',2,'La subordonnee relative',
 ARRAY['Identifier et construire des propositions relatives','Utiliser correctement les pronoms relatifs','Enrichir le style par les relatives'],
 ARRAY['proposition relative','antecedent','pronom relatif','qui','que','dont','ou','lequel'],8,2),
('college','4eme','francais',3,'Le discours direct et indirect',
 ARRAY['Transformer discours direct en indirect','Appliquer les changements de temps et de personnes','Utiliser les verbes introducteurs'],
 ARRAY['discours direct','indirect','verbe introducteur','concordance des temps','guillemets'],8,3),
('college','4eme','francais',4,'Le texte argumentatif',
 ARRAY['Identifier la these et les arguments','Reperer les connecteurs logiques','Produire un texte argumentatif simple'],
 ARRAY['these','argument','exemple','connecteur logique','opposition','concession'],10,4),
('college','4eme','francais',5,'La poesie',
 ARRAY['Identifier les formes poetiques','Analyser les figures de style','Produire un poeme'],
 ARRAY['vers','rime','strophe','sonnet','metaphore','personnification','alliteration'],8,5);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','4eme','svt',1,'La genetique - heredite',
 ARRAY['Definir les notions de gene et d allele','Comprendre la transmission hereditaire','Construire un tableau de croisement'],
 ARRAY['gene','allele','chromosomes','ADN','dominant','recessif','phenotype','genotype'],12,1),
('college','4eme','svt',2,'La microbiologie et les maladies infectieuses',
 ARRAY['Identifier les agents pathogenes','Decrire les mecanismes de defense de l organisme','Comprendre le role des vaccins'],
 ARRAY['bacterie','virus','parasite','anticorps','lymphocyte','vaccination','immunite'],10,2),
('college','4eme','svt',3,'La sexualite et la reproduction humaine',
 ARRAY['Decrire l appareil reproducteur','Expliquer la fecondation et le developpement embryonnaire','Aborder la contraception et les IST'],
 ARRAY['gametes','fecondation','embryon','foetus','contraception','IST','puberte'],10,3);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','4eme','physique',1,'La lumiere - propagation et reflexion',
 ARRAY['Decrire la propagation rectiligne de la lumiere','Expliquer la reflexion et la refraction','Construire des schemas optiques'],
 ARRAY['rayon lumineux','reflexion','refraction','miroir','lentille','ombre','penombre'],10,1),
('college','4eme','physique',2,'L electricite - circuit et loi d Ohm',
 ARRAY['Analyser un circuit electrique','Mesurer tension et intensite','Appliquer la loi d Ohm'],
 ARRAY['circuit','resistance','tension','intensite','loi Ohm','voltmetre','amperemetre'],12,2),
('college','4eme','physique',3,'Les atomes et les molecules',
 ARRAY['Decrire le modele atomique simplifie','Distinguer atome et molecule','Ecrire des formules moleculaires'],
 ARRAY['atome','molecule','proton','neutron','electron','formule chimique','liaison covalente'],10,3),
('college','4eme','physique',4,'Les reactions chimiques',
 ARRAY['Identifier les reactifs et produits','Ecrire et equilibrer une equation chimique','Appliquer la loi de conservation de la masse'],
 ARRAY['reactif','produit','equation chimique','conservation','combustion','oxydation'],10,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','4eme','histoire-geo',1,'La Revolution francaise',
 ARRAY['Identifier les causes de la Revolution','Analyser les etapes revolutionnaires','Comprendre la Declaration des droits de l homme'],
 ARRAY['Revolution','Tiers Etat','droits de l homme','Assemblee nationale','Terreur','Republique'],10,1),
('college','4eme','histoire-geo',2,'L Afrique de l Ouest - organisation economique',
 ARRAY['Identifier les activites economiques dominantes','Analyser les echanges commerciaux regionaux','Comprendre le role de la CEDEAO'],
 ARRAY['agriculture','exportation','CEDEAO','commerce regional','industrie','artisanat'],8,2);

-- ============================================================
-- COLLEGE 3EME
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','3eme','mathematiques',1,'Les puissances et notation scientifique',
 ARRAY['Calculer avec des puissances entieres','Utiliser la notation scientifique','Convertir des unites'],
 ARRAY['puissance','exposant','notation scientifique','ordre de grandeur','conversion'],10,1),
('college','3eme','mathematiques',2,'Racines carrees',
 ARRAY['Definir la racine carree','Simplifier des expressions avec racines','Calculer des expressions numeriques'],
 ARRAY['racine carree','nombre irrationnel','simplification','produit de racines'],8,2),
('college','3eme','mathematiques',3,'Identites remarquables et factorisation',
 ARRAY['Developper en utilisant les identites remarquables','Factoriser des expressions polynomiales','Resoudre des equations par factorisation'],
 ARRAY['identites remarquables','carre d une somme','carre d une difference','produit nul','factorisation','polynome'],12,3),
('college','3eme','mathematiques',4,'Equations du premier degre et inequations',
 ARRAY['Resoudre des equations du 1er degre','Traduire un probleme en equation','Resoudre des inequations'],
 ARRAY['equation','inconnue','solution','inequation','intervalle','resolution'],12,4),
('college','3eme','mathematiques',5,'Theoreme de Pythagore et reciproque',
 ARRAY['Appliquer le theoreme de Pythagore','Utiliser la reciproque','Resoudre des problemes geometriques'],
 ARRAY['triangle rectangle','hypotenuse','Pythagore','reciproque','contraposee'],14,5),
('college','3eme','mathematiques',6,'Fonctions lineaires et affines',
 ARRAY['Definir et representer une fonction affine','Determiner l equation d une droite','Lire graphiquement les proprietes'],
 ARRAY['fonction affine','coefficient directeur','ordonnee a l origine','graphique','tableau de valeurs'],12,6),
('college','3eme','mathematiques',7,'Statistiques - dispersion et representations',
 ARRAY['Calculer moyenne, mediane, etendue','Construire des diagrammes statistiques','Interpreter des donnees statistiques'],
 ARRAY['moyenne','mediane','etendue','histogramme','diagramme circulaire','interpretation'],8,7);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','3eme','francais',1,'Le texte argumentatif - these et strategies',
 ARRAY['Analyser la structure d un texte argumentatif','Identifier les procedes rhetoriques','Produire un texte argumentatif structure'],
 ARRAY['these','antithese','synthese','argument d autorite','exemple','concession','connecteurs'],12,1),
('college','3eme','francais',2,'La subordonnee circonstancielle',
 ARRAY['Identifier les subordonnees circonstancielles','Employer correctement les conjonctions de subordination','Analyser les relations logiques'],
 ARRAY['cause','consequence','but','concession','condition','temps','subordonnee'],10,2),
('college','3eme','francais',3,'Le theatre - lecture et analyse',
 ARRAY['Identifier les caracteristiques du texte theatral','Analyser une scene','Comprendre les enjeux dramatiques'],
 ARRAY['acte','scene','didascalie','replique','tirade','monologue','comedie','tragedie'],10,3),
('college','3eme','francais',4,'Preparation au BEPC - comprehension et expression',
 ARRAY['Maitriser les techniques de lecture de texte','Repondre avec methode aux questions','Rediger une expression ecrite organisee'],
 ARRAY['BEPC','plan','introduction','developpement','conclusion','paraphrase','analyse'],12,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','3eme','physique',1,'Les etats de la matiere et changements d etat',
 ARRAY['Identifier les etats de la matiere','Decrire les changements d etat a l echelle microscopique','Interpreter des courbes de chauffage'],
 ARRAY['solide','liquide','gazeux','fusion','vaporisation','courbe de chauffage','palier'],10,1),
('college','3eme','physique',2,'L electricite - lois des circuits',
 ARRAY['Analyser les circuits en serie et en derivation','Appliquer les lois de Kirchhoff','Calculer des resistances equivalentes'],
 ARRAY['serie','derivation','loi des noeuds','loi des mailles','resistance equivalente','puissance'],14,2),
('college','3eme','physique',3,'La chimie des solutions',
 ARRAY['Preparer une solution de concentration donnee','Realiser une dilution','Identifier les acides et les bases'],
 ARRAY['concentration massique','molaire','dilution','facteur','pH','acide','base','neutralisation'],12,3),
('college','3eme','physique',4,'Les ondes et le son',
 ARRAY['Decrire les caracteristiques d une onde sonore','Calculer la frequence et la longueur d onde','Expliquer la propagation du son'],
 ARRAY['onde','frequence','longueur d onde','amplitude','son','vitesse de propagation','ultrason'],8,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','3eme','svt',1,'La genetique et l heredite humaine',
 ARRAY['Expliquer la transmission des caracteres','Analyser des arbres genealogiques','Comprendre les anomalies chromosomiques'],
 ARRAY['chromosomes','gene','allele','caryotype','heredite','arbre genealogique','trisomie'],12,1),
('college','3eme','svt',2,'La sante et l hygiene',
 ARRAY['Identifier les facteurs de risque','Comprendre le fonctionnement du systeme immunitaire','Promouvoir des comportements sains'],
 ARRAY['systeme immunitaire','vaccination','VIH SIDA','paludisme','prevention','hygiene'],10,2),
('college','3eme','svt',3,'La geologie et l histoire de la Terre',
 ARRAY['Comprendre la tectonique des plaques','Expliquer la formation des roches','Situer l age de la Terre'],
 ARRAY['plaque tectonique','seisme','volcanisme','erosion','fossilisation','ere geologique'],10,3);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','3eme','histoire-geo',1,'Les independances africaines',
 ARRAY['Identifier les causes des mouvements d independance','Analyser les etapes des independances','Comprendre les figures emblematiques'],
 ARRAY['independance','nationalisme','Houphouet-Boigny','decolonisation','Bandung','neocolonialisme'],10,1),
('college','3eme','histoire-geo',2,'La Cote d Ivoire independante - economie et politique',
 ARRAY['Decrire le miracle ivoirien','Analyser les crises politiques','Comprendre l organisation institutionnelle'],
 ARRAY['miracle ivoirien','cafe','cacao','crise','reconciliation','institutions','democratie'],10,2),
('college','3eme','histoire-geo',3,'La mondialisation',
 ARRAY['Definir la mondialisation','Identifier ses acteurs','Analyser ses effets positifs et negatifs'],
 ARRAY['mondialisation','FMN','echanges','flux','inegalites','developpement durable'],8,3),
('college','3eme','histoire-geo',4,'Preparation au BEPC - methodes de geographie',
 ARRAY['Lire et analyser une carte','Commenter un document statistique','Rediger une reponse organisee'],
 ARRAY['carte','legende','commentaire','croquis','planisphere','methode BEPC'],8,4);

-- ============================================================
-- LYCEE 2NDE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','2nde','mathematiques',1,'Les ensembles de nombres',
 ARRAY['Distinguer N, Z, Q, R','Utiliser les intervalles','Resoudre des inequations dans R'],
 ARRAY['entiers naturels','relatifs','rationnels','reels','intervalle','valeur absolue','inequation'],10,1),
('lycee','2nde','mathematiques',2,'Fonctions - generalites',
 ARRAY['Definir une fonction et son domaine','Etudier les variations d une fonction','Lire graphiquement les proprietes'],
 ARRAY['fonction','domaine de definition','image','antecedent','tableau de variation','parite'],12,2),
('lycee','2nde','mathematiques',3,'Fonctions de reference',
 ARRAY['Etudier les fonctions carre, racine, inverse','Representer graphiquement','Transformer les courbes'],
 ARRAY['fonction carre','racine carree','inverse','representation graphique','transformation'],10,3),
('lycee','2nde','mathematiques',4,'Equations et inequations du second degre',
 ARRAY['Resoudre ax2+bx+c=0','Utiliser le discriminant','Resoudre des inequations du second degre'],
 ARRAY['trinome','discriminant','racines','signe','factorisation','parabole'],12,4),
('lycee','2nde','mathematiques',5,'Geometrie dans le plan - vecteurs',
 ARRAY['Definir et manipuler des vecteurs','Calculer des coordonnees','Utiliser la colinearite'],
 ARRAY['vecteur','coordonnees','norme','addition','colinearite','parallelisme','milieu'],12,5),
('lycee','2nde','mathematiques',6,'Statistiques - series statistiques',
 ARRAY['Calculer les parametres de position et de dispersion','Construire des representations graphiques','Interpreter des donnees'],
 ARRAY['moyenne','mediane','quartile','variance','ecart-type','boite a moustaches'],8,6);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','2nde','physique',1,'La mesure et les unites',
 ARRAY['Utiliser les unites SI','Effectuer des conversions','Analyser les incertitudes de mesure'],
 ARRAY['SI','unites','conversion','incertitude','chiffres significatifs','notation scientifique'],8,1),
('lycee','2nde','physique',2,'La mecanique - cinematique',
 ARRAY['Decrire le mouvement d un point','Calculer vitesse et acceleration','Analyser des trajectoires'],
 ARRAY['referentiel','trajectoire','vitesse','acceleration','mouvement uniforme','vecteur deplacement'],12,2),
('lycee','2nde','physique',3,'La chimie - constitution de la matiere',
 ARRAY['Decrire la structure de l atome','Utiliser la classification periodique','Definir les liaisons chimiques'],
 ARRAY['proton','neutron','electron','configuration electronique','tableau periodique','liaison ionique','covalente'],12,3),
('lycee','2nde','physique',4,'Les solutions aqueuses',
 ARRAY['Preparer et diluer des solutions','Calculer la concentration','Identifier acides et bases'],
 ARRAY['concentration','dilution','pH','acide','base','neutralisation','indicateur colore'],10,4),
('lycee','2nde','physique',5,'L optique geometrique',
 ARRAY['Appliquer les lois de la reflexion et de la refraction','Etudier les lentilles convergentes','Construire des images'],
 ARRAY['reflexion','refraction','lentille convergente','foyer','vergence','image reelle','virtuelle'],12,5);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','2nde','francais',1,'Le texte litteraire - genres et formes',
 ARRAY['Identifier les grands genres litteraires','Analyser les caracteristiques formelles','Situer les oeuvres dans leur contexte'],
 ARRAY['genre','roman','poesie','theatre','essai','forme','style','contexte'],10,1),
('lycee','2nde','francais',2,'La narration - roman et nouvelle',
 ARRAY['Analyser le schema narratif','Etudier le point de vue narratif','Caracteriser les personnages'],
 ARRAY['narrateur','focalisation','interne','externe','omnisciente','personnage','incipit'],12,2),
('lycee','2nde','francais',3,'L argumentation - essai et discours',
 ARRAY['Analyser la structure argumentative','Identifier les procedes persuasifs','Produire un texte argumentatif'],
 ARRAY['these','argument','exemple','concession','refutation','ethos','pathos','logos'],12,3),
('lycee','2nde','francais',4,'La poesie - formes et figures',
 ARRAY['Analyser la versification','Etudier les figures de style','Commenter un poeme'],
 ARRAY['metre','rime','strophe','sonnet','alexandrin','anaphore','metaphore','synesthesie'],10,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','2nde','histoire-geo',1,'Le monde au XIXe siecle - industrialisation',
 ARRAY['Analyser la revolution industrielle','Comprendre les transformations sociales','Identifier les puissances dominantes'],
 ARRAY['revolution industrielle','capitalisme','proletariat','bourgeoisie','colonialisme','imperialisme'],12,1),
('lycee','2nde','histoire-geo',2,'L Afrique et le monde au XXe siecle',
 ARRAY['Analyser les deux guerres mondiales','Comprendre la decolonisation','Etudier la Guerre froide'],
 ARRAY['guerre mondiale','Shoah','ONU','decolonisation','Guerre froide','non-alignement'],12,2),
('lycee','2nde','histoire-geo',3,'Les espaces mondiaux - inegalites de developpement',
 ARRAY['Analyser les inegalites Nord-Sud','Identifier les criteres du developpement','Comprendre les IDH'],
 ARRAY['developpement','IDH','Nord','Sud','PMA','mondialisation','pauvrete'],10,3),
('lycee','2nde','histoire-geo',4,'La Cote d Ivoire - geographie economique',
 ARRAY['Analyser les secteurs economiques','Identifier les atouts et contraintes','Comprendre les politiques de developpement'],
 ARRAY['agriculture','industrie','services','exportation','PND','urbanisation','Abidjan'],10,4);

-- ============================================================
-- LYCEE 1ERE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','1ere C','mathematiques',1,'Les suites numeriques',
 ARRAY['Definir une suite arithmetique ou geometrique','Calculer terme general et somme','Etudier la convergence'],
 ARRAY['suite arithmetique','suite geometrique','raison','terme general','somme','convergence','limite'],14,1),
('lycee','1ere C','mathematiques',2,'Fonctions derivees - calcul et applications',
 ARRAY['Calculer des derivees','Etudier les variations d une fonction','Determiner extrema et points d inflexion'],
 ARRAY['derivee','regles de derivation','tableau de variation','extremum','tangente','croissance','decroissance'],16,2),
('lycee','1ere C','mathematiques',3,'Fonctions logarithme et exponentielle',
 ARRAY['Etudier les proprietes de ln et exp','Resoudre des equations logarithmiques','Appliquer a des problemes de croissance'],
 ARRAY['logarithme neperien','exponentielle','proprietes','equation','croissance exponentielle'],14,3),
('lycee','1ere C','mathematiques',4,'Trigonometrie - cercle trigonometrique',
 ARRAY['Definir les fonctions circulaires','Resoudre des equations trigonometriques','Utiliser les formules d addition'],
 ARRAY['cercle trigonometrique','radian','cos','sin','tan','formules d addition','periode'],12,4),
('lycee','1ere C','mathematiques',5,'Geometrie dans l espace',
 ARRAY['Decrire positions relatives de droites et plans','Calculer distances et angles','Etudier les solides de l espace'],
 ARRAY['droite','plan','parallelisme','perpendicularite','distance','angle diedre','solide'],12,5),
('lycee','1ere C','mathematiques',6,'Probabilites - denombrement',
 ARRAY['Appliquer les techniques de denombrement','Calculer des probabilites conditionnelles','Utiliser les lois de probabilite'],
 ARRAY['arrangement','permutation','combinaison','probabilite conditionnelle','independance','Bayes'],10,6);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','1ere C','physique',1,'La dynamique newtonienne',
 ARRAY['Appliquer les lois de Newton','Etudier les mouvements uniformes et acceleres','Resoudre des problemes de dynamique'],
 ARRAY['force','masse','acceleration','inertie','2e loi de Newton','poids','reaction normale'],16,1),
('lycee','1ere C','physique',2,'L energie mecanique',
 ARRAY['Calculer energie cinetique et potentielle','Appliquer le theoreme energie-travail','Etudier la conservation de l energie'],
 ARRAY['energie cinetique','potentielle','travail','puissance','conservation','frottements'],14,2),
('lycee','1ere C','physique',3,'L electricite - courant alternatif',
 ARRAY['Distinguer courant continu et alternatif','Analyser un circuit RC et RL','Calculer la puissance en AC'],
 ARRAY['courant alternatif','tension','frequence','impedance','dephasage','puissance active','reactive'],14,3),
('lycee','1ere C','physique',4,'La thermodynamique',
 ARRAY['Definir les grandeurs thermodynamiques','Appliquer les lois des gaz parfaits','Comprendre les principes de la thermodynamique'],
 ARRAY['temperature','pression','volume','gaz parfait','chaleur','travail','premier principe','entropie'],12,4),
('lycee','1ere C','physique',5,'La chimie organique - introduction',
 ARRAY['Identifier les groupes fonctionnels','Nommer les composes organiques','Ecrire des reactions simples'],
 ARRAY['carbone','hydrocarbure','alcool','aldehyde','cetone','acide carboxylique','nomenclature'],12,5);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','1ere D','svt',1,'La cellule et la division cellulaire',
 ARRAY['Decrire l ultrastructure cellulaire','Expliquer la mitose et la meiose','Comprendre le cycle cellulaire'],
 ARRAY['mitose','meiose','chromosomes','ADN','replication','cycle cellulaire','prophase','metaphase'],14,1),
('lycee','1ere D','svt',2,'La genetique moleculaire',
 ARRAY['Decrire la structure de l ADN','Expliquer la replication et la transcription','Comprendre la traduction'],
 ARRAY['ADN','ARN','replication','transcription','traduction','code genetique','proteine','mutation'],14,2),
('lycee','1ere D','svt',3,'L immunologie',
 ARRAY['Decrire les defenses specifiques et non specifiques','Expliquer la reponse immunitaire','Comprendre les vaccins et le VIH'],
 ARRAY['anticorps','lymphocyte B','lymphocyte T','antigene','phagocytose','memoire immunitaire','VIH','SIDA'],12,3),
('lycee','1ere D','svt',4,'La physiologie vegetale',
 ARRAY['Expliquer la photosynthese en detail','Decrire la respiration cellulaire','Analyser les echanges gazeux'],
 ARRAY['photosynthese','chloroplaste','ATP','NADPH','cycle de Calvin','respiration cellulaire','stomates'],12,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','1ere A','philosophie',1,'Introduction a la philosophie',
 ARRAY['Definir la philosophie et ses domaines','Identifier les grandes questions philosophiques','Lire un texte philosophique'],
 ARRAY['philosophie','epistemologie','metaphysique','ethique','esthetique','argumentation','concept'],8,1),
('lycee','1ere A','philosophie',2,'La connaissance et la verite',
 ARRAY['Distinguer opinion, croyance et savoir','Analyser les theories de la connaissance','Comprendre le rationalisme et l empirisme'],
 ARRAY['connaissance','verite','opinion','certitude','rationalisme','empirisme','Descartes','Hume'],12,2),
('lycee','1ere A','philosophie',3,'Le sujet et la conscience',
 ARRAY['Definir la conscience et le sujet','Analyser la notion d identite personnelle','Etudier la relation corps-esprit'],
 ARRAY['conscience','sujet','identite','moi','dualisme','materialisme','Descartes','Locke'],12,3);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','1ere','histoire-geo',1,'Les grandes transformations du monde au XXe siecle',
 ARRAY['Analyser les revolutions politiques','Comprendre les totalitarismes','Etudier la construction europeenne'],
 ARRAY['totalitarisme','fascisme','nazisme','communisme','democratie','ONU','Europe'],12,1),
('lycee','1ere','histoire-geo',2,'L Afrique dans le monde contemporain',
 ARRAY['Analyser la place de l Afrique dans la mondialisation','Identifier les defis du developpement','Comprendre les conflits africains'],
 ARRAY['Union africaine','developpement','pauvrete','conflits','ressources naturelles','aide internationale'],10,2);

-- ============================================================
-- LYCEE TERMINALE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','Terminale','mathematiques',1,'Limites et continuite',
 ARRAY['Calculer des limites de fonctions','Etudier la continuite','Appliquer le theoreme des valeurs intermediaires'],
 ARRAY['limite','continuite','TVI','asymptote','forme indeterminee','regle de l Hopital'],20,1),
('lycee','Terminale','mathematiques',2,'Derivation et applications',
 ARRAY['Calculer des derivees complexes','Etudier les fonctions','Resoudre des problemes d optimisation'],
 ARRAY['derivee','tableau de variation','extremum','optimisation','tangente','convexite','point d inflexion'],18,2),
('lycee','Terminale','mathematiques',3,'Integration',
 ARRAY['Calculer des primitives','Calculer des integrales definies','Appliquer a des calculs d aire'],
 ARRAY['primitive','integrale','theoreme fondamental','integration par parties','substitution','aire'],18,3),
('lycee','Terminale','mathematiques',4,'Suites et recurrence',
 ARRAY['Etudier convergence des suites','Calculer sommes','Appliquer le raisonnement par recurrence'],
 ARRAY['suite','convergence','limite','somme','recurrence','hypothese de recurrence'],16,4),
('lycee','Terminale','mathematiques',5,'Nombres complexes',
 ARRAY['Definir et operer sur les complexes','Representer geometriquement','Resoudre des equations dans C'],
 ARRAY['nombre complexe','partie reelle','imaginaire','module','argument','forme trigonometrique','Moivre'],16,5),
('lycee','Terminale','mathematiques',6,'Probabilites - lois de probabilite',
 ARRAY['Etudier les lois binomiale et normale','Calculer des probabilites','Appliquer l intervalle de confiance'],
 ARRAY['loi binomiale','loi normale','esperance','variance','ecart-type','intervalle de confiance'],14,6);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','Terminale','physique',1,'La mecanique - oscillations',
 ARRAY['Etudier le pendule simple','Analyser les oscillations amorties et forcees','Comprendre la resonance'],
 ARRAY['oscillation','pendule','periode','amplitude','amortissement','resonance','frequence propre'],16,1),
('lycee','Terminale','physique',2,'L electromagnetisme',
 ARRAY['Etudier les champs electrique et magnetique','Appliquer la loi de Faraday','Analyser les transformateurs'],
 ARRAY['champ electrique','magnetique','flux','induction','loi de Faraday','Lenz','transformateur'],16,2),
('lycee','Terminale','physique',3,'La chimie organique avancee',
 ARRAY['Etudier les reactions d esterification et d hydrolyse','Comprendre la stereoisomerie','Appliquer a la biochimie'],
 ARRAY['esterification','hydrolyse','stereoisomere','chiralite','polymere','biomolecule'],14,3),
('lycee','Terminale','physique',4,'La physique nucleaire',
 ARRAY['Decrire la structure du noyau','Comprendre la radioactivite','Calculer l energie de liaison'],
 ARRAY['noyau','proton','neutron','radioactivite','alpha','beta','gamma','demi-vie','energie de liaison'],14,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','Terminale D','svt',1,'La genetique des populations',
 ARRAY['Comprendre la loi de Hardy-Weinberg','Analyser l evolution des populations','Etudier les mecanismes evolutifs'],
 ARRAY['Hardy-Weinberg','frequence allelique','derive genetique','selection naturelle','mutation','speciation'],14,1),
('lycee','Terminale D','svt',2,'La neurophysiologie',
 ARRAY['Decrire le potentiel d action','Expliquer la transmission synaptique','Comprendre les arcs reflexes'],
 ARRAY['neurone','potentiel d action','synapse','neurotransmetteur','arc reflexe','SNC','SNP'],14,2),
('lycee','Terminale D','svt',3,'La regulation hormonale',
 ARRAY['Identifier les glandes endocrines','Expliquer les mecanismes de retrocontrole','Comprendre le cycle menstruel'],
 ARRAY['hormone','hypophyse','hypothalamus','retrocontrole','insuline','glucagon','cycle menstruel'],12,3),
('lycee','Terminale D','svt',4,'La geologie - tectonique des plaques',
 ARRAY['Expliquer la theorie des plaques','Analyser les phenomenes geologiques','Comprendre la formation des reliefs'],
 ARRAY['plaque lithospherique','subduction','dorsale','rifting','seisme','volcanisme','Wegener'],14,4),
('lycee','Terminale D','svt',5,'L ecologie et l environnement',
 ARRAY['Analyser les cycles biogeochimiques','Comprendre le rechauffement climatique','Proposer des solutions durables'],
 ARRAY['cycle du carbone','azote','effet de serre','biodiversite','developpement durable','COP'],10,5);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','Terminale A','philosophie',1,'La conscience et l inconscient',
 ARRAY['Definir la conscience','Analyser la notion d inconscient freudien','Evaluer la portee de la psychanalyse'],
 ARRAY['conscience','inconscient','Freud','psychanalyse','moi','surmoi','ca','refoulement'],12,1),
('lycee','Terminale A','philosophie',2,'La liberte et la responsabilite',
 ARRAY['Definir la liberte','Articuler liberte et determinisme','Analyser la responsabilite morale'],
 ARRAY['liberte','determinisme','libre arbitre','responsabilite','Sartre','Kant','compatibilisme'],12,2),
('lycee','Terminale A','philosophie',3,'L Etat et la politique',
 ARRAY['Definir l Etat et la legitimite du pouvoir','Analyser les formes de gouvernement','Comprendre le contrat social'],
 ARRAY['Etat','souverainete','democratie','contrat social','Rousseau','Hobbes','Locke','legitimite'],12,3),
('lycee','Terminale A','philosophie',4,'La verite et la science',
 ARRAY['Distinguer verite et certitude','Analyser la demarche scientifique','Comprendre les limites de la science'],
 ARRAY['verite','science','epistemologie','Popper','falsifiabilite','paradigme','Kuhn'],12,4),
('lycee','Terminale A','philosophie',5,'Le bonheur et la morale',
 ARRAY['Definir le bonheur selon les courants','Analyser les theories morales','Articuler bonheur et vertu'],
 ARRAY['bonheur','eudemonisme','hedonisme','stoicisme','utilitarisme','devoir','Aristote','Epicure'],12,5),
('lycee','Terminale A','philosophie',6,'Preparation au BAC - dissertation et explication',
 ARRAY['Maitriser la methode de la dissertation','Expliquer un texte philosophique','Gerer le temps en examen'],
 ARRAY['dissertation','plan','problematique','these','explication de texte','methode BAC'],14,6);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('lycee','Terminale','histoire-geo',1,'Le monde depuis 1945 - ordre et desordres',
 ARRAY['Analyser la bipolarisation','Comprendre la fin de la Guerre froide','Etudier le nouvel ordre mondial'],
 ARRAY['Guerre froide','bipolaire','URSS','USA','ONU','detente','multipolaire'],14,1),
('lycee','Terminale','histoire-geo',2,'L Afrique dans les relations internationales',
 ARRAY['Analyser la place de l Afrique dans la geopolitique mondiale','Comprendre les enjeux du developpement','Etudier les organisations regionales'],
 ARRAY['Union africaine','CEDEAO','UEMOA','developpement','aide','cooperation','conflits'],12,2),
('lycee','Terminale','histoire-geo',3,'La Cote d Ivoire - enjeux et perspectives',
 ARRAY['Analyser le bilan economique et social','Comprendre les defis actuels','Etudier les orientations strategiques'],
 ARRAY['PND','emergence 2030','developpement','urbanisation','pauvrete','gouvernance','diaspora'],12,3),
('lycee','Terminale','histoire-geo',4,'Preparation au BAC - methodes',
 ARRAY['Maitriser la composition en histoire','Realiser un croquis geographique','Analyser un dossier documentaire'],
 ARRAY['composition','plan','croquis','legende','dossier documentaire','methode BAC'],10,4);

