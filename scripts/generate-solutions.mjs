import { fileURLToPath } from 'node:url';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const mainWorkbookPath = path.join(rootDir, 'Digital Microplanning.xlsx');
const solutionsFilePath = path.join(rootDir, 'src', 'app', 'data', 'solutions.ts');

const categoryMap = {
  "1. Awareness and Capacity Building": "Community Awareness",
  "2. Community-Based Institutions": "Community Based Institution",
  "3. Sanitation and Waste Management": "Hygiene and Sanitation",
  "4. Livelihood and Skill Development": "Livelihood and Skill Development",
  "5. Alternative Energy": "Renewable Energy",
  "6. Agriculture": "Agriculture",
  "7. Livestock Management": "Animal Husbandry",
  "8. Fisheries Management": "Fishery",
  "9. Biodiversity and Habitat Management": "Biodiversity Conservation Plan"
};

// Generic highly professional solutions template pool for each category
const solutionsPool = {
  "Community Awareness": {
    low: [
      "Organize intensive village-level meetings, street rallies (Prabhat Pheri), and street plays (Nukkad Natak) to build awareness.",
      "Conduct school-level essay, painting, and quiz competitions to sensitize the younger generation.",
      "Install informative wall paintings, billboards, and posters in key public spaces.",
      "Liaise with local government lines and NGOs to distribute brochures and booklets."
    ],
    medium: [
      "Conduct regular audio-visual sessions, documentary screenings, and interactive workshops.",
      "Establish village-level eco-clubs and volunteer task forces (Ganga Praharis) for active messaging.",
      "Organize exposure visits to successfully transitioned model villages.",
      "Engage religious and community leaders to influence positive behavior."
    ],
    high: [
      "Train local youth and community members as certified environment leaders to train others.",
      "Liaise with district administration for implementing high-impact, state-level awareness programs.",
      "Establish local community resource centers to monitor environmental indicators."
    ]
  },
  "Community Based Institution": {
    low: [
      "Initiate the formation of self-help groups (SHGs), Joint Forest Management Committees, or Biodiversity Management Committees (BMCs).",
      "Conduct capacity-building training on leadership, bookkeeping, and group dynamics for institutional heads.",
      "Mobilize community members through door-to-door visits to explain CBO benefits.",
      "Collaborate with the local Panchayat to secure meeting spaces."
    ],
    medium: [
      "Establish strict schedules for weekly or bi-weekly meetings and document minutes.",
      "Ensure mandatory representation and active participation of women, youth, and marginal sections.",
      "Align CBO activities with local development plans and Panchayat goals.",
      "Provide skill-upgradation workshops for active members."
    ],
    high: [
      "Establish direct institutional linkages with government departments and national schemes.",
      "Set up dedicated community funds to finance local development and conservation projects.",
      "Establish cross-village networks of CBOs to share best practices and resources."
    ]
  },
  "Hygiene and Sanitation": {
    low: [
      "Launch intensive village cleanliness drives (Swachhta Abhiyan) targeting common dumpsites.",
      "Ensure 100% individual household latrine (IHHL) coverage through government schemes.",
      "Conduct wall writing campaigns to discourage open defecation and open urination.",
      "Liaise with district authorities to build public toilets at crowded hubs."
    ],
    medium: [
      "Establish a segregated solid waste collection system with separate wet and dry dustbins.",
      "Build community compost pits for biodegradable waste processing.",
      "Introduce regular greywater and drainage cleaning schedules using organic cleansers.",
      "Organize regular health camps to emphasize the link between sanitation and health."
    ],
    high: [
      "Establish decentralized MRF (Material Recovery Facility) for plastic recycling and sale.",
      "Build constructed wetlands or phytorid systems for community wastewater treatment.",
      "Establish a self-sustaining cooperative model for public toilet maintenance and user-charge collection."
    ]
  },
  "Livelihood and Skill Development": {
    low: [
      "Organize baseline skill-assessment camps to identify youth and women aspirations.",
      "Connect eligible villagers to state skill-development missions and livelihood programs.",
      "Form livelihood-specific self-help groups and provide micro-credit linkages.",
      "Provide fundamental vocational training (tailoring, organic food processing, handicrafts)."
    ],
    medium: [
      "Promote sustainable, nature-based alternative livelihoods (mushroom cultivation, honey harvesting, eco-tourism).",
      "Form farmer producer organizations (FPOs) and artisanal cooperatives to purchase inputs in bulk.",
      "Establish local marketing hubs or stalls for selling village products.",
      "Organize business management and financial literacy workshops."
    ],
    high: [
      "Establish direct digital marketing and e-commerce linkages for local products.",
      "Facilitate organic and fair-trade certifications to fetch premium prices in urban markets.",
      "Form micro-enterprises and community co-operatives for sustainable value addition."
    ]
  },
  "Renewable Energy": {
    low: [
      "Distribute fuel-efficient clean cookstoves (Chulha) and promote smokeless kitchens.",
      "Organize LPG connection registration camps under government subsidy schemes.",
      "Conduct solar street light mapping for important public areas.",
      "Run campaigns highlighting health and environmental impacts of biomass burning."
    ],
    medium: [
      "Install solar home lighting systems and solar lanterns for low-income households.",
      "Set up community biogas (gobar gas) plants linked to common dairy sheds.",
      "Provide technical training to local youth for solar system installation and repair.",
      "Advocate for solar energy subsidies in local administrative meetings."
    ],
    high: [
      "Transition agricultural irrigation pumps to solar-powered systems.",
      "Establish solar micro-grids for self-sufficient village electricity.",
      "Transition community centers, schools, and health clinics to 100% solar power."
    ]
  },
  "Agriculture": {
    low: [
      "Promote natural and low-chemical farming techniques to reduce fertilizer reliance.",
      "Conduct soil-testing camps to optimize nutrient application.",
      "Enforce strict rules against farming on vulnerable riverbanks to prevent erosion.",
      "Promote basic composting and organic manure production."
    ],
    medium: [
      "Introduce micro-irrigation systems (drip and sprinkler) to conserve water.",
      "Train farmers in advanced organic farming, crop rotation, and bio-pest control.",
      "Promote climate-resilient and low-water-use crop varieties.",
      "Establish vermicompost production units at the household level."
    ],
    high: [
      "Link local organic produce to premium markets and organic retail brands.",
      "Deploy smart-agriculture technologies like soil-moisture sensors and automated irrigation.",
      "Establish organic seed banks and organic research model farms."
    ]
  },
  "Animal Husbandry": {
    low: [
      "Construct animal shelters and waste pits away from riverine habitats and water sources.",
      "Promote stall-feeding (zero grazing) to protect sensitive river banks from erosion.",
      "Conduct regular animal vaccination and deworming camps.",
      "Promote green fodder cultivation in household backyards."
    ],
    medium: [
      "Form dairy cooperatives to pool milk and ensure better pricing.",
      "Train farmers in balanced feed formulation and organic livestock management.",
      "Support standard cross-breeding and indigenous high-yielding breeds.",
      "Set up silage-making units for year-round quality feed availability."
    ],
    high: [
      "Link dairy waste to large-scale biogas generation and vermicomposting enterprises.",
      "Establish temperature-controlled dairy storage and automatic milk testers.",
      "Launch organic milk and dairy product brands with regional retail ties."
    ]
  },
  "Fishery": {
    low: [
      "Enforce strict bans on unsustainable gears like mosquito nets (Mariya) and dynamite/poison.",
      "Enforce closed seasons during the fish breeding period to restore stock.",
      "Form community-patrolling groups to monitor local fish landing sites.",
      "Conduct workshops on sustainable catch sizes."
    ],
    medium: [
      "Provide training and credit support for private pond-based pisciculture.",
      "Promote community-owned pen culture and cage culture in suitable water bodies.",
      "Establish community hatcheries to supply quality, native fingerlings.",
      "Form fish-marketing cooperatives to reduce middleman exploitation."
    ],
    high: [
      "Develop high-value ornamental fish breeding and trade units for self-employment.",
      "Establish solar-powered cold storage units at landing sites to prevent spoilage.",
      "Establish direct logistics supply chains to urban fish markets."
    ]
  },
  "Biodiversity Conservation Plan": {
    low: [
      "Demarcate critical nesting, breeding, and spawning grounds of key species.",
      "Restore local riparian vegetation by planting native trees (bamboo, willow).",
      "Organize community guards to prevent illegal wildlife poaching and sand mining.",
      "Install warning and educational signage at key biodiversity hotspots."
    ],
    medium: [
      "Incorporate conservation rules directly into village Panchayat bylaws.",
      "Control and remove invasive weed species (water hyacinth, lantana) from wetlands.",
      "Draft and maintain the People's Biodiversity Register (PBR) regularly.",
      "Establish low-impact nature trails and eco-tourism guidelines."
    ],
    high: [
      "Establish community-managed biodiversity conservation reserves.",
      "Deploy automated camera traps and drone monitoring for habitat vigilance.",
      "Liaise with national scientific agencies for wildlife tracking and data research."
    ]
  }
};

