import { Episode } from '../types';

const HLS_STREAM_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export const episodes: Episode[] = [
  {
    id: 'ep-001',
    slug: 'future-of-central-banking',
    title: 'The Future of Central Banking',
    description:
      'As inflation reshapes global economies, central banks face their most complex challenge in decades. We examine how monetary policy is evolving and what it means for ordinary people caught in the crossfire of rate decisions.',
    type: 'podcast',
    duration: 2730, // 45:30
    publishedAt: '2025-01-15T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-001/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['why-democracy-is-stalling', 'inside-the-ai-arms-race', 'chinas-economic-crossroads'],
  },
  {
    id: 'ep-002',
    slug: 'why-democracy-is-stalling',
    title: 'Why Democracy is Stalling',
    description:
      'From Budapest to Brasília, democratic institutions are under unprecedented strain. We investigate the structural forces eroding trust in governments and explore whether liberal democracy can adapt fast enough to survive.',
    type: 'podcast',
    duration: 3120, // 52:00
    publishedAt: '2025-01-22T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-002/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['future-of-central-banking', 'new-cold-war-in-tech', 'mapping-worlds-water-crisis'],
  },
  {
    id: 'ep-003',
    slug: 'inside-the-ai-arms-race',
    title: 'Inside the AI Arms Race',
    description:
      'OpenAI, Google DeepMind, and Anthropic are locked in a race with existential stakes. We go inside the labs, talk to the researchers, and ask: who decides when artificial general intelligence is too dangerous to release?',
    type: 'podcast',
    duration: 3600, // 60:00
    publishedAt: '2025-02-05T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-003/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['semiconductor-decade', 'new-cold-war-in-tech', 'future-of-central-banking'],
  },
  {
    id: 'ep-004',
    slug: 'climate-finance-gap',
    title: 'The Climate Finance Gap',
    description:
      'Developing nations need $2.4 trillion annually to meet climate targets, yet wealthy countries have repeatedly fallen short of their pledges. We follow the money — and the accountability gap — from COP summits to frontline communities.',
    type: 'podcast',
    duration: 2880, // 48:00
    publishedAt: '2025-02-12T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-004/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['mapping-worlds-water-crisis', 'nuclear-powers-second-act', 'rethinking-urban-mobility'],
  },
  {
    id: 'ep-005',
    slug: 'chinas-economic-crossroads',
    title: "China's Economic Crossroads",
    description:
      "With property markets in freefall and youth unemployment at record highs, China's economic miracle faces its sternest test. We ask whether Beijing can engineer a soft landing — or whether the world should brace for impact.",
    type: 'podcast',
    duration: 3300, // 55:00
    publishedAt: '2025-02-19T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-005/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['future-of-central-banking', 'new-cold-war-in-tech', 'semiconductor-decade'],
  },
  {
    id: 'ep-006',
    slug: 'rethinking-urban-mobility',
    title: 'Rethinking Urban Mobility',
    description:
      'Cities built for cars are redesigning themselves for people. From Amsterdam to Bogotá to Singapore, we look at the bold experiments transforming how billions of urban residents move — and the political battles being fought over every lane.',
    type: 'podcast',
    duration: 2550, // 42:30
    publishedAt: '2025-03-05T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-006/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['cities-of-the-future', 'climate-finance-gap', 'mapping-worlds-water-crisis'],
  },
  {
    id: 'ep-007',
    slug: 'new-cold-war-in-tech',
    title: 'The New Cold War in Tech',
    description:
      'Silicon Valley and Shenzhen are decoupling. Export controls, chip bans, and rival internet standards are fragmenting the global technology ecosystem into competing spheres. We ask what a bifurcated digital world means for everyone else.',
    type: 'podcast',
    duration: 3180, // 53:00
    publishedAt: '2025-03-19T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-007/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['inside-the-ai-arms-race', 'semiconductor-decade', 'chinas-economic-crossroads'],
  },
  {
    id: 'ep-008',
    slug: 'mapping-worlds-water-crisis',
    title: "Mapping the World's Water Crisis",
    description:
      'From the shrinking Colorado River to sub-Saharan droughts, water scarcity is becoming the defining geopolitical challenge of the century. This documentary maps the crisis across five continents, following scientists, farmers, and policymakers on the front lines.',
    type: 'video',
    duration: 2700, // 45:00
    publishedAt: '2025-01-29T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-008/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['climate-finance-gap', 'rethinking-urban-mobility', 'cities-of-the-future'],
  },
  {
    id: 'ep-009',
    slug: 'semiconductor-decade',
    title: 'The Semiconductor Decade',
    description:
      'The humble microchip has become the most strategically important object in the world. We visit the fabs in Taiwan, the design studios in California, and the political halls in Washington to understand why nations are betting trillions on silicon sovereignty.',
    type: 'video',
    duration: 3240, // 54:00
    publishedAt: '2025-02-26T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-009/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['inside-the-ai-arms-race', 'new-cold-war-in-tech', 'chinas-economic-crossroads'],
  },
  {
    id: 'ep-010',
    slug: 'cities-of-the-future',
    title: 'Cities of the Future',
    description:
      "By 2050, two-thirds of humanity will live in cities. We travel to the world's most ambitious urban experiments — from Saudi Arabia's NEOM to Singapore's vertical gardens — to ask what it will actually take to build liveable megacities.",
    type: 'video',
    duration: 2940, // 49:00
    publishedAt: '2025-03-12T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-010/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['rethinking-urban-mobility', 'mapping-worlds-water-crisis', 'nuclear-powers-second-act'],
  },
  {
    id: 'ep-011',
    slug: 'nuclear-powers-second-act',
    title: "Nuclear Power's Second Act",
    description:
      "After decades of decline, nuclear power is staging a remarkable comeback. With small modular reactors on the drawing board and climate pressure mounting, we ask whether humanity is ready to give the atom a second chance — and whether it's too late.",
    type: 'video',
    duration: 3060, // 51:00
    publishedAt: '2025-03-26T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-011/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['climate-finance-gap', 'cities-of-the-future', 'semiconductor-decade'],
  },
  {
    id: 'ep-012',
    slug: 'protein-revolution',
    title: 'The Protein Revolution',
    description:
      'Lab-grown meat, precision fermentation, and insect protein are challenging the $8 trillion global food system. We investigate whether alternative proteins can scale fast enough to feed 10 billion people without destroying the planet — and whether anyone will actually eat them.',
    type: 'video',
    duration: 2820, // 47:00
    publishedAt: '2025-04-02T09:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/echo-012/800/450',
    streamUrl: HLS_STREAM_URL,
    relatedSlugs: ['mapping-worlds-water-crisis', 'climate-finance-gap', 'cities-of-the-future'],
  },
];
