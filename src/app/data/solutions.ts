export interface SolutionEntry {
  sNo: number;
  indicator: string;
  indicatorCode: string;
  subIndicator: string;
  subIndicatorCode: string;
  solutionsLow: string[];   // for score 1-2
  solutionsMedium: string[]; // for score 3-4
  solutionsHigh: string[];   // for score 5-6
}

export const solutions: SolutionEntry[] = [
  {
    sNo: 1,
    indicator: "Community Awareness",
    indicatorCode: "MP01",
    subIndicator: "Awareness on construction and use of toilets",
    subIndicatorCode: "MP0101",
    solutionsLow: [
      "Meetings with local communities, Panchayat members, women and youth groups etc.",
      "Campaigns, rallies, street plays and wall paintings on importance of cleanliness and harmful effects of open defecation",
      "Awareness on various government schemes and concerned departments",
      "Liaison with concerned departments, block and district administration",
      "Showcase of films and documentaries and telecast of radio shows",
      "Awareness programs and workshops in schools",
    ],
    solutionsMedium: [
      "Meetings with local communities, Panchayat members, women and youth groups etc.",
      "Awareness on various government schemes and concerned departments",
      "Liaison with concerned departments, block and district administration",
      "Showcase films and documentaries and telecast radio shows",
    ],
    solutionsHigh: [
      "Training of community members for sensitizing other community members for toilet construction",
      "Regular onsite cleanliness and awareness activities",
      "Liaison with concerned departments, block and district administration",
    ],
  },
  {
    sNo: 2,
    indicator: "Community Awareness",
    indicatorCode: "MP01",
    subIndicator: "Awareness on solid and liquid waste management",
    subIndicatorCode: "MP0102",
    solutionsLow: [
      "Meetings on importance of solid and liquid waste management",
      "Campaigns, street plays and wall paintings",
      "Awareness on various government schemes and concerned departments",
      "Liaison with concerned departments, block and district administration",
      "Awareness programs and workshops in schools",
      "Showcase of films and documentaries and telecast of radio shows",
    ],
    solutionsMedium: [
      "Meetings on importance of solid and liquid waste management",
      "Wall writing and street plays",
      "Awareness on various government schemes and concerned departments",
      "Liaison with concerned departments, block and district administration",
      "Awareness programs and workshops in schools",
    ],
    solutionsHigh: [
      "Training of community members for sensitizing other community members on waste management",
      "Liaison with concerned departments, block and district administration",
      "Training of community members for making value products from waste",
    ],
  },
  {
    sNo: 3,
    indicator: "Community Awareness",
    indicatorCode: "MP01",
    subIndicator: "Awareness on renewable energy schemes, department and line agencies",
    subIndicatorCode: "MP0103",
    solutionsLow: [
      "Community level meetings with the involvement of concerned department",
      "Awareness on importance and use of renewable energy",
      "Liaison with concerned departments, block and district administration for training and installation",
    ],
    solutionsMedium: [
      "Community level meetings with the involvement of concerned department",
      "Awareness on importance and use of renewable energy",
      "Liaison with concerned departments, block and district administration for training and installation",
    ],
    solutionsHigh: [
      "Training of community members for sensitizing other community members to use renewable energy",
      "Exploring use of renewable energy at village level i.e Street light, solar pumps etc.",
      "Liaison with concerned departments, block and district administration for training and installation",
    ],
  },
  {
    sNo: 4,
    indicator: "Community Based Institution",
    indicatorCode: "MP02",
    subIndicator: "Frequency of meetings Scale",
    subIndicatorCode: "MP0201",
    solutionsLow: [
      "Awareness meetings on importance of CBOs",
      "Initiate formation of local level institutions",
      "Discussion of project objectives with the group",
      "Motivate and train office bearers of the institution to carry out activities on biodiversity conservation",
      "Ensure participation of women and marginal communities",
    ],
    solutionsMedium: [
      "Strengthening of local level institutions/groups",
      "Discussion of program objectives with the group",
      "Motivate and train office bearers of the institution to encourage community to join in the conservation efforts",
      "Ensure participation of women and marginal communities",
      "Incorporation of conservation goals in the agenda of the institution",
    ],
    solutionsHigh: [
      "Motivate and train office bearers of the institution to encourage community to join in the conservation efforts",
      "Ensure participation of women and marginal communities",
      "Incorporation of conservation goals in the agenda of the institution",
    ],
  },
  {
    sNo: 5,
    indicator: "Community Based Institution",
    indicatorCode: "MP02",
    subIndicator: "Representation of women and marginal Community",
    subIndicatorCode: "MP0202",
    solutionsLow: [
      "Awareness meetings on importance of institutions",
      "Initiate formation of local level institutions/groups",
      "Ensure participation of marginal communities in the institutions formed",
      "Meetings and trainings with the group to discuss project objectives and activities",
    ],
    solutionsMedium: [
      "Awareness meetings on importance of institutions",
      "Strengthening of local level institutions/groups",
      "Meetings and trainings with the group to discuss project objectives and activities",
    ],
    solutionsHigh: [
      "Train women to motivate other women to participate in activities conducted by local level institutions",
      "Increase women participation in the institution and train them to prepare conservation and development plans",
    ],
  },
  {
    sNo: 6,
    indicator: "Livelihood and Skill Development",
    indicatorCode: "MP03",
    subIndicator: "Scheme Implemented",
    subIndicatorCode: "MP0301",
    solutionsLow: [
      "Awareness on various livelihood, skill development schemes and conservation sensitive programmes",
      "Training Need Assessment",
      "Motivate various groups of local communities to participate in livelihood, skill development and conservation related initiatives",
      "Interaction with district and block administration regarding potential trainings",
      "Link communities directly dependent on the Ganga River with various skill development programs",
      "Link trained women and members with subsidies and loan programmes",
    ],
    solutionsMedium: [
      "Motivate various groups of local communities to participate in initiatives",
      "Link communities directly dependent on the Ganga River with different livelihood schemes",
      "Interaction with district and block administration regarding potential trainings",
      "Link trained women and members with subsidies and loan programmes",
    ],
    solutionsHigh: [
      "Link trained women and members with subsidies and loan programmes",
      "Promote locally made products using local produce",
      "Motivate women to take livelihood and skill development trainings",
      "Facilitate Bank linkages and linkages with other agencies and training institutes",
    ],
  },
  {
    sNo: 7,
    indicator: "Livelihood and Skill Development",
    indicatorCode: "MP03",
    subIndicator: "Benefit through training centers",
    subIndicatorCode: "MP0302",
    solutionsLow: [
      "Interaction with district and block administration regarding potential trainings",
      "Link trained women and members with subsidies and loan programmes",
      "Motivate more women to participate in livelihood and skill development trainings",
      "Establish market for the products",
      "Encourage traditional farming and farming methods",
    ],
    solutionsMedium: [
      "Interaction with district and block administration regarding potential trainings",
      "Link trained women and members with subsidies and loan programmes",
      "Establish market for the products",
    ],
    solutionsHigh: [
      "Train women to make value added products and enhancing of entrepreneurial skills",
      "Linking the group with NGOs and institutes for imparting training and marketing of products",
      "Exposure to advanced training centers",
    ],
  },
  {
    sNo: 8,
    indicator: "Livelihood and Skill Development",
    indicatorCode: "MP03",
    subIndicator: "Representation of women in centers",
    subIndicatorCode: "MP0303",
    solutionsLow: [
      "Awareness on various livelihood and skill development schemes through meetings and workshops",
      "Motivate and encourage women to participate in trainings",
      "Link trained women with subsidies and loan programmes",
      "Establish market for the products",
    ],
    solutionsMedium: [
      "Motivate and encourage women to participate in trainings",
      "Link trained women with subsidies and loan programmes",
      "Establish market for the products",
    ],
    solutionsHigh: [
      "Motivate more women to take livelihood and skill development trainings",
      "Introduce new and advanced livelihood and skill development workshops and green entrepreneur trainings",
    ],
  },
  {
    sNo: 9,
    indicator: "Hygiene and Sanitation",
    indicatorCode: "MP04",
    subIndicator: "Construction and use of toilets",
    subIndicatorCode: "MP0401",
    solutionsLow: [
      "Awareness through meetings, campaigns on hygiene and sanitation, use of toilets, impact on river and human health",
      "Wall paintings and slogan writing",
      "Liaison with district and block administration for construction of toilets in villages",
    ],
    solutionsMedium: [
      "Awareness on hygiene and sanitation through meetings, campaigns and wall paintings",
      "Liaison with district and block administration for construction of toilets in villages",
    ],
    solutionsHigh: [
      "Motivate households without toilet to construct and use toilets",
      "Liaison with district and block administration for construction of toilets in villages",
    ],
  },
  {
    sNo: 10,
    indicator: "Hygiene and Sanitation",
    indicatorCode: "MP04",
    subIndicator: "Access to dustbin installed by panchayat",
    subIndicatorCode: "MP0402",
    solutionsLow: [
      "Awareness on use of dustbins",
      "Liaison with department for installation of dustbins",
      "Initiate fine and penalties with the support of Gram Panchayat",
    ],
    solutionsMedium: [
      "Liaison with department for installation of dustbins",
      "Initiate fine and penalties with the support of Gram Panchayat",
      "Awareness on use of dustbins",
    ],
    solutionsHigh: [
      "Liaison with department for installation of dustbins",
      "Initiate fine and penalties with the support of Gram Panchayat",
    ],
  },
  {
    sNo: 11,
    indicator: "Hygiene and Sanitation",
    indicatorCode: "MP04",
    subIndicator: "Solid and liquid waste management",
    subIndicatorCode: "MP0403",
    solutionsLow: [
      "Awareness on biodegradable and non-biodegradable waste",
      "Awareness on importance of segregation of waste",
      "Installation of dustbins in village and at ghats",
      "Ensure proper use of dustbins and regular cleanliness drives",
      "Persuade Gram Panchayat to identify and establish waste dumping ground",
    ],
    solutionsMedium: [
      "Awareness on importance of segregation of biodegradable and non-biodegradable waste",
      "Ensure proper use of dustbins and regular cleanliness drives especially during festivals",
    ],
    solutionsHigh: [
      "Encourage local communities to segregate and re-use waste at household level",
      "Recognition or appreciation by Block and District Administration",
      "Training on preparation of products from waste (Value to Waste)",
    ],
  },
  {
    sNo: 12,
    indicator: "Renewable Energy",
    indicatorCode: "MP05",
    subIndicator: "Dependence on fuel wood",
    subIndicatorCode: "MP0501",
    solutionsLow: [
      "Awareness on renewable sources of energy",
      "Motivate community to install renewable energy devices",
      "Liaison with State New and Renewable Energy Development Agency",
      "Train local communities in protocols for using renewable energy",
    ],
    solutionsMedium: [
      "Motivate community to install renewable energy devices",
      "Liaison with State New and Renewable Energy Development Agency",
      "Train local communities in using renewable energy in daily life",
    ],
    solutionsHigh: [
      "Training of community members for motivating other members for installation of renewable energy source",
      "Liaison with State New and Renewable Energy Development Agency",
    ],
  },
  {
    sNo: 13,
    indicator: "Renewable Energy",
    indicatorCode: "MP05",
    subIndicator: "Accessibility to renewable energy sources",
    subIndicatorCode: "MP0502",
    solutionsLow: [
      "Awareness on government schemes regarding renewable energy",
      "Liaison with State New and Renewable Energy Development Agency",
      "Train local communities in protocols for using renewable energy",
    ],
    solutionsMedium: [
      "Awareness on government schemes regarding renewable energy",
      "Liaison with State New and Renewable Energy Development Agency",
      "Train local communities in protocols for using renewable energy",
    ],
    solutionsHigh: [
      "Liaison with State New and Renewable Energy Development Agency",
      "Train local communities in protocols for using renewable energy",
    ],
  },
  {
    sNo: 14,
    indicator: "Biodiversity Conservation Plan",
    indicatorCode: "MP06",
    subIndicator: "Activities for biodiversity conservation",
    subIndicatorCode: "MP0601",
    solutionsLow: [
      "Frequent awareness programmes on ecological and social diversity and conservation issues of the Ganga River",
      "Training of local communities in Ganga conservation activities such as awareness, surveys, rescue etc.",
      "Contact and liaison with forest department and line agencies for plantation, rescue of aquatic wildlife",
      "On-site plantation, wetland restoration etc.",
    ],
    solutionsMedium: [
      "Awareness programmes on ecological and social diversity and conservation issues",
      "Training of local communities in Ganga conservation activities",
      "Liaison with forest department and line agencies for plantation",
      "On-site plantation, wetland restoration etc.",
    ],
    solutionsHigh: [
      "Development of model demonstration sites",
      "Development of conservation plans with the involvement of biodiversity management committees",
    ],
  },
  {
    sNo: 15,
    indicator: "Biodiversity Conservation Plan",
    indicatorCode: "MP06",
    subIndicator: "Formation and strengthening of Biodiversity Management Committees (BMC)",
    subIndicatorCode: "MP0602",
    solutionsLow: [
      "Awareness programmes on ecological and social diversity for local communities",
      "Initiate the formation of BMCs",
      "Regular meetings with BMCs for discussing Ganga conservation issues",
      "Liaison with forest department",
      "Training of BMCs on Ganga conservation activities",
    ],
    solutionsMedium: [
      "Initiate the formation of BMCs",
      "Regular meetings with BMCs",
      "Training of BMCs on conservation activities",
    ],
    solutionsHigh: [
      "Strengthening of BMCs",
      "Development of conservation plans with BMC involvement",
    ],
  },
  {
    sNo: 16,
    indicator: "Agriculture",
    indicatorCode: "MP07",
    subIndicator: "Organic farming",
    subIndicatorCode: "MP0701",
    solutionsLow: [
      "Awareness on impacts of chemical fertilizers and pesticides",
      "Awareness on benefits of organic farming",
      "Training on organic farming",
      "Liaison with agriculture department",
      "Organize visit of trainers from agriculture and horticulture department",
    ],
    solutionsMedium: [
      "Training on organic farming",
      "Awareness programmes on use of high productivity crops",
      "Organize visit of trainers and personals from agriculture department",
      "Liaison with forest department and line agencies",
      "Encourage farming of traditional crops and cropping techniques",
    ],
    solutionsHigh: [
      "Awareness programmes on use of high productivity crops",
      "Awareness programmes on climate smart technologies in agriculture",
      "Organize visit of trainers from agriculture and horticulture department",
      "Encourage use of vermi compost and bio-compost",
      "Encourage farming of traditional crops and cropping techniques",
    ],
  },
  {
    sNo: 17,
    indicator: "Agriculture",
    indicatorCode: "MP07",
    subIndicator: "Riverbed farming",
    subIndicatorCode: "MP0702",
    solutionsLow: [
      "Encourage use of vermi-compost and bio-compost and construction of vermi-compost pit",
    ],
    solutionsMedium: [
      "Awareness on benefits of organic farming",
      "Encourage use of vermi-compost and bio-compost and construction of vermi-compost pit",
    ],
    solutionsHigh: [
      "Encourage use of vermi-compost and bio-compost and construction of vermi-compost pit",
    ],
  },
  {
    sNo: 18,
    indicator: "Animal Husbandry",
    indicatorCode: "MP08",
    subIndicator: "Conservation of species habitat",
    subIndicatorCode: "MP0801",
    solutionsLow: [
      "Awareness on conservation of river bank vegetation",
      "Awareness on high productivity breeds and high nutritional fodder",
      "On-site plantation of grass and fodder species on private and common land",
      "Organize regular vaccinations camps",
      "Liaison with concerned department and organizations",
      "Orientation to other livestock rearing interventions such as goatry and poultry",
    ],
    solutionsMedium: [
      "Awareness on conservation of river bank vegetation",
      "Awareness on high productivity breeds and high nutritional fodder",
      "On-site plantation of grass and fodder species",
      "Liaison with concerned department and organizations",
      "Orientation to other livestock rearing interventions",
    ],
    solutionsHigh: [
      "Liaison with concerned department and organizations",
      "Orientation to other livestock rearing intervention such as goatry and poultry",
    ],
  },
  {
    sNo: 19,
    indicator: "Fishery",
    indicatorCode: "MP09",
    subIndicator: "Sustainable fishing",
    subIndicatorCode: "MP0901",
    solutionsLow: [
      "Awareness meetings on impact of unsustainable fishing on Ganga biodiversity conservation",
      "Awareness on schemes on sustainable fishing and use of proper fishing gear",
      "Encourage and motivate local communities for adopting pisciculture",
      "Awareness on rules and regulations on fishing",
      "Liaison with department of fishery at District administration",
    ],
    solutionsMedium: [
      "Awareness meetings on impact of unsustainable fishing on Ganga biodiversity conservation",
      "Awareness on schemes on sustainable fishing and use of proper fishing gears",
      "Encourage and motivate local communities for adopting pisciculture",
      "Liaison with fishery department at District administration",
    ],
    solutionsHigh: [
      "Awareness on schemes on sustainable fishing and use of proper fishing gears",
      "Encourage and motivate local communities for adopting pisciculture",
      "Liaison with fishery department at District administration",
    ],
  },
];

export function getSolutionsForCategory(categoryName: string, scoreOnScale5: number): SolutionEntry[] {
  const categoryMap: Record<string, string> = {
    "Community Awareness": "Community Awareness",
    "Community Based Institution": "Community Based Institution",
    "Livelihood and Skill Development": "Livelihood and Skill Development",
    "Hygiene and Sanitation": "Hygiene and Sanitation",
    "Renewable Energy": "Renewable Energy",
    "Biodiversity Conservation Plan": "Biodiversity Conservation Plan",
    "Agriculture": "Agriculture",
    "Animal Husbandry": "Animal Husbandry",
    "Fishery": "Fishery",
  };

  const mappedName = categoryMap[categoryName] || categoryName;
  return solutions.filter(s => s.indicator === mappedName);
}

export function getSolutionLevel(scoreOnScale5: number): "low" | "medium" | "high" {
  if (scoreOnScale5 <= 2) return "low";
  if (scoreOnScale5 <= 4) return "medium";
  return "high";
}
