export type TimeOfDay = "Morning" | "Noon" | "Afternoon";

export interface TrafficInput {
  timeOfDay?: TimeOfDay;
  observationTimeMinutes: number; // 1-5 minutes
  vehicleCount: number;
  roadLengthKm: number;
  jamDensity: number; // e.g., 120 veh/km
  freeFlowSpeed: number; // e.g., 60 km/h
}

export interface LWRResult {
  flow: number; // q (veh/hr)
  density: number; // k (veh/km)
  speed: number; // v (km/h)
  levelOfService: "A" | "B" | "C" | "D" | "E" | "F"; // Standard Traffic Engineering metric
}

export interface ASCResult {
  greenTime: number; // Seconds
  amberTime: number; // Seconds (Safety adjustment)
  cycleLength: number; // Seconds
  priority: "Low" | "Medium" | "High" | "Emergency";
  logicExplanation: string; // To show the "Why",
}

export interface IntersectionApproach {
  id: string;
  name: string;
  inputs: TrafficInput;
  lwr: LWRResult | null;
  asc: ASCResult | null;
  predictedQueue: number;
  history: any[];
}
