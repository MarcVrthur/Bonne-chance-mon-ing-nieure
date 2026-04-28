import { BookOpen, CheckCircle, Edit3, GraduationCap, Plus, Search, Trash2, X, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useMemo } from 'react';

// --- Types ---
interface Question {
  id: string;
  themeId: string;
  text: string;
  answer: string;
  isCustom?: boolean;
}

interface Theme {
  id: string;
  title: string;
  icon: React.ReactNode;
}

// --- Data ---
const THEMES: Theme[] = [
  { id: '1', title: '1. Introduction à la phytopathologie', icon: <GraduationCap className="w-5 h-5" /> },
  { id: '2', title: '2. Le Triangle de la Maladie', icon: <RotateCcw className="w-5 h-5" /> },
  { id: '3', title: '3. Catégories de maladies', icon: <BookOpen className="w-5 h-5" /> },
  { id: '4', title: '4. Les Postulats de Koch', icon: <CheckCircle className="w-5 h-5" /> },
  { id: '5', title: '5. Définitions (Parasite, pathogène...)', icon: <BookOpen className="w-5 h-5" /> },
  { id: '6', title: '6. Le Cycle de la Maladie', icon: <RotateCcw className="w-5 h-5" /> },
  { id: '7', title: '7. Attaque des pathogènes', icon: <X className="w-5 h-5" /> },
  { id: '8', title: '8. Symptomatologie', icon: <Search className="w-5 h-5" /> },
  { id: '9', title: '9. Phytobactériologie', icon: <BookOpen className="w-5 h-5" /> },
  { id: '10', title: '10. Phytomycologie (Classification)', icon: <BookOpen className="w-5 h-5" /> },
  { id: '11', title: '11. Maladies fongiques spécifiques', icon: <BookOpen className="w-5 h-5" /> },
  { id: '12', title: '12. Nématodes', icon: <BookOpen className="w-5 h-5" /> },
  { id: '13', title: '13. Plantes Parasites', icon: <BookOpen className="w-5 h-5" /> },
  { id: '14', title: '14. Phytovirologie', icon: <BookOpen className="w-5 h-5" /> },
  { id: '15', title: '15. Épidémiologie et gestion', icon: <BookOpen className="w-5 h-5" /> },
  { id: '16', title: '16. Malherbologie', icon: <BookOpen className="w-5 h-5" /> },
];

