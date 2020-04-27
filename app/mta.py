import urllib.request
import datetime
import time
import pprint

BASE_URL, TXT = 'http://web.mta.info/developers/data/nyct/turnstile/turnstile_', '.txt'

date = datetime.datetime(2019, 1, 5)
last_date = datetime.datetime(2020, 4, 25)


def send_request(date):
    req = urllib.request.Request(BASE_URL + date + TXT)
    req = urllib.request.urlopen(req)
    print(req.status)
    res = req.read().decode('utf8').strip('\n').split('\n')

    # res = open('turnstile_200425.txt').read().strip('\n').split('\n')

    res = [line.rstrip() for line in res][1:]

    stations = dict()
    station_names = list()

    for i in range(0, len(res)):
        event = res[i].split(',')

        name, date = event[3], parse_date(event[6])
        control, turnstile = event[0] + event[1], event[2]
        _enter, _exit = int(event[9]), int(event[10])

        if not name in stations:
            stations[name] = dict()

        _station = stations[name]
        if not date in _station:
            _station[date] = dict()

        _date = _station[date]
        if not control in _date:
            _date[control] = dict()

        _control = _date[control]
        if not turnstile in _control:
            _control[turnstile] = dict()
            _turnstile = _control[turnstile]

            _turnstile['enter'], _turnstile['exit'] = 0, 0

            d_date = datetime.timedelta(days=1)
            prev = date - d_date
            if prev in _station and control in _station[prev] and turnstile in _station[prev][control]:
                prev = _station[prev][control][turnstile]
                prev['enter'] += _enter - prev['c_enter']
                prev['exit'] += _exit - prev['c_exit']

        else:
            _turnstile = _control[turnstile]

            _turnstile['enter'] += _enter - _turnstile['c_enter']
            _turnstile['exit'] += _exit - _turnstile['c_exit']

        _turnstile['c_enter'], _turnstile['c_exit'] = _enter, _exit

    for station in stations.keys():
        for date in stations[station]:
            _date = stations[station][date]
            day_enter, day_exit = 0, 0
            keys = list(_date.keys())
            for control in keys:
                turnstiles = list(_date[control].keys())
                for turnstile in turnstiles:
                    day_enter += _date[control][turnstile]['enter']
                    day_exit += _date[control][turnstile]['exit']
                    _date[control].pop(turnstile)
                _date.pop(control)
            _date['enter'] = day_enter
            _date['exit'] = day_exit

    # pprint.pprint(stations)


def parse_date(str_date):
    date = [int(t) for t in str_date.split('/')]
    return datetime.datetime(date[2], date[0], date[1])

start = time.time()
# count = 0
# while(date <= last_date):
#     # e.g. ['2020', '04', '25']
#     date_list = date.date().isoformat().split('-')

#     # e.g. '200425'
#     url_date = date_list[0][2:] + date_list[1] + date_list[2]

#     send_request(url_date)

#     count += 1
#     date += datetime.timedelta(weeks=1)

# # 0:00:12:674262 to send all requests without reading
# # 0:00:09:131775 to send one request, read its content, and format it
# # There are 69 weeks from 2019-01-25 to 2020-04-25
# # It will take approximately 10 minutes to parse through all of the data


send_request('200425')

print(time.time() - start)