async function run() {
  console.log('Reading Indicators sheet from Digital Microplanning.xlsx...');
  const wb = xlsx.readFile(mainWorkbookPath);
  const sheet = wb.Sheets['Indicators'];
  const range = xlsx.utils.decode_range(sheet['!ref']);

  const rows = [];
  for (let r = 0; r <= range.e.r; r++) {
    const c0 = sheet[xlsx.utils.encode_cell({ r, c: 0 })]?.v || '';
    const c1 = sheet[xlsx.utils.encode_cell({ r, c: 1 })]?.v || '';
    rows.push({ r, c0, c1 });
  }

  // Parse the 59 indicators
  const indicatorsList = [];
  let currentCategory = '';
  let indicatorCodeCounter = 1;
  let subIndicatorCodeCounter = 1;

  for (const row of rows) {
    const c0Str = String(row.c0).trim();
    const c1Str = String(row.c1).trim();

    // Check if this is a Category row
    const catMatch = Object.keys(categoryMap).find(key => c0Str.includes(key) || c1Str.includes(key));
    if (catMatch) {
      currentCategory = categoryMap[catMatch];
      indicatorCodeCounter = Object.values(categoryMap).indexOf(currentCategory) + 1;
      subIndicatorCodeCounter = 1;
      continue;
    }

    // Check if it's an indicator row (c0 is numeric, and c1 is not legend row)
    const isLegend = c1Str.includes('Good') || c1Str.includes('Moderate') || c1Str.includes('Poor') || c1Str.includes('Very');
    const isNumeric = typeof row.c0 === 'number' || (typeof row.c0 === 'string' && /^\d+$/.test(c0Str));
    
    if (isNumeric && !isLegend && currentCategory) {
      const codeStr = String(indicatorCodeCounter).padStart(2, '0');
      const subCodeStr = String(subIndicatorCodeCounter).padStart(2, '0');

      indicatorsList.push({
        indicator: currentCategory,
        indicatorCode: `MP${codeStr}`,
        subIndicator: c1Str,
        subIndicatorCode: `MP${codeStr}${subCodeStr}`
      });

      subIndicatorCodeCounter++;
    }
  }

  console.log(`Parsed ${indicatorsList.length} indicators from sheet.`);

  // Generate Solutions Entries
  const solutions = indicatorsList.map((ind, index) => {
    const pool = solutionsPool[ind.indicator];
    return {
      sNo: index + 1,
      indicator: ind.indicator,
      indicatorCode: ind.indicatorCode,
      subIndicator: ind.subIndicator,
      subIndicatorCode: ind.subIndicatorCode,
      solutionsLow: pool?.low || [],
      solutionsMedium: pool?.medium || [],
      solutionsHigh: pool?.high || []
    };
  });

  // Write solutions.ts file
  const fileContent = `export interface SolutionEntry {
  sNo: number;
  indicator: string;
  indicatorCode: string;
  subIndicator: string;
  subIndicatorCode: string;
  solutionsLow: string[];   // for score 0-2.0
  solutionsMedium: string[]; // for score 2.01-3.5
  solutionsHigh: string[];   // for score 3.51-5.0
}

export const solutions: SolutionEntry[] = ${JSON.stringify(solutions, null, 2)};
`;

  fs.writeFileSync(solutionsFilePath, fileContent, 'utf8');
  console.log(`✓ Successfully updated ${solutionsFilePath} with all ${solutions.length} indicators!`);
}

run();