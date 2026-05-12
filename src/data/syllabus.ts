export interface Topic {
  name: string;
  subtopics?: string[];
  videoCount?: number;
  questionCount?: number;
}

export interface Unit {
  name: string;
  topics: (string | Topic)[];
  page?: string;
}

export interface SubjectSyllabus {
  units: Unit[];
  description?: string;
  totalTopics?: number;
}

export interface Syllabus {
  [subject: string]: SubjectSyllabus;
}

export interface ClassSyllabusMap {
  [className: string]: Syllabus;
}

export const syllabusData: ClassSyllabusMap = {
  "Class 10": {
    "Mathematics": {
      description: "CBSE Class 10 Mathematics - Comprehensive curriculum covering algebra, geometry, and trigonometry",
      totalTopics: 15,
      units: [
        {
          name: "Number Systems",
          topics: [
            { name: "Real Numbers", subtopics: ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Irrational Numbers"], videoCount: 8, questionCount: 45 },
            { name: "Rational Numbers", subtopics: ["Properties", "Operations", "Decimal Representation"], videoCount: 6, questionCount: 32 }
          ]
        },
        {
          name: "Algebra",
          topics: [
            { name: "Polynomials", subtopics: ["Division Algorithm", "Zeros of Polynomials", "Factorization"], videoCount: 10, questionCount: 58 },
            { name: "Pair of Linear Equations", subtopics: ["Graphical Method", "Algebraic Methods", "Application Problems"], videoCount: 12, questionCount: 72 },
            { name: "Quadratic Equations", subtopics: ["Standard Form", "Factorization Method", "Quadratic Formula", "Nature of Roots"], videoCount: 14, questionCount: 85 },
            { name: "Arithmetic Progressions", subtopics: ["Common Difference", "Nth Term", "Sum of Terms"], videoCount: 9, questionCount: 50 }
          ]
        },
        {
          name: "Geometry",
          topics: [
            { name: "Similar Triangles", subtopics: ["Similarity Criteria", "Properties", "Theorems"], videoCount: 11, questionCount: 65 },
            { name: "Circles", subtopics: ["Tangents", "Angles in Circles", "Power of a Point"], videoCount: 10, questionCount: 58 },
            { name: "Coordinate Geometry", subtopics: ["Distance Formula", "Section Formula", "Area of Triangle"], videoCount: 8, questionCount: 48 },
            { name: "Constructions", subtopics: ["Division of Line Segment", "Tangents", "Similar Figures"], videoCount: 7, questionCount: 35 }
          ]
        },
        {
          name: "Trigonometry",
          topics: [
            { name: "Trigonometric Ratios", subtopics: ["Sine, Cosine, Tangent", "Complementary Angles", "Trigonometric Identities"], videoCount: 12, questionCount: 75 },
            { name: "Heights and Distances", subtopics: ["Angle of Elevation", "Angle of Depression", "Real-world Applications"], videoCount: 9, questionCount: 52 }
          ]
        },
        {
          name: "Statistics & Probability",
          topics: [
            { name: "Statistics", subtopics: ["Mean, Median, Mode", "Grouped Data", "Cumulative Frequency"], videoCount: 10, questionCount: 60 },
            { name: "Probability", subtopics: ["Experimental Probability", "Theoretical Probability", "Compound Events"], videoCount: 8, questionCount: 48 }
          ]
        }
      ]
    },
    "Science": {
      description: "CBSE Class 10 Science - Physics, Chemistry, and Biology integrated",
      totalTopics: 18,
      units: [
        {
          name: "Physics",
          topics: [
            { name: "Light - Reflection and Refraction", subtopics: ["Reflection", "Refraction", "Lens Formula", "Power of Lens"], videoCount: 15, questionCount: 90 },
            { name: "The Human Eye and the Colourful World", subtopics: ["Structure of Eye", "Defects of Vision", "Dispersion", "Atmospheric Refraction"], videoCount: 10, questionCount: 58 },
            { name: "Electricity", subtopics: ["Electric Charge", "Electric Current", "Ohm's Law", "Resistance", "Power"], videoCount: 16, questionCount: 95 },
            { name: "Magnetic Effects of Electric Current", subtopics: ["Magnetic Field", "Force on Conductor", "Electromagnetic Induction"], videoCount: 12, questionCount: 70 },
            { name: "Energy Sources", subtopics: ["Conventional Sources", "Non-conventional Sources", "Energy Conservation"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Chemistry",
          topics: [
            { name: "Chemical Reactions and Equations", subtopics: ["Types of Reactions", "Redox Reactions", "Balancing Equations"], videoCount: 12, questionCount: 72 },
            { name: "Acids, Bases and Salts", subtopics: ["Properties", "pH Scale", "Reactions", "Salts"], videoCount: 10, questionCount: 60 },
            { name: "Metals and Non-metals", subtopics: ["Properties", "Reactivity Series", "Extraction", "Corrosion"], videoCount: 13, questionCount: 78 },
            { name: "Carbon and its Compounds", subtopics: ["Bonding", "Nomenclature", "Functional Groups", "Proteins and Fats"], videoCount: 14, questionCount: 85 },
            { name: "Periodic Classification of Elements", subtopics: ["Mendeleev's Table", "Modern Periodic Table", "Trends", "Properties"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Biology",
          topics: [
            { name: "Life Processes", subtopics: ["Nutrition", "Respiration", "Transportation", "Excretion"], videoCount: 15, questionCount: 90 },
            { name: "Control and Coordination", subtopics: ["Nervous System", "Hormones", "Reflex Action"], videoCount: 12, questionCount: 72 },
            { name: "How do Organisms Reproduce?", subtopics: ["Asexual Reproduction", "Sexual Reproduction", "Reproductive Health"], videoCount: 13, questionCount: 78 },
            { name: "Heredity and Evolution", subtopics: ["Heredity", "Variation", "Evolution", "Speciation"], videoCount: 14, questionCount: 85 }
          ]
        }
      ]
    },
    "English": {
      description: "CBSE Class 10 English Language and Literature",
      totalTopics: 8,
      units: [
        {
          name: "Reading Skills",
          topics: [
            { name: "Unseen Passage", subtopics: ["Narrative", "Factual", "Discursive"], videoCount: 8, questionCount: 45 },
            { name: "Comprehension Questions", subtopics: ["MCQ", "Short Answer", "Long Answer"], videoCount: 6, questionCount: 35 }
          ]
        },
        {
          name: "Writing Skills",
          topics: [
            { name: "Letter Writing", subtopics: ["Formal Letters", "Informal Letters"], videoCount: 7, questionCount: 40 },
            { name: "Essay Writing", subtopics: ["Descriptive", "Narrative", "Argumentative"], videoCount: 9, questionCount: 50 },
            { name: "Creative Writing", subtopics: ["Story Writing", "Dialogue Writing"], videoCount: 6, questionCount: 32 }
          ]
        },
        {
          name: "Grammar",
          topics: [
            { name: "Tenses", subtopics: ["Simple, Continuous, Perfect"], videoCount: 8, questionCount: 48 },
            { name: "Parts of Speech", subtopics: ["Nouns", "Verbs", "Adjectives", "Adverbs"], videoCount: 10, questionCount: 60 }
          ]
        },
        {
          name: "Literature",
          topics: [
            { name: "Poetry", subtopics: ["Prose Poems", "Analytical Study"], videoCount: 12, questionCount: 70 },
            { name: "Drama", subtopics: ["Shakespeare", "Contemporary"], videoCount: 10, questionCount: 58 }
          ]
        }
      ]
    },
    "Social Science": {
      description: "CBSE Class 10 Social Science - History, Geography, Civics, Economics",
      totalTopics: 10,
      units: [
        {
          name: "History",
          topics: [
            { name: "The Rise of Nationalism in Europe", subtopics: ["Nationalism", "Nation-states", "Imperialism"], videoCount: 10, questionCount: 60 },
            { name: "Nationalism in India", subtopics: ["Freedom Struggle", "Independence Movement"], videoCount: 12, questionCount: 72 },
            { name: "India and the Contemporary World", subtopics: ["Partition", "Decolonization"], videoCount: 9, questionCount: 52 }
          ]
        },
        {
          name: "Geography",
          topics: [
            { name: "Resources and Development", subtopics: ["Types of Resources", "Conservation"], videoCount: 11, questionCount: 65 },
            { name: "Forests and Wildlife", subtopics: ["Biodiversity", "Conservation Strategies"], videoCount: 10, questionCount: 58 },
            { name: "Water Resources", subtopics: ["Sources", "Management", "Pollution"], videoCount: 9, questionCount: 50 }
          ]
        },
        {
          name: "Civics",
          topics: [
            { name: "Democracy and Diversity", subtopics: ["Democratic Government", "Representation"], videoCount: 8, questionCount: 45 },
            { name: "Rights and Duties", subtopics: ["Fundamental Rights", "Constitutional Duties"], videoCount: 9, questionCount: 52 }
          ]
        },
        {
          name: "Economics",
          topics: [
            { name: "Development", subtopics: ["Economic Development", "HDI", "Poverty"], videoCount: 10, questionCount: 58 },
            { name: "Sectors of Indian Economy", subtopics: ["Primary, Secondary, Tertiary"], videoCount: 11, questionCount: 65 }
          ]
        }
      ]
    }
  },
  "Class 12": {
    "Mathematics": {
      description: "CBSE Class 12 Mathematics - Advanced topics in calculus, algebra, and geometry",
      totalTopics: 13,
      units: [
        {
          name: "Relations and Functions",
          topics: [
            { name: "Relations and Functions", subtopics: ["Domain and Range", "Types of Functions", "Composition of Functions"], videoCount: 10, questionCount: 60 },
            { name: "Inverse Trigonometric Functions", subtopics: ["Principal Values", "Properties", "Equations"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Algebra",
          topics: [
            { name: "Matrices", subtopics: ["Operations", "Determinants", "Inverse", "Systems of Equations"], videoCount: 14, questionCount: 85 },
            { name: "Determinants", subtopics: ["Properties", "Applications", "Cofactors"], videoCount: 12, questionCount: 72 }
          ]
        },
        {
          name: "Calculus",
          topics: [
            { name: "Continuity and Differentiability", subtopics: ["Limits", "Continuity", "Derivatives", "Chain Rule"], videoCount: 15, questionCount: 90 },
            { name: "Applications of Derivatives", subtopics: ["Tangents", "Normals", "Increasing/Decreasing", "Maxima and Minima"], videoCount: 14, questionCount: 85 },
            { name: "Integrals", subtopics: ["Indefinite Integration", "Definite Integration", "Integration by Parts", "Substitution"], videoCount: 16, questionCount: 95 },
            { name: "Applications of Integrals", subtopics: ["Area under Curves", "Volume of Solids"], videoCount: 12, questionCount: 70 },
            { name: "Differential Equations", subtopics: ["Formation", "Solution Methods", "Applications"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Vectors and 3D Geometry",
          topics: [
            { name: "Vectors", subtopics: ["Operations", "Scalar and Vector Products", "Angle between Vectors"], videoCount: 12, questionCount: 72 },
            { name: "Three Dimensional Geometry", subtopics: ["Lines", "Planes", "Distance", "Angles"], videoCount: 13, questionCount: 78 }
          ]
        },
        {
          name: "Probability",
          topics: [
            { name: "Probability", subtopics: ["Conditional Probability", "Bayes' Theorem", "Random Variables", "Distributions"], videoCount: 13, questionCount: 78 }
          ]
        },
        {
          name: "Linear Programming",
          topics: [
            { name: "Linear Programming Problems", subtopics: ["Graphical Method", "Feasible Region", "Optimal Solution"], videoCount: 10, questionCount: 58 }
          ]
        }
      ]
    },
    "Physics": {
      description: "CBSE Class 12 Physics - Electricity, Magnetism, Optics, Modern Physics",
      totalTopics: 10,
      units: [
        {
          name: "Electrostatics",
          topics: [
            { name: "Electric Charges and Fields", subtopics: ["Coulomb's Law", "Electric Field", "Superposition"], videoCount: 12, questionCount: 72 },
            { name: "Electrostatic Potential and Capacitance", subtopics: ["Potential", "Equipotential", "Capacitors", "Dielectrics"], videoCount: 14, questionCount: 85 }
          ]
        },
        {
          name: "Current Electricity",
          topics: [
            { name: "Electric Current", subtopics: ["Resistance", "Ohm's Law", "Kirchhoff's Laws"], videoCount: 13, questionCount: 78 },
            { name: "EMF and Internal Resistance", subtopics: ["Cells", "Batteries", "Energy Conversion"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Magnetism",
          topics: [
            { name: "Magnetic Effects of Current", subtopics: ["Biot-Savart Law", "Ampere's Law", "Force on Conductor"], videoCount: 12, questionCount: 72 },
            { name: "Magnetism and Matter", subtopics: ["Magnetic Field", "Magnetic Properties", "Electromagnetic Induction"], videoCount: 13, questionCount: 78 }
          ]
        },
        {
          name: "Electromagnetic Induction",
          topics: [
            { name: "Electromagnetic Induction", subtopics: ["Faraday's Law", "Lenz's Law", "Self Inductance"], videoCount: 12, questionCount: 72 },
            { name: "Alternating Current", subtopics: ["AC Circuits", "Resonance", "Power"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Optics",
          topics: [
            { name: "Ray Optics", subtopics: ["Reflection", "Refraction", "Mirrors", "Lenses"], videoCount: 14, questionCount: 85 },
            { name: "Wave Optics", subtopics: ["Interference", "Diffraction", "Polarization"], videoCount: 13, questionCount: 78 }
          ]
        },
        {
          name: "Modern Physics",
          topics: [
            { name: "Dual Nature of Matter", subtopics: ["Photoelectric Effect", "de Broglie Waves", "Davisson-Germer Experiment"], videoCount: 11, questionCount: 65 },
            { name: "Atoms and Nuclei", subtopics: ["Bohr Model", "Atomic Structure", "Nuclear Physics", "Radioactivity"], videoCount: 14, questionCount: 85 },
            { name: "Semiconductor Electronics", subtopics: ["Semiconductors", "Diodes", "Transistors", "Integrated Circuits"], videoCount: 12, questionCount: 72 },
            { name: "Communication Systems", subtopics: ["Modulation", "Demodulation", "Bandwidth"], videoCount: 10, questionCount: 58 }
          ]
        }
      ]
    },
    "Chemistry": {
      description: "CBSE Class 12 Chemistry - Organic, Inorganic, and Physical Chemistry",
      totalTopics: 13,
      units: [
        {
          name: "Solutions and Colligative Properties",
          topics: [
            { name: "Solutions", subtopics: ["Solubility", "Expressing Concentration", "Colligative Properties"], videoCount: 12, questionCount: 72 },
            { name: "Colligative Properties", subtopics: ["Raoult's Law", "Boiling Point Elevation", "Freezing Point Depression"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Electrochemistry",
          topics: [
            { name: "Electrochemistry", subtopics: ["Redox Reactions", "Electrodes", "EMF", "Cells"], videoCount: 13, questionCount: 78 },
            { name: "Corrosion and Protection", subtopics: ["Causes", "Prevention", "Electroplating"], videoCount: 10, questionCount: 58 }
          ]
        },
        {
          name: "Chemical Kinetics",
          topics: [
            { name: "Rate of Reaction", subtopics: ["Factors Affecting Rate", "Order of Reaction", "Rate Law"], videoCount: 12, questionCount: 72 },
            { name: "Activation Energy", subtopics: ["Temperature Dependence", "Collision Theory", "Catalysis"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Surface Chemistry",
          topics: [
            { name: "Adsorption", subtopics: ["Types", "Applications", "Isotherms"], videoCount: 10, questionCount: 58 },
            { name: "Colloids", subtopics: ["Properties", "Classification", "Colloidal Solutions"], videoCount: 9, questionCount: 52 }
          ]
        },
        {
          name: "General Principles and Extraction of Metals",
          topics: [
            { name: "Metallurgy", subtopics: ["Occurrence", "Extraction", "Refining", "Uses"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Transition Metals",
          topics: [
            { name: "d-Block Elements", subtopics: ["Properties", "Complexes", "Color"], videoCount: 12, questionCount: 72 }
          ]
        },
        {
          name: "Coordination Compounds",
          topics: [
            { name: "Coordination Compounds", subtopics: ["Ligands", "Bonding", "Nomenclature", "Isomerism"], videoCount: 13, questionCount: 78 }
          ]
        },
        {
          name: "Organic Chemistry",
          topics: [
            { name: "Haloalkanes and Haloarenes", subtopics: ["Nomenclature", "Properties", "Reactions"], videoCount: 12, questionCount: 72 },
            { name: "Alcohols, Phenols, and Ethers", subtopics: ["Structure", "Properties", "Reactions", "Uses"], videoCount: 13, questionCount: 78 },
            { name: "Aldehydes, Ketones, and Carboxylic Acids", subtopics: ["Structure", "Properties", "Reactions", "Preparations"], videoCount: 14, questionCount: 85 },
            { name: "Amines and Amino Acids", subtopics: ["Structure", "Classification", "Properties", "Reactions"], videoCount: 12, questionCount: 72 },
            { name: "Polymers", subtopics: ["Classification", "Polymerization", "Applications"], videoCount: 10, questionCount: 58 },
            { name: "Biomolecules", subtopics: ["Carbohydrates", "Proteins", "Lipids", "Nucleic Acids"], videoCount: 13, questionCount: 78 }
          ]
        }
      ]
    },
    "Biology": {
      description: "CBSE Class 12 Biology - Genetics, Evolution, Ecology, and Biotechnology",
      totalTopics: 10,
      units: [
        {
          name: "Reproduction",
          topics: [
            { name: "Sexual Reproduction", subtopics: ["Gametogenesis", "Fertilization", "Embryo Development"], videoCount: 13, questionCount: 78 },
            { name: "Reproductive Health", subtopics: ["Diseases", "Prevention", "Contraception"], videoCount: 10, questionCount: 58 }
          ]
        },
        {
          name: "Genetics and Evolution",
          topics: [
            { name: "Principles of Inheritance", subtopics: ["Mendelian Genetics", "Gene Interaction", "Linkage"], videoCount: 14, questionCount: 85 },
            { name: "Molecular Basis of Inheritance", subtopics: ["DNA", "Gene Expression", "Protein Synthesis"], videoCount: 15, questionCount: 90 },
            { name: "Evolution", subtopics: ["Theories", "Evidence", "Population Genetics"], videoCount: 12, questionCount: 72 }
          ]
        },
        {
          name: "Ecology and Environment",
          topics: [
            { name: "Organisms and Environment", subtopics: ["Ecology", "Habitat", "Population"], videoCount: 12, questionCount: 72 },
            { name: "Ecosystem", subtopics: ["Components", "Food Chains", "Energy Flow", "Biodiversity"], videoCount: 13, questionCount: 78 },
            { name: "Biodiversity Conservation", subtopics: ["Threats", "Protected Areas", "Strategies"], videoCount: 11, questionCount: 65 }
          ]
        },
        {
          name: "Biotechnology",
          topics: [
            { name: "Biotechnology and its Applications", subtopics: ["Genetic Engineering", "PCR", "Cloning"], videoCount: 14, questionCount: 85 },
            { name: "Microbes and Human Welfare", subtopics: ["Useful Microbes", "Vaccines", "Antibiotics"], videoCount: 11, questionCount: 65 }
          ]
        }
      ]
    }
  }
};
