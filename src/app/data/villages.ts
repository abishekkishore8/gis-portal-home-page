export interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  households: number;
  overallScore: number; // 1-5 scale
  scores: CategoryScore[];
  images: string[];
}

export interface CategoryScore {
  category: string;
  output: string; // "Low", "Medium", "High"
  scoreOnScale5: number;
  subCategories: SubCategoryScore[];
}

export interface SubCategoryScore {
  subCategory: string;
  score: number;
  maxScore: number;
  individualScore: number;
  indicators: IndicatorScore[];
}

export interface IndicatorScore {
  name: string;
  maxIndividualScore: number;
  individualScore: number;
}

const generateVillageScores = (seed: number): CategoryScore[] => {
  const rng = (min: number, max: number) => {
    seed = (seed * 9301 + 49297) % 233280;
    return min + Math.floor((seed / 233280) * (max - min + 1));
  };

  return [
    {
      category: "Community Awareness",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Awareness on species found in an area",
          score: 15,
          maxScore: 15,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Awareness on Terrestrial Species found in an area", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Awareness on wetlands found in an area",
          score: 10,
          maxScore: 10,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Awareness on Wetland found in an area", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Awareness on species found in Ganga river",
          score: 15,
          maxScore: 15,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Awareness of Aquatic Species found in a Ganga river", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Awareness on threats to Ganga river",
          score: 15,
          maxScore: 15,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Awareness on Over exploitation of River", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Awareness on waste segregation and waste management",
          score: 15,
          maxScore: 15,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Waste segregation awareness", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Awareness on impact of chemical fertilizers and pesticides",
          score: 15,
          maxScore: 15,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Awareness on human health", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Awareness on roles and responsibilities in conservation of Ganga river",
          score: 15,
          maxScore: 15,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Awareness on Role", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
      ],
    },
    {
      category: "Community Based Institution",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Frequency of meetings Scale",
          score: 50,
          maxScore: 50,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Meeting scheduled implemented scale", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Representation of women and marginal Community",
          score: 50,
          maxScore: 50,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Scheme implemented scale (Participation)", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
      ],
    },
    {
      category: "Livelihood and Skill Development",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Scale of Scheme Implementation",
          score: 30,
          maxScore: 30,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Percentage of scheme implemented", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "After training - % people employed/self employed",
          score: 40,
          maxScore: 40,
          individualScore: rng(0, 60),
          indicators: [
            { name: "Self employed", maxIndividualScore: 60, individualScore: rng(0, 60) },
            { name: "Employment", maxIndividualScore: 40, individualScore: rng(0, 40) },
          ],
        },
        {
          subCategory: "Female distribution (getting benefit from centers)",
          score: 30,
          maxScore: 30,
          individualScore: rng(0, 100),
          indicators: [
            { name: "No. of female participation", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
      ],
    },
    {
      category: "Hygiene and Sanitation",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Construction and use of toilet",
          score: 40,
          maxScore: 40,
          individualScore: rng(0, 40),
          indicators: [
            { name: "Constructed toilet %", maxIndividualScore: 40, individualScore: rng(0, 40) },
            { name: "Toilet in use %", maxIndividualScore: 40, individualScore: rng(0, 40) },
            { name: "If relevant community toilet", maxIndividualScore: 20, individualScore: rng(0, 20) },
          ],
        },
        {
          subCategory: "Mean access of dustbin installed by panchayat",
          score: 30,
          maxScore: 30,
          individualScore: rng(0, 70),
          indicators: [
            { name: "Accessed by household village level", maxIndividualScore: 70, individualScore: rng(0, 70) },
            { name: "If presence ghat? installed dustbin sufficient", maxIndividualScore: 30, individualScore: rng(0, 30) },
          ],
        },
        {
          subCategory: "Waste management scale",
          score: 30,
          maxScore: 30,
          individualScore: rng(0, 25),
          indicators: [
            { name: "Collection of waste", maxIndividualScore: 25, individualScore: rng(0, 25) },
            { name: "Segregation", maxIndividualScore: 20, individualScore: rng(0, 20) },
            { name: "Dumping", maxIndividualScore: 15, individualScore: rng(0, 15) },
            { name: "Management", maxIndividualScore: 40, individualScore: rng(0, 40) },
          ],
        },
      ],
    },
    {
      category: "Renewable Energy",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Non Dependence on fuel wood",
          score: 50,
          maxScore: 50,
          individualScore: rng(0, 100),
          indicators: [
            { name: "% of household non dependent on fuel wood", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Accessibility to renewable energy",
          score: 50,
          maxScore: 50,
          individualScore: rng(0, 50),
          indicators: [
            { name: "Implementation of Scheme related to renewable energy", maxIndividualScore: 50, individualScore: rng(0, 50) },
            { name: "Scale of household benefitted", maxIndividualScore: 50, individualScore: rng(0, 50) },
          ],
        },
      ],
    },
    {
      category: "Biodiversity Conservation Plan",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Activities for biodiversity conservation plan scale",
          score: 70,
          maxScore: 70,
          individualScore: rng(0, 100),
          indicators: [
            { name: "Aforestation, soil conservation, rain water harvesting, wetland management", maxIndividualScore: 100, individualScore: rng(0, 100) },
          ],
        },
        {
          subCategory: "Benefit from BMC scale",
          score: 30,
          maxScore: 30,
          individualScore: rng(0, 40),
          indicators: [
            { name: "Meeting scheduled implemented scale", maxIndividualScore: 40, individualScore: rng(0, 40) },
            { name: "Participation", maxIndividualScore: 20, individualScore: rng(0, 20) },
            { name: "Conservation Activity scale", maxIndividualScore: 40, individualScore: rng(0, 40) },
          ],
        },
      ],
    },
    {
      category: "Agriculture",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Scale on ganga ecosystem for organic farming",
          score: 40,
          maxScore: 40,
          individualScore: rng(0, 60),
          indicators: [
            { name: "Land percent under organic farming", maxIndividualScore: 60, individualScore: rng(0, 60) },
            { name: "Percent of used insecticides, fertilised, pesticides", maxIndividualScore: 40, individualScore: rng(0, 40) },
          ],
        },
        {
          subCategory: "Scale on ganga ecosystem for riverbed farming",
          score: 60,
          maxScore: 60,
          individualScore: rng(0, 40),
          indicators: [
            { name: "Land percent under inorganic farming", maxIndividualScore: 40, individualScore: rng(0, 40) },
            { name: "Percent of non used insecticides, fertilised, pesticides", maxIndividualScore: 30, individualScore: rng(0, 30) },
            { name: "Change in traditional crops", maxIndividualScore: 30, individualScore: rng(0, 30) },
          ],
        },
      ],
    },
    {
      category: "Animal Husbandry",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Scale of Conservation of species habitat",
          score: 100,
          maxScore: 100,
          individualScore: rng(0, 60),
          indicators: [
            { name: "Conservation friendly Source of fodder", maxIndividualScore: 60, individualScore: rng(0, 60) },
            { name: "High productivity breed used", maxIndividualScore: 40, individualScore: rng(0, 40) },
          ],
        },
      ],
    },
    {
      category: "Fishery",
      output: ["Low", "Medium", "Low", "High"][rng(0, 3)],
      scoreOnScale5: rng(0, 5),
      subCategories: [
        {
          subCategory: "Scale of Sustainable fishing",
          score: 100,
          maxScore: 100,
          individualScore: rng(0, 40),
          indicators: [
            { name: "Scale of proper Fishing gear", maxIndividualScore: 40, individualScore: rng(0, 40) },
            { name: "Non dependence on fishing", maxIndividualScore: 50, individualScore: rng(0, 50) },
            { name: "Use of pisciculture fish farming", maxIndividualScore: 10, individualScore: rng(0, 10) },
          ],
        },
      ],
    },
  ];
};

