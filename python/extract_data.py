import time
import re
import sys
import os
import requests
import json 
from bs4 import BeautifulSoup


def collect_districts():
    url = "https://schulfinder.kultus-bw.de/api/admin_units/5/?query=&wildcard=true&return_ids=true"
    print("requesting districts")
    response = requests.get(url, verify=False)
    if response.status_code == 200:
        return response.json()
    raise
    pass


def collect_school_per_district(district_key_name):
    result_key_info = {}
    for key, value in district_key_name.items():
        url = f"https://schulfinder.kultus-bw.de/api/schools?district[]={key}&radius=&outposts=1&owner=1&school_kind=&types=&work_schedule=&term=&_=1780304256504"
        response = requests.get(url)
        print(response.json())
        result_key_info[key] = response.json()["schools"]
    return result_key_info

def get_schools_data():
    districts_key_name = {}
    districts = collect_districts()
    for entry in districts.get("results", []):
        districts_key_name[entry["value"]] = entry["name"]
    result_key_info = collect_school_per_district(districts_key_name)
    dump_data = {
        "districts_keys" : districts_key_name,
        "schools" : result_key_info
    }
    with open("data.json", "w") as f: 
        json.dump(dump_data, f, indent=4)
    

def get_seminar_standorte():
    gymnasium_urls = []
    
    url = "https://seminare-bw.de/,Lde/Startseite/Seminarstandorte"
    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.text, "html.parser")
    
    for a_tag in soup.find_all("a"):
        href = a_tag.get("href")
        text = a_tag.get_text(strip=True)

        gym_regex = r"^https://.*gym.*\.seminare-bw.de.*$"
        if re.fullmatch(gym_regex, href):
            # https://bs-gym-wgt.seminare-bw.de
            gymnasium_urls.append(href)
    return gymnasium_urls


def query_search_seminar_schools(schule_selected, schule_selected_sart):
    url = "https://lobw.kultus-bw.de/didsuche/DienststellenSucheWebService.asmx/SearchDienststellen"

    cookies = {
        "ASP.NET_SessionId": "wtj2elfweip0gg1sneskvasb",
        "KMARRAffinity": "2644b9b7beb17a73a7cfdbc3c253fddd1e6b88f1f92e912554ae5948e18a1e95",
    }

    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0"
    }
    
    payload = {
        "json": json.dumps({
            "command": "SEARCH",
            "data": {
                "dscSearch": "",
                "dscDienststellenname": "",
                "dscSchulartenSelected": "Keine Auswahl",
                "dscSchulstatusSelected": "0",
                "dscSchulaufsichtSelected": "",
                "dscOrtSelected": "",
                "dscEntfernung": "",
                "dscAusbildungsSchulenSelected": schule_selected, #"04033050",
                "dscAusbildungsSchulenSelectedSart": schule_selected_sart, # "GYM",
                "dscPageNumber": "1",
                "dscPageSize": "500",
                "dscUnique": str(int(time.time() * 1000))
            }
        })
    }
    response = requests.post(url, json=payload, headers=headers, cookies=cookies)

    # Parse the JSON string inside the "d" field
    data = json.loads(response.json()["d"])
    return data 

def get_all_query_param_schools():
    url = "https://lobw.kultus-bw.de/didsuche"
    response = requests.get(url=url)
    soup = BeautifulSoup(response.text, "html.parser")

    select = soup.find(
        "select",
        id="ctl00_ContentContent_ctl00_AusbildungsSchulenSelectControl"
    )

    result_data = {}
    if select:
        options = select.find_all("option")

        for option in options:
            result_data[option.get("value")] = option.get_text(strip=True)
    return result_data


def generate_list(query_params_dict : dict):
    data_list = []
    failed_data = []
    for key, value in query_params_dict.items():
        
        if "~" not in key:
            continue
        

        
        a, b = key.split("~")
        print(f"Searching {a}, {b} in {value}") 
        data = query_search_seminar_schools(a, b)
        counter = 0
        while len(data["Rows"]) == 0 and counter < 0:
            print(f"Retry {counter}")
            counter += 1 
            time.sleep(2)
            data = query_search_seminar_schools(a, b)

        obj = {
            "school_id" : a,
            "school_kind": b, 
            "school_seminar" : value, 
            "rows" : data["Rows"]
        }
        
        data_list.append(obj.copy())
    
    with open("seminar_mappping.json", "w") as f: 
        json.dump(data_list, f, indent=4)


def enrich_with_seminar_data():
    with open("data.json", "r") as f:
        school_data = json.load(f)
    
    with open("seminar_mappping.json", "r") as f:
        seminar_mapping = json.load(f)
    
    grouped_schools_by_city : dict[str, list] = {}

    not_found_schools_in_seminar_mapping  = []
    for entry in seminar_mapping:
        school_id = entry["school_id"]
        school_kind = entry["school_kind"]
        school_seminar = entry["school_seminar"]
        for row_entry in entry["rows"]:

            found = False
            entry_city, entry_name = row_entry["NAME"].split(",", 1)

            entry_city = entry_city.strip()
            entry_name = entry_name.strip()

            for district_id, school_arr in school_data["schools"].items():
                for school_obj in school_arr:
                    city = school_obj["city"]
                    name = school_obj["name"]

                    if entry_city == city and name ==  entry_name: 
                        found = True
                        school_obj["school_id"] = school_id
                        school_obj["school_kind"] = school_kind
                        school_obj["school_seminar"] = school_seminar
                        break
                if found:
                    # overwrite?
                    break
            if not found:
                raise Exception(f"Could not find entry for {row_entry["NAME"]}")
                
    with open("enriched_data.json", "w") as f:
        json.dump(school_data, f, indent=4)
    print("Enrich success!")
    pass
    




def main():
    print("hello world")
    # data.json
    # get_schools_data()
    
    # seminar_mapping_json
    # query_params_dict = get_all_query_param_schools()
    # generate_list(query_params_dict)

    # TODO:
    # combine them two
    enrich_with_seminar_data()

if __name__ == "__main__":
    main()
    sys.exit(0)