export interface StandingEntry {
  position: number;
  teamName: string;
  shortName: string;
  slug: string;
  logoUrl: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface LeagueStandings {
  leagueName: string;
  matchday: string;
  updatedAt: string;
  entries: StandingEntry[];
}

const LIGA_DE_PRIMERA_2026: LeagueStandings = {
  leagueName: "Liga de Primera",
  matchday: "Fecha 4",
  updatedAt: "22 Feb 2026",
  entries: [
    {
      position: 1, teamName: "Huachipato FC", shortName: "Huachipato", slug: "huachipato",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b87f65bf85ae33eb6743_huachipato-footballlogos-org.png",
      played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 7, goalsAgainst: 3, goalDifference: 4, points: 9,
    },
    {
      position: 2, teamName: "Colo-Colo", shortName: "Colo-Colo", slug: "colo-colo",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b6f44fb1d153031f5665_colo-colo-footballlogos-org.png",
      played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 9,
    },
    {
      position: 3, teamName: "Deportes Limache", shortName: "D. Limache", slug: "deportes-limache",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7bacc10e011291f2ebd66_deportes-limache-footballlogos-org.png",
      played: 4, won: 2, drawn: 2, lost: 0, goalsFor: 8, goalsAgainst: 5, goalDifference: 3, points: 8,
    },
    {
      position: 4, teamName: "Ñublense", shortName: "Ñublense", slug: "nublense",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b98392e3419d9753d734_nublense-footballlogos-org.png",
      played: 4, won: 2, drawn: 2, lost: 0, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 8,
    },
    {
      position: 5, teamName: "Universidad Católica", shortName: "U. Católica", slug: "u-catolica",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b81198541d66e7f62e56_universidad-catolica-footballlogos-org.png",
      played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 9, goalsAgainst: 6, goalDifference: 3, points: 7,
    },
    {
      position: 6, teamName: "Audax Italiano", shortName: "Audax", slug: "audax-italiano",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b7b063433f44ddc94a0a_audax-italiano-footballlogos-org.png",
      played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 7,
    },
    {
      position: 7, teamName: "Cobresal", shortName: "Cobresal", slug: "cobresal",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b8b2f1a18d7f5439aa01_cobresal-footballlogos-org.png",
      played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 6, goalsAgainst: 6, goalDifference: 0, points: 7,
    },
    {
      position: 8, teamName: "Universidad de Concepción", shortName: "U. de Conce", slug: "u-de-concepcion",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Udeconce.png/200px-Udeconce.png",
      played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 5, goalDifference: -1, points: 7,
    },
    {
      position: 9, teamName: "Unión La Calera", shortName: "La Calera", slug: "union-la-calera",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7ba406853264d0405391a_union-la-calera-footballlogos-org.png",
      played: 4, won: 2, drawn: 0, lost: 2, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 6,
    },
    {
      position: 10, teamName: "Coquimbo Unido", shortName: "Coquimbo", slug: "coquimbo-unido",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b94c9da4467dd5f4a36b_coquimbo-unido-footballlogos-org.png",
      played: 4, won: 2, drawn: 0, lost: 2, goalsFor: 5, goalsAgainst: 5, goalDifference: 0, points: 6,
    },
    {
      position: 11, teamName: "O'Higgins FC", shortName: "O'Higgins", slug: "ohiggins",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b83f7d892af4707f87e7_o-higgins-footballlogos-org.png",
      played: 4, won: 2, drawn: 0, lost: 2, goalsFor: 4, goalsAgainst: 4, goalDifference: 0, points: 6,
    },
    {
      position: 12, teamName: "Universidad de Chile", shortName: "U. de Chile", slug: "u-de-chile",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b7dd5d96133177f79bae_universidad-de-chile-footballlogos-org.png",
      played: 4, won: 0, drawn: 3, lost: 1, goalsFor: 3, goalsAgainst: 4, goalDifference: -1, points: 3,
    },
    {
      position: 13, teamName: "Deportes La Serena", shortName: "La Serena", slug: "la-serena",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7bb2ffe37363ee50a01ca_la-serena-footballlogos-org.png",
      played: 4, won: 0, drawn: 2, lost: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 2,
    },
    {
      position: 14, teamName: "Palestino", shortName: "Palestino", slug: "palestino",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b72e712ede11d5473f98_palestino-chile-footballlogos-org.png",
      played: 4, won: 0, drawn: 2, lost: 2, goalsFor: 3, goalsAgainst: 6, goalDifference: -3, points: 2,
    },
    {
      position: 15, teamName: "Deportes Concepción", shortName: "D. Concepción", slug: "deportes-concepcion",
      logoUrl: null,
      played: 4, won: 0, drawn: 1, lost: 3, goalsFor: 3, goalsAgainst: 7, goalDifference: -4, points: 1,
    },
    {
      position: 16, teamName: "Everton", shortName: "Everton", slug: "everton",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b8de41c135fc0538da31_everton-de-vina-del-mar-footballlogos-org.png",
      played: 4, won: 0, drawn: 0, lost: 4, goalsFor: 0, goalsAgainst: 7, goalDifference: -7, points: 0,
    },
  ],
};

const LIGA_DE_ASCENSO_2026: LeagueStandings = {
  leagueName: "Liga de Ascenso",
  matchday: "Fecha 1",
  updatedAt: "23 Feb 2026",
  entries: [
    {
      position: 1, teamName: "Deportes Iquique", shortName: "D. Iquique", slug: "deportes-iquique",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b9ca68f5bd0215c06136_deportes-iquique-footballlogos-org.png",
      played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 5, goalsAgainst: 0, goalDifference: 5, points: 3,
    },
    {
      position: 2, teamName: "Cobreloa", shortName: "Cobreloa", slug: "cobreloa",
      logoUrl: null,
      played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 3, goalsAgainst: 1, goalDifference: 2, points: 3,
    },
    {
      position: 3, teamName: "Deportes Antofagasta", shortName: "Antofagasta", slug: "antofagasta",
      logoUrl: null,
      played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 0, goalDifference: 2, points: 3,
    },
    {
      position: 4, teamName: "Deportes Recoleta", shortName: "Recoleta", slug: "recoleta",
      logoUrl: null,
      played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 0, goalDifference: 2, points: 3,
    },
    {
      position: 5, teamName: "Deportes Puerto Montt", shortName: "Puerto Montt", slug: "puerto-montt",
      logoUrl: null,
      played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 0, goalDifference: 2, points: 3,
    },
    {
      position: 6, teamName: "Unión Española", shortName: "U. Española", slug: "union-espanola",
      logoUrl: "https://cdn.prod.website-files.com/68f550992570ca0322737dc2/68f7b76d1e43b9044d01768c_union-espanola-footballlogos-org.png",
      played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 0, goalDifference: 2, points: 3,
    },
    {
      position: 7, teamName: "Magallanes", shortName: "Magallanes", slug: "magallanes",
      logoUrl: null,
      played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 3,
    },
    {
      position: 8, teamName: "Deportes Santa Cruz", shortName: "Santa Cruz", slug: "santa-cruz",
      logoUrl: null,
      played: 1, won: 0, drawn: 1, lost: 0, goalsFor: 1, goalsAgainst: 1, goalDifference: 0, points: 1,
    },
    {
      position: 9, teamName: "San Marcos de Arica", shortName: "S.M. Arica", slug: "san-marcos-arica",
      logoUrl: null,
      played: 1, won: 0, drawn: 1, lost: 0, goalsFor: 1, goalsAgainst: 1, goalDifference: 0, points: 1,
    },
    {
      position: 10, teamName: "Curicó Unido", shortName: "Curicó", slug: "curico-unido",
      logoUrl: null,
      played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 2, goalDifference: -1, points: 0,
    },
    {
      position: 11, teamName: "Deportes Temuco", shortName: "Temuco", slug: "deportes-temuco",
      logoUrl: null,
      played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 3, goalDifference: -2, points: 0,
    },
    {
      position: 12, teamName: "Deportes Copiapó", shortName: "Copiapó", slug: "deportes-copiapo",
      logoUrl: null,
      played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 0, goalsAgainst: 2, goalDifference: -2, points: 0,
    },
    {
      position: 13, teamName: "Rangers de Talca", shortName: "Rangers", slug: "rangers",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Rangers_de_Talca_-_Escudo.svg/250px-Rangers_de_Talca_-_Escudo.svg.png",
      played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 0, goalsAgainst: 2, goalDifference: -2, points: 0,
    },
    {
      position: 14, teamName: "San Luis de Quillota", shortName: "San Luis", slug: "san-luis",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/LOGO_SAN_LUIS_DE_QUILLOTA_OFICIAL.png/250px-LOGO_SAN_LUIS_DE_QUILLOTA_OFICIAL.png",
      played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 0, goalsAgainst: 2, goalDifference: -2, points: 0,
    },
    {
      position: 15, teamName: "Santiago Wanderers", shortName: "S. Wanderers", slug: "santiago-wanderers",
      logoUrl: null,
      played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 0, goalsAgainst: 2, goalDifference: -2, points: 0,
    },
    {
      position: 16, teamName: "Unión San Felipe", shortName: "U. San Felipe", slug: "union-san-felipe",
      logoUrl: null,
      played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 0, goalsAgainst: 5, goalDifference: -5, points: 0,
    },
  ],
};

const CLUB_LEAGUE_MAP: Record<string, string> = {
  "deportes-concepcion": "liga-de-primera",
  "palestino": "liga-de-primera",
  "puerto-montt": "liga-de-ascenso",
  "rangers": "liga-de-ascenso",
  "recoleta": "liga-de-ascenso",
  "santa-cruz": "liga-de-ascenso",
  "antofagasta": "liga-de-ascenso",
};

const LEAGUES: Record<string, LeagueStandings> = {
  "liga-de-primera": LIGA_DE_PRIMERA_2026,
  "liga-de-ascenso": LIGA_DE_ASCENSO_2026,
};

export function getStandingsForClub(clubSlug: string | undefined): LeagueStandings {
  if (!clubSlug) return LIGA_DE_PRIMERA_2026;
  const leagueKey = CLUB_LEAGUE_MAP[clubSlug] ?? "liga-de-primera";
  return LEAGUES[leagueKey] ?? LIGA_DE_PRIMERA_2026;
}