const villageImagePool = [
  "https://images.unsplash.com/photo-1722067487813-3650fb50f028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVdHRhcmFraGFuZCUyMG1vdW50YWluJTIwcml2ZXIlMjBIaW1hbGF5YXxlbnwxfHx8fDE3NzI0NDYzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1759738104613-5eafde92c12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjByaXZlcmJhbmt8ZW58MXx8fHwxNzcyNDQ2MzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1701619879211-e03adf1993a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMGdoYXQlMjByaXZlciUyMEdhbmdlc3xlbnwxfHx8fDE3NzI0NDYzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1720819029162-8500607ae232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSaXNoaWtlc2glMjByaXZlciUyMGJyaWRnZSUyMEluZGlhfGVufDF8fHx8MTc3MjQ0NjM2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1661932912833-b645500de79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB2aWxsYWdlJTIwZmFybWluZyUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc3MjQ0NjM2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1752839244907-f58ca4dd68bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYXJpZHdhciUyMHJpdmVyJTIwdGVtcGxlJTIwSW5kaWF8ZW58MXx8fHwxNzcyNDQ2MzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1708593343442-7595427ddf7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB2aWxsYWdlJTIwY29tbXVuaXR5JTIwbWVldGluZ3xlbnwxfHx8fDE3NzI0NDYzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1768326758820-ea0401b2a8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9kaXZlcnNpdHklMjB3ZXRsYW5kJTIwSW5kaWElMjBuYXR1cmV8ZW58MXx8fHwxNzcyNDQ2MzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1705878565540-99d93b573fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGVuZXJneSUyMHJ1cmFsJTIwSW5kaWElMjByZW5ld2FibGV8ZW58MXx8fHwxNzcyNDQ2MzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1578981320111-c7e9426cd6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmaXNoZXJtYW4lMjByaXZlciUyMGJvYXR8ZW58MXx8fHwxNzcyNDQ2MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1576516816755-705b4b24df2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHYW5nZXMlMjByaXZlciUyMEluZGlhJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MjQ0NjM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1552559590-952a24ab39ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMHJpdmVyJTIwc3VucmlzZSUyMGJvYXR8ZW58MXx8fHwxNzcyNDQ2MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1722372088297-845cbc5e9197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXR0bGUlMjBmYXJtJTIwSW5kaWElMjBydXJhbHxlbnwxfHx8fDE3NzI0NDYzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1762006222075-8900f43a6b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB0ZW1wbGUlMjByaXZlciUyMGJhbmslMjBzdGVwc3xlbnwxfHx8fDE3NzI0NDYzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1765635550191-a2a2ba9c07ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMGVudmlyb25tZW50JTIwY29uc2VydmF0aW9uJTIwZ3JlZW58ZW58MXx8fHwxNzcyNDQ2MzY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1751609492149-e93de149a832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMEluZGlhJTIwd2F0ZXIlMjB3ZWxsJTIwc2FuaXRhdGlvbnxlbnwxfHx8fDE3NzI0NDYzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

const getVillageImages = (index: number): string[] => {
  const count = 4 + (index % 3); // 4-6 images per village
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    images.push(villageImagePool[(index * 3 + i) % villageImagePool.length]);
  }
  return images;
};

