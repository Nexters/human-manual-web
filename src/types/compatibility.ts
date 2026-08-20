export interface CompatibilityPersonOutput {
  nickname: string;
  noun: string;
  character_id: string;
  image_url: string;
}

export interface SynergyOutput {
  score: number;
  title: string;
  description: string;
  tags: string[];
}

export interface CompatibilityDetailOutput {
  key: "distance" | "conflict" | "care" | "pace";
  score: number;
  title: string;
  label: string;
  description: string;
}

export interface CompatibilityTipOutput {
  target: "mine" | "friend";
  character_id: string;
  image_url: string;
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
  details: CompatibilityDetailOutput[];
  tips: CompatibilityTipOutput[];
  relationship_tip: RelationshipTipOutput;
}
