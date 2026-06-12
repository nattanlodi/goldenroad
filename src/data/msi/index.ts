import type { Team } from "../../types";
import { MSI_2019 } from "./2019";
import { MSI_2021 } from "./2021";
import { MSI_2022 } from "./2022";
import { MSI_2023 } from "./2023";
import { MSI_2024 } from "./2024";
import { MSI_2025 } from "./2025";

// Pool de campanhas do MSI (Mid-Season Invitational). Montado edição por edição
// em src/data/msi/<ano>.ts (rosters reais, notas pela régua de desempenho NO MSI).
// MSI existe desde 2015; não houve em 2020 (COVID). Cobertura em construção.
//
// RÉGUA: mesma filosofia do Worlds (ver teams.ts), pela colocação NO MSI + curadoria
// individual. Sem RFT (o rft.gg cobre só Worlds). Âncoras de base comparáveis às do
// Worlds: Campeão 86 · Vice 84 · Semi 81 · resto conforme avançou. MVP da final +1.
// Tuplas: [role, nome, overall, país]. tournament:"msi" obrigatório.
export const MSI_TEAMS: Team[] = [
  ...MSI_2019,
  ...MSI_2021,
  ...MSI_2022,
  ...MSI_2023,
  ...MSI_2024,
  ...MSI_2025,
];
