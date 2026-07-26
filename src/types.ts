export interface Message {
  id: string;
  sender: "user" | "stellar-ai" | "system";
  content: string;
  timestamp: Date;
}

export interface FeatureNode {
  id: string;
  label: string;
  status: "idle" | "processing" | "active";
  type: "source" | "parse" | "reason" | "vector" | "output";
  description: string;
}

export interface MetricSpec {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  glowColor: string;
}
