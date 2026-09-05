AQI_THRESHOLDS = [
    (50, "low", "0-50", "Air quality is satisfactory, and air pollution poses little or no risk."),
    (100, "moderate", "51-100", "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution."),
    (150, "high", "101-150", "Members of sensitive groups may experience health effects. The general public is less likely to be affected."),
    (200, "very_high", "151-200", "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects."),
    (300, "extreme", "201-300", "Health alert: The risk of health effects is increased for everyone."),
    (float('inf'), "extreme", "301+", "Health warning of emergency conditions: everyone is more likely to be affected.")
]

PM25_THRESHOLDS = [
    (12.0, "low", "0-12", "PM2.5 levels are within safe limits."),
    (35.4, "moderate", "12.1-35.4", "PM2.5 levels are moderate. Unusually sensitive people should consider reducing prolonged or heavy exertion."),
    (55.4, "high", "35.5-55.4", "PM2.5 levels are unhealthy for sensitive groups."),
    (150.4, "very_high", "55.5-150.4", "PM2.5 levels are unhealthy for the general public."),
    (float('inf'), "extreme", "150.5+", "PM2.5 levels are very unhealthy or hazardous.")
]

PM10_THRESHOLDS = [
    (54.0, "low", "0-54", "PM10 levels are within safe limits."),
    (154.0, "moderate", "55-154", "PM10 levels are moderate."),
    (254.0, "high", "155-254", "PM10 levels are unhealthy for sensitive groups."),
    (354.0, "very_high", "255-354", "PM10 levels are unhealthy for the general public."),
    (float('inf'), "extreme", "355+", "PM10 levels are very unhealthy or hazardous.")
]

HEAT_INDEX_THRESHOLDS_C = [
    (27.0, "low", "<27C", "Temperature is comfortable and poses minimal heat-related risks."),
    (32.0, "moderate", "27-32C", "Caution: Fatigue is possible with prolonged exposure and activity."),
    (39.0, "high", "32-39C", "Extreme Caution: Sunstroke, muscle cramps, and/or heat exhaustion possible."),
    (51.0, "very_high", "39-51C", "Danger: Sunstroke or heat exhaustion likely. Heatstroke possible with prolonged exposure."),
    (float('inf'), "extreme", ">51C", "Extreme Danger: Heatstroke or sunstroke highly likely.")
]

UV_THRESHOLDS = [
    (2.9, "low", "0-2", "Low danger from the sun's UV rays for the average person."),
    (5.9, "moderate", "3-5", "Moderate risk of harm from unprotected sun exposure."),
    (7.9, "high", "6-7", "High risk of harm from unprotected sun exposure. Protection needed."),
    (10.9, "very_high", "8-10", "Very high risk of harm. Take extra precautions as skin/eyes can burn quickly."),
    (float('inf'), "extreme", "11+", "Extreme risk of harm. Unprotected skin and eyes can burn in minutes.")
]
