import http.client

# This is api for scraping linkedin jobs
# Free Limit 50 requests only
conn = http.client.HTTPSConnection("linkedin-data-api.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "e0dab6306bmshbf2516ffd39c402p14674ejsnda100a58c757",
    'x-rapidapi-host': "linkedin-data-api.p.rapidapi.com"
}

conn.request("GET", "/search-jobs?keywords=golang&locationId=92000000&datePosted=anyTime&sort=mostRelevant", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))