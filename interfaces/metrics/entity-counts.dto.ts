import type { EntityCountDto } from "./entity-count.dto";

/**
 * Combined entity counts
 */
export interface EntityCountsDto {
  collectedAt: string;
  entities: EntityCountDto[];
}
