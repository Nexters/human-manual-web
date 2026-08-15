export interface CompatibilityPersonOutput {
  nickname: string;
  noun: string;
  character_id: string;
}

export interface SynergyOutput {
  score: number;
  title: string;
  description: string;
  tags: string[];
}

export interface CompatibilityTipOutput {
  target: "mine" | "friend";
  character_id: string;
  title: string;
  description: string;
}

export interface RelationshipTipOutput {
  title: string;
  description: string;
}

export interface CompatibilityOutput {
  mine: CompatibilityPersonOutput;
  friend: CompatibilityPersonOutput;
  headline: string;
  description: string;
  synergy: SynergyOutput;
  tips: CompatibilityTipOutput[];
  relationship_tip: RelationshipTipOutput;
}
