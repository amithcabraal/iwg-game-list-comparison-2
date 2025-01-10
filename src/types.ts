interface Game {
  id?: string;
  gameId?: string;
  externalGameId?: string;
  gameID?: string;
  name?: string;
  isHidden?: boolean;
  enabled?: boolean;
  isActive?: boolean;
}

interface GameSummary {
  allThree: number;
  cmsOnly: number;
  contentHubOnly: number;
  upamOnly: number;
  cmsAndContentHub: number;
  cmsAndUpam: number;
  contentHubAndUpam: number;
  total: number;
}

interface GameCategories {
  allThree: Array<{id: string, name: string}>;
  cmsOnly: Array<{id: string, name: string}>;
  contentHubOnly: Array<{id: string, name: string}>;
  upamOnly: Array<{id: string, name: string}>;
  cmsAndContentHub: Array<{id: string, name: string}>;
  cmsAndUpam: Array<{id: string, name: string}>;
  contentHubAndUpam: Array<{id: string, name: string}>;
}

interface VennDiagramData {
  sets: string[];
  size: number;
  games?: Array<{id: string, name: string}>;
}

export type { Game, GameSummary, GameCategories, VennDiagramData };