import type { Team } from "../../types";
import { MSI_2015 } from "./2015";
import { MSI_2016 } from "./2016";
import { MSI_2017 } from "./2017";
import { MSI_2018 } from "./2018";
import { MSI_2019 } from "./2019";
import { MSI_2021 } from "./2021";
import { MSI_2022 } from "./2022";
import { MSI_2023 } from "./2023";
import { MSI_2024 } from "./2024";
import { MSI_2025 } from "./2025";

// Pool de campanhas do MSI (Mid-Season Invitational). Montado edição por edição
// em src/data/msi/<ano>.ts (rosters reais). MSI existe desde 2015; não houve em
// 2020 (COVID). Cobertura COMPLETA: 2015-2019 + 2021-2025 (todas as edições).
//
// RÉGUA: RFT geral (rft.gg /event/msi-<ano>/players) + RFT por SÉRIE de mata-mata
// (/match/<id>-<slug>), mescla 80/20 COM força do oponente (região×colocação),
// igual ao Worlds. Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs +
// rft-msi-<ano>.mjs. Âncoras de base: Campeão 86 · Vice 84 · Semi 81 · resto
// conforme avançou. MVP: +2 finals / +2 torneio / +3 duplo (teto 100).
// Tuplas: [role, nome, overall, país]. tournament:"msi" obrigatório.
export const MSI_TEAMS: Team[] = [
  ...MSI_2015,
  ...MSI_2016,
  ...MSI_2017,
  ...MSI_2018,
  ...MSI_2019,
  ...MSI_2021,
  ...MSI_2022,
  ...MSI_2023,
  ...MSI_2024,
  ...MSI_2025,
];
