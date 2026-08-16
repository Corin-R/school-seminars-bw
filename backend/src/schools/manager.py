import json
from src.schools.models import School, District, Seminar

COLORS = {
    "marker orange": "#FFA500",
    "marker grey": "#808080",
    "marker green": "#008000",
    "marker cyan": "#00FFFF",
    "marker yellow": "#FFFF00",
    "marker blue": "#0000FF",
    "marker red": "#FF0000",
}


class DataManager:
    def __init__(self):
        self.districs : dict[str, District] = {}
        self.schools : dict[str, list[School ]] = {}
        self.categories : dict[str, str] = {}

    def fetch_data(self):
        with open("./data/enriched_data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        for key, district in data["districts_keys"].items():
            dist = District(key=key, district=district)
            self.districs[dist.key] = dist
        for district_id, school_arr in data["schools"].items():
            for school_obj in school_arr:
                school_obj["district_id"] = district_id
                school = School.model_validate(school_obj) 
                if district_id not in self.schools:
                    self.schools[district_id] = []
                self.schools[district_id].append(school)

                ## get categories
                category = f"{school.school_id}-{school.school_kind}"
                if("undefined" in category):
                    self.categories[category] = "School not associated with a seminar"
                else:
                    self.categories[category] = school.school_seminar
                
        pass