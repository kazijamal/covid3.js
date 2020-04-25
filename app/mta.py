import urllib.request
import urllib.parse

BASE_URL = 'http://web.mta.info/developers/data/nyct/turnstile/turnstile_'
DATE = '200425'
TXT = '.txt'

req = urllib.request.Request(
    BASE_URL + DATE + TXT
)

req = urllib.request.urlopen(req)

res = req.read().decode('utf8').strip('\n').split('\n')

res = [line.rstrip() for line in res]

print(res)