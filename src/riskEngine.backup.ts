// Deterministic Environmental Risk Engine based on US-EPA AQI & NOAA Heat Stress

export interface EnvironmentalData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  uvIndex?: number;
  aqi: number;
  aqiCategory: string;
  pm25: number;
  pm10: number;
  aqiSource: 'waqi' | 'open_meteo';
  stationName?: string;
  dominantPollutant?: string;
}

export interface UserProfileContext {
  age?: number;
  gender?: string;
  occupation?: string;
  medicalConditions?: string[];
  locationName?: string;
}

export interface RiskFactor {
  factor: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  impact: string;
}

export interface RiskCalculationResult {
  score: number; // 0 to 100
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  summary: string;
  clinicalImpact: string;
  primaryFactors: RiskFactor[];
  precautions: string[];
  activitiesToAvoid: string[];
  bestTimeWindow: string;
}

export function calculatePersonalRisk(
  env: EnvironmentalData,
  profile: UserProfileContext
): RiskCalculationResult {
  let baseScore = 0;
  const factors: RiskFactor[] = [];
  const precautions: string[] = [];
  const avoid: string[] = [];

  // 1. Air Quality Sub-score (US-EPA AQI scale)
  let aqiScore = 0;
  if (env.aqi <= 50) {
    aqiScore = (env.aqi / 50) * 20;
  } else if (env.aqi <= 100) {
    aqiScore = 20 + ((env.aqi - 50) / 50) * 25;
    factors.push({
      factor: `Moderate AQI (${env.aqi})`,
      severity: 'MODERATE',
      impact: 'Unusually sensitive individuals may experience minor cough or irritation.'
    });
  } else if (env.aqi <= 150) {
    aqiScore = 45 + ((env.aqi - 100) / 50) * 25;
    factors.push({
      factor: `Unhealthy for Sensitive Groups (${env.aqi})`,
      severity: 'HIGH',
      impact: 'Particulate matter ($PM_{2.5}$) induces airway inflammation in respiratory patients.'
    });
  } else if (env.aqi <= 200) {
    aqiScore = 70 + ((env.aqi - 150) / 50) * 15;
    factors.push({
      factor: `Unhealthy AQI (${env.aqi})`,
      severity: 'HIGH',
      impact: 'General public begins to experience health effects; sensitive groups experience serious issues.'
    });
  } else {
    aqiScore = 85 + Math.min(15, ((env.aqi - 200) / 100) * 15);
    factors.push({
      factor: `Hazardous Particulate Burden (${env.aqi})`,
      severity: 'CRITICAL',
      impact: 'Severe aggravation of respiratory and cardiac symptoms. Health alert level.'
    });
  }

  // 2. Heat / Thermal Stress Sub-score (NOAA Apparent Temperature)
  let heatScore = 0;
  if (env.feelsLike > 40) {
    heatScore = 85;
    factors.push({
      factor: `Dangerous Heat Index (${env.feelsLike}°C)`,
      severity: 'CRITICAL',
      impact: 'Heat exhaustion likely, heatstroke imminent with prolonged physical exposure.'
    });
  } else if (env.feelsLike >= 33) {
    heatScore = 60;
    factors.push({
      factor: `Extreme Caution Heat Index (${env.feelsLike}°C)`,
      severity: 'HIGH',
      impact: 'Fatigue and dehydration possible with prolonged activity.'
    });
  } else if (env.feelsLike >= 27) {
    heatScore = 35;
  } else {
    heatScore = 15;
  }

  // Base environmental composite
  baseScore = Math.max(aqiScore, heatScore) * 0.7 + Math.min(aqiScore, heatScore) * 0.3;

  // 3. User Vulnerability Multipliers
  let multiplier = 1.0;
  const conditions = profile.medicalConditions || [];

  // Respiratory multiplier
  const hasRespiratory = conditions.some(c => ['asthma', 'copd', 'emphysema', 'pulmonary_fibrosis', 'allergic_rhinitis'].includes(c));
  if (hasRespiratory && env.aqi > 70) {
    multiplier += 0.35;
    precautions.push("Keep rapid-acting rescue inhaler (e.g. Salbutamol/Albuterol) immediately accessible.");
    precautions.push("Run a HEPA room air purifier indoors and close external windows during peak hours.");
    avoid.push("Outdoor jogging, cycling, or heavy breathing between 12:00 PM and 5:00 PM.");
  }

  // Cardiovascular multiplier
  const hasCardio = conditions.some(c => ['hypertension', 'coronary_artery', 'heart_failure', 'arrhythmia', 'stroke_history'].includes(c));
  if (hasCardio && (env.feelsLike > 32 || env.aqi > 100)) {
    multiplier += 0.30;
    precautions.push("Monitor blood pressure and stay in shaded/air-conditioned zones to reduce cardiac strain.");
    avoid.push("Sudden temperature transitions and heavy lifting outdoors.");
  }

  // Age modifiers
  const age = profile.age || 25;
  if (age < 12) {
    multiplier += 0.20;
    precautions.push("Children breathe 50% more air per pound of body weight—restrict outdoor sports today.");
  } else if (age >= 60) {
    multiplier += 0.25;
    precautions.push("Older adults have slower thermoregulation; drink oral rehydration fluids proactively.");
  }

  // Occupation Exposure modifier
  const occ = profile.occupation || 'indoor_office';
  if (occ === 'outdoor_worker' || occ === 'delivery_transport') {
    multiplier += 0.30;
    precautions.push("Wear a NIOSH-certified N95 or FFP2 particulate mask during mandatory outdoor shifts.");
    precautions.push("Mandate 15-minute shaded hydration breaks for every 60 minutes of field labor.");
    avoid.push("Unprotected prolonged shifts during midday peak ultraviolet & ozone hours.");
  } else if (occ === 'athlete_fitness') {
    multiplier += 0.25;
    avoid.push("High-intensity interval training or outdoor marathons under current $PM_{2.5}$ concentration.");
  }

  // General baseline precautions if empty
  if (precautions.length === 0) {
    precautions.push("Stay well-hydrated throughout the day.");
    precautions.push("Maintain standard indoor room ventilation.");
  }
  if (avoid.length === 0) {
    avoid.push("Avoid stationary idling in dense vehicular traffic zones.");
  }

  const finalScore = Math.min(100, Math.round(baseScore * multiplier));

  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (finalScore >= 80) level = 'CRITICAL';
  else if (finalScore >= 60) level = 'HIGH';
  else if (finalScore >= 35) level = 'MODERATE';

  const summary = level === 'CRITICAL' || level === 'HIGH'
    ? `Elevated atmospheric risk detected for your specific profile (${profile.medicalConditions?.join(', ') || 'General'}, ${profile.occupation || 'Standard'}). Immediate precautionary measures recommended.`
    : `Environmental parameters in ${profile.locationName || 'your area'} are manageable with standard awareness.`;

  const clinicalImpact = `Combined exposure to ${env.pm25} µg/m³ PM2.5 and ${env.feelsLike}°C apparent temperature imposes a ${finalScore}/100 vulnerability index on your ${profile.occupation || 'daily routine'}.`;

  return {
    score: finalScore,
    level,
    summary,
    clinicalImpact,
    primaryFactors: factors,
    precautions,
    activitiesToAvoid: avoid,
    bestTimeWindow: env.aqi > 150 ? "Before 7:30 AM or strictly after sunset" : "Morning between 6:30 AM - 9:00 AM"
  };
}
