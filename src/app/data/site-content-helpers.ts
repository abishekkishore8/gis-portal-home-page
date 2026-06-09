import type { SiteContent } from './site-content';

export function getSolutionsForCategory(siteContent: SiteContent, categoryName: string) {
  return siteContent.solutions.filter((solution) => solution.indicator === categoryName);
}

export function getSolutionLevel(scoreOnScale10: number): 'low' | 'medium' | 'high' {
  if (scoreOnScale10 <= 4) {
    return 'low';
  }

  if (scoreOnScale10 <= 7) {
    return 'medium';
  }

  return 'high';
}