export const villages: Village[] = [
  { id: "v1", name: "Gangotri Village", district: "Uttarkashi", state: "Uttarakhand", lat: 30.9946, lng: 78.9399, population: 1250, households: 210, overallScore: 2, scores: generateVillageScores(1), images: getVillageImages(0) },
  { id: "v2", name: "Harsil", district: "Uttarkashi", state: "Uttarakhand", lat: 31.0383, lng: 78.7394, population: 890, households: 150, overallScore: 3, scores: generateVillageScores(2), images: getVillageImages(1) },
  { id: "v3", name: "Uttarkashi Town", district: "Uttarkashi", state: "Uttarakhand", lat: 30.7268, lng: 78.4354, population: 3450, households: 580, overallScore: 1, scores: generateVillageScores(3), images: getVillageImages(2) },
  { id: "v4", name: "Tehri Village", district: "Tehri Garhwal", state: "Uttarakhand", lat: 30.3917, lng: 78.4804, population: 2100, households: 340, overallScore: 4, scores: generateVillageScores(4), images: getVillageImages(3) },
  { id: "v5", name: "Devprayag", district: "Tehri Garhwal", state: "Uttarakhand", lat: 30.1466, lng: 78.5961, population: 1800, households: 290, overallScore: 2, scores: generateVillageScores(5), images: getVillageImages(4) },
  { id: "v6", name: "Rishikesh Gram", district: "Dehradun", state: "Uttarakhand", lat: 30.0869, lng: 78.2676, population: 4200, households: 710, overallScore: 3, scores: generateVillageScores(6), images: getVillageImages(5) },
  { id: "v7", name: "Haridwar Village", district: "Haridwar", state: "Uttarakhand", lat: 29.9457, lng: 78.1642, population: 5100, households: 890, overallScore: 2, scores: generateVillageScores(7), images: getVillageImages(6) },
  { id: "v8", name: "Bijnor Gram", district: "Bijnor", state: "Uttar Pradesh", lat: 29.3724, lng: 78.1365, population: 2300, households: 380, overallScore: 1, scores: generateVillageScores(8), images: getVillageImages(7) },
  { id: "v9", name: "Narora Village", district: "Bulandshahr", state: "Uttar Pradesh", lat: 28.1960, lng: 78.3912, population: 1950, households: 320, overallScore: 3, scores: generateVillageScores(9), images: getVillageImages(8) },
  { id: "v10", name: "Farrukhabad Gram", district: "Farrukhabad", state: "Uttar Pradesh", lat: 27.3917, lng: 79.5804, population: 2800, households: 460, overallScore: 2, scores: generateVillageScores(10), images: getVillageImages(9) },
  { id: "v11", name: "Kannauj Village", district: "Kannauj", state: "Uttar Pradesh", lat: 27.0556, lng: 79.9139, population: 3200, households: 530, overallScore: 4, scores: generateVillageScores(11), images: getVillageImages(10) },
  { id: "v12", name: "Kanpur Gram", district: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319, population: 4500, households: 750, overallScore: 1, scores: generateVillageScores(12), images: getVillageImages(11) },
  { id: "v13", name: "Prayagraj Village", district: "Prayagraj", state: "Uttar Pradesh", lat: 25.4358, lng: 81.8463, population: 3800, households: 640, overallScore: 3, scores: generateVillageScores(13), images: getVillageImages(12) },
  { id: "v14", name: "Mirzapur Gram", district: "Mirzapur", state: "Uttar Pradesh", lat: 25.1451, lng: 82.5688, population: 2100, households: 350, overallScore: 2, scores: generateVillageScores(14), images: getVillageImages(13) },
  { id: "v15", name: "Varanasi Village", district: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739, population: 5600, households: 940, overallScore: 5, scores: generateVillageScores(15), images: getVillageImages(14) },
  { id: "v16", name: "Ghazipur Gram", district: "Ghazipur", state: "Uttar Pradesh", lat: 25.5837, lng: 83.5777, population: 1700, households: 280, overallScore: 2, scores: generateVillageScores(16), images: getVillageImages(15) },
  { id: "v17", name: "Buxar Village", district: "Buxar", state: "Bihar", lat: 25.5638, lng: 83.9785, population: 2400, households: 400, overallScore: 3, scores: generateVillageScores(17), images: getVillageImages(16) },
  { id: "v18", name: "Patna Gram", district: "Patna", state: "Bihar", lat: 25.6093, lng: 85.1376, population: 6200, households: 1040, overallScore: 2, scores: generateVillageScores(18), images: getVillageImages(17) },
  { id: "v19", name: "Munger Village", district: "Munger", state: "Bihar", lat: 25.3708, lng: 86.4735, population: 2000, households: 330, overallScore: 1, scores: generateVillageScores(19), images: getVillageImages(18) },
  { id: "v20", name: "Bhagalpur Gram", district: "Bhagalpur", state: "Bihar", lat: 25.2425, lng: 86.9842, population: 3100, households: 520, overallScore: 4, scores: generateVillageScores(20), images: getVillageImages(19) },
];