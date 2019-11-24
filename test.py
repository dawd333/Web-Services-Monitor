import json
import requests

# response = requests.get("http://127.0.0.1:8000/watchman/")
response = requests.get("http://127.0.0.1:8000/ht/?format=json")
data = json.loads(response.text)
print(data)