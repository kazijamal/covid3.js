import urllib.request
import datetime

BASE_URL = 'http://web.mta.info/developers/data/nyct/turnstile/turnstile_'
TXT = '.txt'

date = datetime.datetime(2016, 1, 2)
last_date = datetime.datetime(2020, 4, 25)


def send_request(date):
    req = urllib.request.Request(BASE_URL + date + TXT)
    req = urllib.request.urlopen(req)
    # print(req.status)

    res = req.read().decode('utf8').strip('\n').split('\n')
    res = [line.rstrip() for line in res]
    # print(res)

start = datetime.datetime.now()

while(date <= last_date):
    # e.g. ['2020', '04', '25']
    date_list = date.date().isoformat().split('-')

    # e.g. '200425'
    url_date = date_list[0][2:] + date_list[1] + date_list[2]

    send_request(url_date)

    date += datetime.timedelta(weeks=1)

# 0:00:34:585861 to send all requests without reading
# 0:00:09:131775 to send one request, read its content, and format it
# There are 227 weeks from 2016-01-02 to 2020-04-25
# It will take approximately 34 minutes to parse through all of the data

print(datetime.datetime.now() - start)