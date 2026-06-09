export interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  households: number;
  overallScore: number;
  scores: CategoryScore[];
  images: string[];
}

export interface CategoryScore {
  category: string;
  output: string;
  scoreOnScale10: number;
  formulaTotal: number;
  rankingFormula?: string;
  subCategories: SubCategoryScore[];
}

export interface SubCategoryScore {
  subCategory: string;
  score: number;
  maxScore: number;
  individualScore: number;
  formulaValue: number;
  formulaExpression?: string;
  indicators: IndicatorScore[];
}

export interface IndicatorScore {
  name: string;
  maxIndividualScore: number;
  individualScore: number;
}