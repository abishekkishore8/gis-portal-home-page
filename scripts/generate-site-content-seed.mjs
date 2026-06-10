import { writeFile } from 'node:fs/promises';
import { solutions } from '../src/app/data/solutions.ts';

const siteContent = {
  heroImage:
    'https://images.unsplash.com/photo-1576516816755-705b4b24df2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHYW5nZXMlMjByaXZlciUyMEluZGlhJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MjQ0NjM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  heroEyebrow: 'Namami Gange Programme',
  heroTitle: 'Village Microplaning',
  heroDescription:
    'Comprehensive assessment of villages along the Ganga River basin, covering key development categories across multiple states.',
  aboutTitle: 'About the Microplan',
  aboutBody:
    'The Ganga River Basin Microplan is a comprehensive assessment initiative that evaluates villages along the river on critical parameters including community awareness, sanitation, agriculture practices, biodiversity conservation, renewable energy adoption, and more. Each village is scored on a 1-5 scale across 9 categories, enabling targeted interventions and solutions.',
  focusTitle: 'Key Focus Areas',
  focusBlurb:
    '9 assessment categories with expandable sub-indicators and tailored solutions mapped to Low / Medium / High score levels.',
  galleryTitle: 'From the Ganga River Basin',
  mapTitle: 'Interactive Village Map',
  mapDescription: 'Click any village point to navigate to its detailed assessment',
  topVillagesTitle: 'Top-Scored Villages',
  partnerLogos: [
    {
      src: '/Ministry_of_Jal_Shakti.png',
      alt: 'Ministry of Jal Shakti logo',
    },
    {
      src: '/WII-LogoMaroon%20(1).png',
      alt: 'WII logo',
    },
    {
      src: '/nmcgGif.gif',
      alt: 'NMCG logo',
    },
    {
      src: '/Arth%20Ganga%20eng%20logo.png',
      alt: 'Arth Ganga logo',
    },
  ],
  photoGallery: [
    {
      src: 'https://images.unsplash.com/photo-1701619879211-e03adf1993a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMGdoYXQlMjByaXZlciUyMEdhbmdlc3xlbnwxfHx8fDE3NzI0NDYzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Varanasi Ghats - Sacred River Steps',
    },
    {
      src: 'https://images.unsplash.com/photo-1720819029162-8500607ae232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSaXNoaWtlc2glMjByaXZlciUyMGJyaWRnZSUyMEluZGlhfGVufDF8fHx8MTc3MjQ0NjM2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Rishikesh - Gateway to the Himalayas',
    },
    {
      src: 'https://images.unsplash.com/photo-1722067487813-3650fb50f028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVdHRhcmFraGFuZCUyMG1vdW50YWluJTIwcml2ZXIlMjBIaW1hbGF5YXxlbnwxfHx8fDE3NzI0NDYzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Uttarakhand - Himalayan River Origins',
    },
    {
      src: 'https://images.unsplash.com/photo-1552559590-952a24ab39ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMHJpdmVyJTIwc3VucmlzZSUyMGJvYXR8ZW58MXx8fHwxNzcyNDQ2MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Sunrise on the Ganga - Daily Life',
    },
  ],
  focusAreas: [
    { icon: 'Leaf', label: 'Community Awareness', color: 'bg-green-100 text-green-600' },
    { icon: 'Droplets', label: 'Hygiene & Sanitation', color: 'bg-blue-100 text-blue-600' },
    { icon: 'Target', label: 'Renewable Energy', color: 'bg-amber-100 text-amber-600' },
    { icon: 'TreePine', label: 'Biodiversity', color: 'bg-emerald-100 text-emerald-600' },
    { icon: 'Wheat', label: 'Agriculture/organic farming practice', color: 'bg-yellow-100 text-yellow-600' },
    { icon: 'Factory', label: 'Pollution reduction mechanism', color: 'bg-gray-100 text-gray-600' },
    { icon: 'Waves', label: 'River flow/river structure', color: 'bg-cyan-100 text-cyan-600' },
    { icon: 'Users', label: 'Community Based Institution', color: 'bg-indigo-100 text-indigo-600' },
    { icon: 'GraduationCap', label: 'Skill development in area', color: 'bg-purple-100 text-purple-600' },
  ],
  solutions,
};

const sqlValue = JSON.stringify(siteContent).replace(/'/g, "''");

const sql = `insert into public.site_content (key, content)
values (
  'homepage',
  '${sqlValue}'::jsonb
)
on conflict (key) do update set
  content = excluded.content;
`;

await writeFile(new URL('../supabase/site-content.seed.sql', import.meta.url), sql, 'utf8');

console.log(`Generated site content seed with ${solutions.length} solution entries.`);