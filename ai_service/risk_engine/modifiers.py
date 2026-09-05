from typing import List
from ai_service.models.user import User
from ai_service.models.risk import ProfileModifier

HEALTH_MODIFIERS = {
    "asthma": ("Increased respiratory vulnerability", 1.4),
    "copd": ("Severe respiratory vulnerability", 1.5),
    "cardiovascular": ("Increased cardiovascular strain", 1.3),
    "allergies": ("Sensitivity to airborne particles", 1.2),
}

OCCUPATION_MODIFIERS = {
    "outdoor_worker": ("Prolonged exposure to environmental elements", 1.3),
    "athlete": ("High exertion outdoors", 1.2),
    "indoor_worker": ("Protected from direct exposure", 0.9),
    "remote_worker": ("Protected from direct exposure", 0.9),
}

AGE_MODIFIERS = {
    "child": ("Developing immune and respiratory system", 1.3),
    "elderly": ("Increased physiological vulnerability", 1.3),
}

def evaluate_user_modifiers(user: User) -> List[ProfileModifier]:
    modifiers = []
    
    if user.age_group and user.age_group.lower() in AGE_MODIFIERS:
        impact, mult = AGE_MODIFIERS[user.age_group.lower()]
        modifiers.append(ProfileModifier(factor=f"age:{user.age_group.lower()}", impact=impact, multiplier=mult))
        
    if user.health_conditions:
        for condition in user.health_conditions:
            clean_cond = condition.lower()
            if clean_cond in HEALTH_MODIFIERS:
                impact, mult = HEALTH_MODIFIERS[clean_cond]
                modifiers.append(ProfileModifier(factor=clean_cond, impact=impact, multiplier=mult))
                
    if user.occupation and user.occupation.lower() in OCCUPATION_MODIFIERS:
        impact, mult = OCCUPATION_MODIFIERS[user.occupation.lower()]
        modifiers.append(ProfileModifier(factor=user.occupation.lower(), impact=impact, multiplier=mult))
        
    return modifiers
