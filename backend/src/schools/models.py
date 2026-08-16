from pydantic import BaseModel

class District(BaseModel):
    key: str
    district: str

class Seminar(BaseModel):
    color: str
    label: str
    kind : str
    seminar : str

class School(BaseModel):
    district_id: str
    uuid: str 
    outpost_number: str
    name: str
    city: str | None
    lat: float
    lng: float
    official: int | None
    marker_class: str
    marker_label: str
    school_id: str = "undefined"
    school_kind: str = "undefined"
    school_seminar: str = "undefined"