const INITIAL_QUESTIONS: Question[] = [
  // Thème 1
  { id: 'q1-1', themeId: '1', text: "Définition de la phytopathologie au sens large ?", answer: "C'est la science qui étudie les maladies des plantes." },
  { id: 'q1-2', themeId: '1', text: "Quels sont les 4 objets d'étude principaux de cette science ?", answer: "L'étiologie (causes), la symptomatologie (symptômes), l'analyse des interactions hôte-parasite, et l'épidémiologie (évolution dans le temps/espace)." },
  { id: 'q1-3', themeId: '1', text: "Définition agronomique d'une 'maladie végétale' ?", answer: "Toute anomalie d'une plante, de ses parties ou produits, qui réduit sa valeur économique ou esthétique." },
  { id: 'q1-4', themeId: '1', text: "Pourcentage estimé des pertes de cultures mondiales ?", answer: "Environ 36,5% des cultures." },
  { id: 'q1-5', themeId: '1', text: "Père de la phytopathologie moderne et sa découverte ?", answer: "Anton de Bary, pour avoir prouvé de manière décisive que l'oomycète P. infestans a causé la maladie du mildiou." },
  { id: 'q1-6', themeId: '1', text: "Maladie historique de la famine irlandaise (1840) ?", answer: "Le mildiou de la pomme de terre." },
  { id: 'q1-7', themeId: '1', text: "Qui a proposé la théorie des germes en 1807 ?", answer: "Prévost: les causes des maladies sont des spores fongiques microscopiques infectant la plante." },
  { id: 'q1-8', themeId: '1', text: "Impact sociétal de l'ergot du seigle au Moyen-Âge ?", answer: "La consommation de seigle infecté causait le 'Mal ardent' ou 'feu de saint Antoine', provoquant hallucinations, gangrènes et pertes de membres." },
  { id: 'q1-9', themeId: '1', text: "Différence entre approche fondamentale et appliquée ?", answer: "L'approche fondamentale étudie les causes et mécanismes; l'approche appliquée identifie les techniques de lutte, le diagnostic et la prévention." },
  { id: 'q1-10', themeId: '1', text: "Pourquoi les pratiques modernes favorisent-elles les épidémies ?", answer: "Les systèmes de culture dense, les vastes zones de culture et l'uniformité génétique (monoculture) facilitent la propagation." },

  // Thème 2
  { id: 'q2-1', themeId: '2', text: "Les trois composantes obligatoires du triangle de la maladie ?", answer: "Un hôte susceptible, un pathogène virulent, et un environnement conductif (favorable)." },
  { id: 'q2-2', themeId: '2', text: "État de l'hôte pour le développement de la maladie ?", answer: "La plante doit être susceptible (manque de résistance)." },
  { id: 'q2-3', themeId: '2', text: "Qualification du pathogène dans le triangle ?", answer: "L'agent pathogène doit être virulent." },
  { id: 'q2-4', themeId: '2', text: "Pourquoi l'environnement doit-il être 'conductif' ?", answer: "Il doit réunir les conditions propices au développement de la maladie (humidité, T°, etc.)." },
  { id: 'q2-5', themeId: '2', text: "Facteurs environnementaux de la famine irlandaise ?", answer: "Des conditions fraîches et humides prolongées (avec ciel couvert et pluie continue)." },
  { id: 'q2-6', themeId: '2', text: "Effet de la T° sur la pourriture noire des racines du tabac ?", answer: "Elle est plus sévère à des températures plus fraîches (17-23°C) qui sont défavorables à l'hôte mais favorables au pathogène." },
  { id: 'q2-7', themeId: '2', text: "Effet d'une humidité excessive sur Pythium ?", answer: "Les sols très humides favorisent la mobilité et l'infection par les zoospores de Pythium." },
  { id: 'q2-8', themeId: '2', text: "Double rôle du vent ?", answer: "Il transporte les spores sur de l'espace et modifie le taux d'évaporation/séchage." },
  { id: 'q2-9', themeId: '2', text: "Influence du pH ou nutrition azotée ?", answer: "Un pH de sol élevé favorise la pourriture noire du tabac; un azote élevé favorise souvent la susceptibilité." },
  { id: 'q2-10', themeId: '2', text: "Pourquoi ajouter le facteur 'Temps' (pyramide) ?", answer: "Pour refléter la durée pendant laquelle le pathogène, l'hôte et l'environnement interagissent (durée de l'épidémie)." },

  // Thème 3
  { id: 'q3-1', themeId: '3', text: "Grandes catégories basées sur les organes ?", answer: "Racines (pourritures), tiges (chancres, galles), vasculaires (flétrissement), foliaires (chlorose, taches), et fruits." },
  { id: 'q3-2', themeId: '3', text: "Qu'est-ce qu'une 'fonte de semis' ?", answer: "Mort du semis juste avant (pré-émergence) ou juste après (post-émergence) son émergence." },
  { id: 'q3-3', themeId: '3', text: "Différence entre chancre et galle ?", answer: "Chancre = nécrose localisée (mort phloème); Galle = augmentation nombre/taille cellules (hyperplasie/hypertrophie)." },
  { id: 'q3-4', themeId: '3', text: "Définition physiologique d'un flétrissement (wilt) ?", answer: "La transpiration dépasse l'absorption d'eau, causant la perte de turgescence." },
  { id: 'q3-5', themeId: '3', text: "Les 6 catégories basées sur le type de culture ?", answer: "Champ/plantation, maraîchères, fruitiers, essences forestières, gazon, ornementales." },
  { id: 'q3-6', themeId: '3', text: "Les 5 grandes catégories de pathogènes biotiques ?", answer: "Champignons, Procaryotes (bactéries/phytoplasmes), Plantes parasites, Virus/viroïdes, et Nématodes." },
  { id: 'q3-7', themeId: '3', text: "Qu'est-ce qu'un pathogène abiotique ?", answer: "Facteur environnemental non vivant provoquant une maladie non infectieuse." },
  { id: 'q3-8', themeId: '3', text: "Exemples de facteurs abiotiques ?", answer: "Températures extrêmes, humidité inadaptée, déficits nutritionnels, pollution, toxicité pesticides." },
  { id: 'q3-9', themeId: '3', text: "Pourquoi les plantes parasites sont biotiques ?", answer: "Car ce sont des organismes vivants causant des maladies transmissibles." },
  { id: 'q3-10', themeId: '3', text: "Carence minérale = infectieux ou non ?", answer: "Maladie non infectieuse." },

  // Thème 4
  { id: 'q4-1', themeId: '4', text: "But principal des postulats de Koch ?", answer: "Prouver scientifiquement qu'un microorganisme spécifique est responsable d'une maladie." },
  { id: 'q4-2', themeId: '4', text: "Premier postulat (Symptômes) ?", answer: "L'association constante: le micro-organisme doit être présent dans tous les cas de maladie avec les mêmes symptômes." },
  { id: 'q4-3', themeId: '4', text: "Deuxième postulat (Isolement) ?", answer: "Isolement en culture pure: l'agent doit être extrait et cultivé in vitro sur milieu artificiel." },
  { id: 'q4-4', themeId: '4', text: "Troisième postulat (Inoculation) ?", answer: "Inoculation: l'agent cultivé doit reproduire la maladie sur une plante saine." },
  { id: 'q4-5', themeId: '4', text: "Quatrième postulat (Validation) ?", answer: "Ré-isolement: le même agent doit être ré-isolé de la plante inoculée." },
  { id: 'q4-6', themeId: '4', text: "Scientifique et maladie d'origine ?", answer: "Robert Koch, sur l'anthrax du mouton." },
  { id: 'q4-7', themeId: '4', text: "Pourquoi impossible pour virus/phytoplasmes ?", answer: "Car ce sont des parasites obligatoires qu'on ne peut pas cultiver seuls." },
  { id: 'q4-8', themeId: '4', text: "Qu'est-ce qu'un parasite obligatoire ?", answer: "Organisme qui ne peut se développer qu'en association avec un hôte vivant." },
  { id: 'q4-9', themeId: '4', text: "Postulats encore utilisés ?", answer: "Oui, ils sont encore largement utilisés." },
  { id: 'q4-10', themeId: '4', text: "S'il n'y a pas de culture in vitro ?", answer: "Preuve par d'autres données (microscopie, ADN), mais le statut reste techniquement provisoire." },

  // Thème 5
  { id: 'q5-1', themeId: '5', text: "Parasite vs Pathogène ?", answer: "Pathogène = cause de la maladie; Parasite = dépend de l'hôte pour survivre (peut être neutre)." },
  { id: 'q5-2', themeId: '5', text: "Qu'est-ce que le parasitisme ?", answer: "Relation où un organisme tire ses nutriments d'un autre (l'hôte)." },
  { id: 'q5-3', themeId: '5', text: "Mutualisme + exemple ?", answer: "Association à bénéfices réciproques (ex: champignons mycorhiziens)." },
  { id: 'q5-4', themeId: '5', text: "Commensalisme ?", answer: "Un tire profit sans affecter l'autre." },
  { id: 'q5-5', themeId: '5', text: "Parasite obligatoire vs non obligatoire ?", answer: "Obligatoire = uniquement sur hôte vivant; Non obligatoire = peut vivre en saprophyte." },
  { id: 'q5-6', themeId: '5', text: "Saprophyte facultatif ?", answer: "Principalement parasite mais peut vivre sur matière morte si besoin." },
  { id: 'q5-7', themeId: '5', text: "Pathogénicité ?", answer: "Capacité d'interférer avec les fonctions de la plante pour causer une maladie." },
  { id: 'q5-8', themeId: '5', text: "Pathogénicité vs Virulence ?", answer: "Pathogénicité = capacité globale; Virulence = degré de force de cette capacité." },
  { id: 'q5-9', themeId: '5', text: "Spécificité d'hôte ?", answer: "Capacité d'un pathogène à n'attaquer qu'un nombre limité d'espèces." },
  { id: 'q5-10', themeId: '5', text: "Compatible vs Incompatible ?", answer: "Compatible = maladie (hôte sensible); Incompatible = résistance (hôte résistant)." },

  // Thème 6
  { id: 'q6-1', themeId: '6', text: "Les 5 étapes du cycle de la maladie ?", answer: "Inoculation, Pénétration, Colonisation, Dissémination, et Hivernation/dormance." },
  { id: 'q6-2', themeId: '6', text: "Inoculum primaire ?", answer: "Premier contact qui cause l'infection originelle en début de saison." },
  { id: 'q6-3', themeId: '6', text: "Pré-pénétration vs Pénétration ?", answer: "Pré-pénétration = arrivée et attachement; Pénétration = entrée physique dans les tissus." },
  { id: 'q6-4', themeId: '6', text: "Moyens de pénétration physique ?", answer: "Directe (mécanique/enzymes), ouvertures naturelles (stomates), ou blessures." },
  { id: 'q6-5', themeId: '6', text: "Colonisation et incubation ?", answer: "Colonisation = établissement; Incubation = délai entre infection et symptômes visibles." },
  { id: 'q6-6', themeId: '6', text: "Dissémination ?", answer: "Passive (vent, eau) ou active (insectes, homme)." },
  { id: 'q6-7', themeId: '6', text: "Hivernation (Survie) ?", answer: "Dormance avec structures spécialisées pour passer la mauvaise saison." },
  { id: 'q6-8', themeId: '6', text: "Inoculum secondaire ?", answer: "Propagation massive de la maladie durant la même saison (cycles multiples)." },
  { id: 'q6-9', themeId: '6', text: "Appressorium ?", answer: "Structure spécialisée d'infection formée pour percer la paroi cellulaire." },
  { id: 'q6-10', themeId: '6', text: "Chimiotropisme vs Thigmotropisme ?", answer: "Chimiotropisme = guidé par signaux chimiques; Thigmotropisme = guidé par le relief/toucher." },

  // Thème 7
  { id: 'q7-1', themeId: '7', text: "4 grandes armes chimiques des pathogènes ?", answer: "Enzymes, Toxines, Régulateurs de croissance, Polysaccharides (obstruction)." },
  { id: 'q7-2', themeId: '7', text: "Cutinases et cellulases ?", answer: "Cutinases = dégradent la cire; Cellulases = dégradent la paroi cellulaire." },
  { id: 'q7-3', themeId: '7', text: "Pectinases et pourriture molle ?", answer: "Dégradent la pectine (ciment entre cellules), causant la macération." },
  { id: 'q7-4', themeId: '7', text: "Toxine hôte-spécifique (Victorine) ?", answer: "Nocive uniquement pour un cultivar (ex: avoine Victoria)." },
  { id: 'q7-5', themeId: '7', text: "Toxine non-hôte-spécifique (Tabtoxine) ?", answer: "Affecte de nombreuses espèces en bloquant des enzymes vitales (chloroplastes)." },
  { id: 'q7-6', themeId: '7', text: "Excès d'auxine ?", answer: "Provoque élongation et prolifération incontrôlée (galles, tumeurs)." },
  { id: 'q7-7', themeId: '7', text: "Cytokinines ou gibbérellines ?", answer: "Cytokinines = division (galles); Gibbérellines = élongation extrême." },
  { id: 'q7-8', themeId: '7', text: "Interférence transport (Bactéries) ?", answer: "Sécrétion de polysaccharides qui bouchent le xylème (flétrissement)." },
  { id: 'q7-9', themeId: '7', text: "Biotrophe vs Nécrotrophe ?", answer: "Biotrophe = maintient l'hôte vivant; Nécrotrophe = tue les cellules pour manger." },
  { id: 'q7-10', themeId: '7', text: "Stratégie hémibiotrophe ?", answer: "Commence comme biotrophe puis devient nécrotrophe." },

  // Thème 8
  { id: 'q8-1', themeId: '8', text: "Symptôme primaire vs secondaire ?", answer: "Primaire = site d'infection; Secondaire = sur organes développés après l'infection." },
  { id: 'q8-2', themeId: '8', text: "Chlorose ?", answer: "Jaunissement par manque de chlorophylle (carences ou virus)." },
  { id: 'q8-3', themeId: '8', text: "Mosaïque ?", answer: "Alternance de zones claires et foncées sur les feuilles." },
  { id: 'q8-4', themeId: '8', text: "Anthocyanose et mélanose ?", answer: "Anthocyanose = excès rouge/violet; Mélanose = taches noires." },
  { id: 'q8-5', themeId: '8', text: "Définition d'une nécrose ?", answer: "Mort localisée des cellules et tissus (brunissement)." },
  { id: 'q8-6', themeId: '8', text: "Balai de sorcière ?", answer: "Prolifération anormale de rameaux serrés." },
  { id: 'q8-7', themeId: '8', text: "Virescence ?", answer: "Pièces florales qui restent vertes." },
  { id: 'q8-8', themeId: '8', text: "Chloranthie ?", answer: "Transformation des fleurs en feuilles." },
  { id: 'q8-9', themeId: '8', text: "Nanisme ?", answer: "Réduction de taille (souvent par perturbations hormonales)." },
  { id: 'q8-10', themeId: '8', text: "Thyllose ?", answer: "Bouchon vésiculeux dans le xylème pour freiner un pathogène." },

  // Thème 9
  { id: 'q9-1', themeId: '9', text: "Cellules bactériennes ?", answer: "Procaryotes unicellulaires, chromosome unique + plasmides, sans noyau." },
  { id: 'q9-2', themeId: '9', text: "Pénétration directe ?", answer: "Non. Blessures, ouvertures naturelles ou vecteurs." },
  { id: 'q9-3', themeId: '9', text: "Citrus Canker (Xanthomonas) ?", answer: "Maladie redoutable causant défoliation et chute des fruits (agrumes)." },
  { id: 'q9-4', themeId: '9', text: "Agrobacterium (Plasmide Ti) ?", answer: "Transfert d'ADN (ADN-T) qui force la plante à faire des tumeurs et hormones." },
  { id: 'q9-5', themeId: '9', text: "Activité glaçogène (INA) ?", answer: "Bactéries (P. syringae) qui forcent la glace à se former, blessant la plante." },
  { id: 'q9-6', themeId: '9', text: "Ralstonia solanacearum ?", answer: "Flétrissement rapide, décoloration du xylème, suintements." },
  { id: 'q9-7', themeId: '9', text: "Phytoplasme ?", answer: "Bactérie sans paroi vivant dans le phloème." },
  { id: 'q9-8', themeId: '9', text: "Insecte vecteur des phytoplasmes ?", answer: "Cicadelles." },
  { id: 'q9-9', themeId: '9', text: "Citrus Greening ?", answer: "Bactérie dans le phloème obstruant le transport (très grave)." },
  { id: 'q9-10', themeId: '9', text: "Luttes majeures (Bactéries) ?", answer: "Quarantaines, rotation, cuivre, variétés résistantes." },

  // Thème 10
  { id: 'q10-1', themeId: '10', text: "Hyphe et mycélium ?", answer: "Hyphe = filament; Mycélium = réseau d'hyphes." },
  { id: 'q10-2', themeId: '10', text: "Septé vs Coenocytique ?", answer: "Septé = cloisonné; Coenocytique = creux et multinucléé." },
  { id: 'q10-3', themeId: '10', text: "Reproduction asexuée ?", answer: "Par mitose (conidies, sporanges) pour une propagation rapide." },
  { id: 'q10-4', themeId: '10', text: "4 types de spores sexuées ?", answer: "Oospores, Zygospores, Ascospores, Basidiospores." },
  { id: 'q10-5', themeId: '10', text: "Cycle parasexué ?", answer: "Recombinaison génétique sans sexe (important pour les imparfaits)." },
  { id: 'q10-6', themeId: '10', text: "Oomycètes (Chromista) ?", answer: "Paroi de cellulose (pas chitine), spores biflagellées." },
  { id: 'q10-7', themeId: '10', text: "Ascomycètes ?", answer: "Spores sexuées (ascospores) dans des sacs (asques)." },
  { id: 'q10-8', themeId: '10', text: "Basidiomycètes ?", answer: "Spores sexuées (basidiospores) portées par des basides." },
  { id: 'q10-9', themeId: '10', text: "Deutéromycètes ?", answer: "Les 'champignons imparfaits' (sexe inconnu)." },
  { id: 'q10-10', themeId: '10', text: "Sclérotes et chlamydospores ?", answer: "Organes de conservation (survie aux conditions dures)." },

  // Thème 11
  { id: 'q11-1', themeId: '11', text: "Mildiou de la pomme de terre ?", answer: "Phytophthora infestans." },
  { id: 'q11-2', themeId: '11', text: "Conditions fraîches/humides ?", answer: "Favorisent la mobilité des zoospores et empêchent le séchage." },
  { id: 'q11-3', themeId: '11', text: "Downy mildews ?", answer: "Parasites obligatoires, duvet blanc (ex: vigne)." },
  { id: 'q11-4', themeId: '11', text: "Rouille de la tige du blé ?", answer: "Puccinia graminis: 2 hôtes (blé, vinette), 5 types de spores." },
  { id: 'q11-5', themeId: '11', text: "Charbon du maïs ?", answer: "Ustilago maydis: grosses galles noires pleines de téliospores." },
  { id: 'q11-6', themeId: '11', text: "Maladie fongique vasculaire ?", answer: "Fusarium (chaud) ou Verticillium (frais) obstruant le xylème." },
  { id: 'q11-7', themeId: '11', text: "Maladie Hollandaise de l'Orme ?", answer: "Ceratocystis ulmi + insecte scolyte." },
  { id: 'q11-8', themeId: '11', text: "Hypovirulence ?", answer: "Virus qui infecte le champignon pour le rendre moins méchant." },
  { id: 'q11-9', themeId: '11', text: "Champignon tellurique (Pythium) ?", answer: "Oomycète du sol causant la fonte de semis." },
  { id: 'q11-10', themeId: '11', text: "Bouillie bordelaise ?", answer: "Cuivre + chaux pour protéger les contacts de surface." },

  // Thème 12
  { id: 'q12-1', themeId: '12', text: "Nématode phytopathogène ?", answer: "Petit animal microscopique utilisant un stylet pour manger." },
  { id: 'q12-2', themeId: '12', text: "Ectoparasite vs Endoparasite ?", answer: "Ecto = extérieur; Endo = pénètre dedans." },
  { id: 'q12-3', themeId: '12', text: "Migrateur vs Sédentaire ?", answer: "Migrateur = bouge et casse; Sédentaire = fixe (cellules géantes)." },
  { id: 'q12-4', themeId: '12', text: "Stade larvaire infectieux ?", answer: "Juvénile de deuxième stade (J2)." },
  { id: 'q12-5', themeId: '12', text: "Formation de cellules géantes (Meloidogyne) ?", answer: "Sécrétions stylet qui forcent la mitose sans division." },
  { id: 'q12-6', themeId: '12', text: "Symptômes au-dessus du sol ?", answer: "Jaunissement, flétrissement, retard de croissance." },
  { id: 'q12-7', themeId: '12', text: "Vulnérabilité aux champignons ?", answer: "Les blessures des nématodes ouvrent des portes (ex: Fusarium)." },
  { id: 'q12-8', themeId: '12', text: "Kyste du Soja (Heterodera) ?", answer: "Le corps de la femelle devient un kyste durci protecteur d'oeufs." },
  { id: 'q12-9', themeId: '12', text: "Facteurs favorables ?", answer: "Sols sablonneux et humidité équilibrée." },
  { id: 'q12-10', themeId: '12', text: "3 stratégies de lutte ?", answer: "Rotation, nématicides, résistances." },

  // Thème 13
  { id: 'q13-1', themeId: '13', text: "Holoparasite vs Hémiparasite ?", answer: "Holo = pas de chlorophylle; Hémi = photosynthèse mais vole l'eau." },
  { id: 'q13-2', themeId: '13', text: "Haustorium ?", answer: "Suçoir pénétrant les veines de l'hôte." },
  { id: 'q13-3', themeId: '13', text: "Cuscute ?", answer: "Holoparasite des tiges (s'enroule)." },
  { id: 'q13-4', themeId: '13', text: "Repérage (Cuscute) ?", answer: "Sensors chimiques ('flaire' les odeurs de l'hôte)." },
  { id: 'q13-5', themeId: '13', text: "Striga (Afrique) ?", answer: "Grave parasite des racines de céréales (maïs/sorgho)." },
  { id: 'q13-6', themeId: '13', text: "Striga (Racines vs Air) ?", answer: "Parasite les racines." },
  { id: 'q13-7', themeId: '13', text: "Orobanche ?", answer: "Holoparasite racinaire (ex: tomate)." },
  { id: 'q13-8', themeId: '13', text: "Gui nain (Conifères) ?", answer: "Parasites des branches (très grave en forêt)." },
  { id: 'q13-9', themeId: '13', text: "Dispersion (Gui) ?", answer: "Oiseaux qui mangent les baies et collent les graines ailleurs." },
  { id: 'q13-10', themeId: '13', text: "Lutte la plus courante (Gui) ?", answer: "Élagage physique (coupe)." },

  // Thème 14
  { id: 'q14-1', themeId: '14', text: "Virus = moléculaire ?", answer: "Pas de métabolisme, dépend d'une cellule pour copier son ARN/ADN." },
  { id: 'q14-2', themeId: '14', text: "Structure virion ?", answer: "Acide nucléique (ARN/ADN) + Capside (protéines)." },
  { id: 'q14-3', themeId: '14', text: "3 symptômes systémiques ?", answer: "Mosaïque, Jaunissement, Nanisme." },
  { id: 'q14-4', themeId: '14', text: "Lésion locale ?", answer: "Réaction d'hypersensibilité: mort cellulaire pour bloquer le virus." },
  { id: 'q14-5', themeId: '14', text: "Viroïde ?", answer: "ARN nu sans capside." },
  { id: 'q14-6', themeId: '14', text: "Déplacement virus ?", answer: "Plasmodesmes (proche) et Phloème (longue distance)." },
  { id: 'q14-7', themeId: '14', text: "Vecteurs communs (Virus) ?", answer: "Pucerons, cicadelles, mouches blanches." },
  { id: 'q14-8', themeId: '14', text: "Non-persistante vs Persistante ?", answer: "Non-persistante = sur le stylet; Persistante = circule et se multiplie dedans." },
  { id: 'q14-9', themeId: '14', text: "TMV ?", answer: "Très stable, transmission mécanique (mains, outils)." },
  { id: 'q14-10', themeId: '14', text: "Protection croisée ?", answer: "Vacci de plante: souche faible pour empêcher une forte." },

  // Thème 15
  { id: 'q15-1', themeId: '15', text: "Incidence vs Sévérité ?", answer: "Incidence = nb plantes; Sévérité = surface détruite." },
  { id: 'q15-2', themeId: '15', text: "Épidémie monocyclique ?", answer: "Pas de cycle secondaire (ex: maladies du sol)." },
  { id: 'q15-3', themeId: '15', text: "Épidémie polycyclique ?", answer: "Cycles multiples (exponentielle puis sigmoïde)." },
  { id: 'q15-4', themeId: '15', text: "Inoculum initial (Monocyclique) ?", answer: "Définit toute l'ampleur de la maladie finale." },
  { id: 'q15-5', themeId: '15', text: "AUDPC ?", answer: "Aire sous la courbe: mesure la pression totale de maladie." },
  { id: 'q15-6', themeId: '15', text: "Verticale vs Horizontale ?", answer: "Verticale (1 gène, total mais cassable); Horizontale (plusieurs gènes, partiel mais stable)." },
  { id: 'q15-7', themeId: '15', text: "Théorie Gène pour gène ?", answer: "Flor: gène R hôte + gène Avr pathogène = résistance." },
  { id: 'q15-8', themeId: '15', text: "Exclusion, Éradication, Protection ?", answer: "Empêcher d'entrer, Éliminer ce qui est là, Bloquer l'infection." },
  { id: 'q15-9', themeId: '15', text: "Biocontrôle ?", answer: "Usage de bons microbes contre les mauvais (ex: Trichoderma)." },
  { id: 'q15-10', themeId: '15', text: "Variétés multi-lignées ?", answer: "Mélange de gènes dans un champ pour freiner l'épidémie." },

  // Thème 16
  { id: 'q16-1', themeId: '16', text: "Mauvaise herbe ?", answer: "Plante non désirée (messicole/rudérale) en compétition." },
  { id: 'q16-2', themeId: '16', text: "3 caractéristiques redoutables ?", answer: "Beaucoup de graines, longue viabilité, dispersion facile." },
  { id: 'q16-3', themeId: '16', text: "Banque de graines ?", answer: "Stock dormant dans le sol prêt à germer." },
  { id: 'q16-4', themeId: '16', text: "Compétition ?", answer: "Lumière, eau, azote (au détriment du rendement)." },
  { id: 'q16-5', themeId: '16', text: "Allélopathie ?", answer: "Voisines empoisonnées par des sécrétions chimiques." },
  { id: 'q16-6', themeId: '16', text: "Réduction qualitative ?", answer: "Impuretés, calibres, croisements gènes." },
  { id: 'q16-7', themeId: '16', text: "Danger bétail ?", answer: "Poisons naturels mortels (ex: colchique)." },
  { id: 'q16-8', themeId: '16', text: "Favoriser les maladies ?", answer: "Réservoirs, microclimat, ou hôtes intermédiaires." },
  { id: 'q16-9', themeId: '16', text: "Moment germination ?", answer: "Si germe avant la culture, elle prend un avantage fatal." },
  { id: 'q16-10', themeId: '16', text: "Identification précoce ?", answer: "Pour traiter avant que ce soit trop tard." },
];

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('phyto_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showEditor, setShowEditor] = useState<Question | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    localStorage.setItem('phyto_questions', JSON.stringify(questions));
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    let q = questions;
    if (activeTheme) {
      q = q.filter(item => item.themeId === activeTheme);
    }
    if (searchQuery) {
      q = q.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return q;
  }, [questions, activeTheme, searchQuery]);

  const handleUpdateAnswer = (id: string, newAnswer: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, answer: newAnswer } : q));
    setShowEditor(null);
  };

  const handleAddNew = (themeId: string, text: string, answer: string) => {
    const newQ: Question = {
      id: `custom-${Date.now()}`,
      themeId,
      text,
      answer,
      isCustom: true
    };
    setQuestions(prev => [...prev, newQ]);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette question ?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      if (showEditor?.id === id) setShowEditor(null);
    }
  };

  const startQuiz = () => {
    if (filteredQuestions.length === 0) return;
    setIsQuizMode(true);
    setQuizIndex(0);
    setShowAnswer(false);
  };

  const quizPool = activeTheme ? filteredQuestions : questions;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Navigation Rail */}
      <nav className="w-full md:w-20 bg-emerald-900 flex flex-row md:flex-col items-center py-4 md:py-8 space-x-4 md:space-x-0 md:space-y-8 border-b md:border-b-0 md:border-r border-emerald-800 shrink-0 z-40">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-400 rounded-xl flex items-center justify-center text-emerald-900 font-black text-xl shadow-lg shadow-emerald-900/20 ml-4 md:ml-0">
          Φ
        </div>
        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-6">
          <button 
            onClick={() => setIsQuizMode(false)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${!isQuizMode ? 'bg-emerald-800 text-emerald-100 shadow-inner' : 'text-emerald-400/60 hover:bg-emerald-800/30'}`}
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <button 
            onClick={() => startQuiz()}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isQuizMode ? 'bg-emerald-800 text-emerald-100 shadow-inner' : 'text-emerald-400/60 hover:bg-emerald-800/30'}`}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-auto hidden md:block pb-4">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 overflow-hidden bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
            ESA
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Bento Cell */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                PhytoMaster <span className="text-emerald-600">Revision</span>
              </h1>
              <p className="text-slate-500 font-medium italic">Bonne chance mon ingénieure</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Chercher une notion..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-100 font-bold transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {!isQuizMode ? (
              <>
                {/* Themes Bento Cell */}
                <section className="md:col-span-4 row-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px] md:h-auto">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-700 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                      Thèmes d'Étude
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <button 
                      onClick={() => setActiveTheme(null)}
                      className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all ${!activeTheme ? 'bg-emerald-50 border-emerald-100 text-emerald-900 border' : 'border border-transparent hover:bg-slate-50 text-slate-600'}`}
                    >
                      <span className="font-semibold text-sm">Tous les chapitres</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${!activeTheme ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {questions.length}
                      </span>
                    </button>
                    {THEMES.map(theme => {
                      const count = questions.filter(q => q.themeId === theme.id).length;
                      return (
                        <button 
                          key={theme.id}
                          onClick={() => setActiveTheme(theme.id)}
                          className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all ${activeTheme === theme.id ? 'bg-emerald-50 border-emerald-100 text-emerald-900 border' : 'border border-transparent hover:bg-slate-50 text-slate-600'}`}
                        >
                          <span className="font-semibold text-sm text-left line-clamp-1">{theme.title.split('. ')[1] || theme.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-2 ${activeTheme === theme.id ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Questions Grid Bento Cell */}
                <section className="md:col-span-8 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span className="w-2 h-6 bg-indigo-600 rounded-full" />
                      {activeTheme ? THEMES.find(t => t.id === activeTheme)?.title.split('. ')[1] : "Questions"}
                    </h2>
                    <button 
                      onClick={startQuiz}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                    >
                      Démarrer Flashcards
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 overflow-y-visible">
                    {filteredQuestions.map((q, idx) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={q.id}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded tracking-tighter uppercase">ID {q.id.split('-').pop()}</span>
                              <span className="text-[10px] font-bold text-emerald-600 uppercase">Thème {q.themeId}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-emerald-900">{q.text}</h3>
                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-slate-600 text-sm italic border border-slate-100 group-hover:bg-emerald-50/30 transition-colors">
                              {q.answer || <span className="text-slate-400">Rédigez la réponse...</span>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button onClick={() => setShowEditor(q)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {q.isCustom && (
                              <button onClick={() => handleDelete(q.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Stats Row */}
                <section className="md:col-span-6 bg-emerald-900 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-emerald-200/50">
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-400 font-black uppercase text-[10px] tracking-widest">Revue Quotidienne</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center">
                       <RotateCcw className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="text-5xl font-black mb-1">
                      {questions.filter(q => q.answer).length}
                    </div>
                    <div className="text-emerald-300 text-sm font-medium">Questions mémorisées sur {questions.length}</div>
                  </div>
                  <div className="w-full bg-emerald-800 h-2.5 rounded-full mt-6 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(questions.filter(q => q.answer).length / questions.length) * 100}%` }}
                      className="bg-emerald-400 h-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </section>

                <section className="md:col-span-6 bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col shadow-sm">
                  <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-6">Expertise Focus</span>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-1 flex flex-col justify-center">
                    <p className="text-[10px] text-emerald-600 font-black mb-1 uppercase tracking-wider">Dernière Mise à Jour</p>
                    <p className="text-base font-bold text-slate-800 leading-tight">
                      {questions[questions.length - 1]?.text}
                    </p>
                    <button 
                      onClick={() => setShowEditor(questions[questions.length - 1]!)}
                      className="mt-4 flex items-center text-xs text-emerald-600 font-black cursor-pointer hover:translate-x-1 transition-transform"
                    >
                      Améliorer la fiche →
                    </button>
                  </div>
                </section>
              </>
            ) : (
              /* Quiz View in Bento */
              <section className="md:col-span-12 min-h-[600px] flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-6 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                  <motion.div 
                    className="h-full bg-emerald-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${((quizIndex + 1) / filteredQuestions.length) * 100}%` }}
                  />
                </div>

                <div className="max-w-2xl w-full text-center space-y-12 z-10">
                  <div className="space-y-4">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">
                       Chapitre {filteredQuestions[quizIndex]?.themeId} • Carte {quizIndex + 1}/{filteredQuestions.length}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                      {filteredQuestions[quizIndex]?.text}
                    </h3>
                  </div>

                  <AnimatePresence mode="wait">
                    {showAnswer ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100 backdrop-blur-sm"
                      >
                        <p className="text-xl md:text-2xl text-emerald-900 font-bold leading-relaxed italic">
                          "{filteredQuestions[quizIndex]?.answer}"
                        </p>
                      </motion.div>
                    ) : (
                      <button 
                        onClick={() => setShowAnswer(true)}
                        className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-emerald-400 hover:bg-emerald-50 transition-all text-slate-400 font-bold group"
                      >
                        <Search className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                        Révéler la solution
                      </button>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-100 transition-colors">
                    <div className="flex gap-4">
                      <button 
                         onClick={() => {
                          setQuizIndex(prev => Math.max(0, prev - 1));
                          setShowAnswer(false);
                        }}
                        disabled={quizIndex === 0}
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-50 disabled:opacity-20 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => {
                          if (quizIndex < filteredQuestions.length - 1) {
                            setQuizIndex(prev => prev + 1);
                            setShowAnswer(false);
                          } else {
                            if (window.confirm("Fin de session ! Recommencer ?")) {
                              setQuizIndex(0);
                              setShowAnswer(false);
                            } else {
                              setIsQuizMode(false);
                            }
                          }
                        }}
                        className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                    <button 
                      onClick={() => setIsQuizMode(false)}
                      className="px-6 py-4 text-slate-400 font-bold hover:text-slate-800 transition-colors"
                    >
                      Terminer Session
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Modals & Portals */}
      {showEditor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800">Édition Master</h3>
              <button onClick={() => setShowEditor(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-emerald-600 uppercase mb-1 block">Question</span>
                <p className="text-slate-800 font-bold">{showEditor.text}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Réponse (Corrigé)</label>
                <textarea 
                  className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium leading-relaxed"
                  defaultValue={showEditor.answer}
                  id="editor-textarea"
                />
              </div>
            </div>
            <div className="mt-10 flex gap-4">
              <button onClick={() => setShowEditor(null)} className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Annuler</button>
              <button 
                onClick={() => {
                  const val = (document.getElementById('editor-textarea') as HTMLTextAreaElement).value;
                  handleUpdateAnswer(showEditor.id, val);
                }}
                className="flex-1 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all"
              >
                Actualiser
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800">Ajout Stratégique</h3>
              <button onClick={() => setIsAddingNew(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">Thème Principal</label>
                <select id="new-theme" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-bold">
                  {THEMES.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">Nouvelle Question</label>
                <input id="new-text" type="text" placeholder="Qu'est-ce que..." className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">Réponse / Corrigé</label>
                <textarea id="new-answer" placeholder="La définition est..." className="w-full h-32 p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-medium" />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button onClick={() => setIsAddingNew(false)} className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 font-bold">Annuler</button>
              <button 
                onClick={() => {
                  const t = (document.getElementById('new-theme') as HTMLSelectElement).value;
                  const q = (document.getElementById('new-text') as HTMLInputElement).value;
                  const a = (document.getElementById('new-answer') as HTMLTextAreaElement).value;
                  if(q && a) handleAddNew(t, q, a);
                }}
                className="flex-1 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Ajouter
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
