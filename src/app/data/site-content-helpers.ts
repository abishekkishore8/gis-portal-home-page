import type { SiteContent } from './site-content';

export function getSolutionsForCategory(siteContent: SiteContent, categoryName: string) {
  return siteContent.solutions.filter((solution) => solution.indicator === categoryName);
}

export function getSolutionLevel(scoreOnScale10: number): 'low' | 'medium' | 'high' {
  if (scoreOnScale10 <= 2.0) {
    return 'low';
  }

  if (scoreOnScale10 <= 3.5) {
    return 'medium';
  }

  return 'high';
}