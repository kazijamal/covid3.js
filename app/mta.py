import urllib.request
import datetime
import time
import pprint

'''
This file makes HTTP requests to the data files located here: http://web.mta.info/developers/turnstile.html
MTA turnstile data is reported on every Saturday. The data is organized in the follow CSV manner:

C/A,UNIT,SCP,STATION,LINENAME,DIVISION,DATE,TIME,DESC,ENTRIES,EXITS

C/A and UNIT represent the control areas the turnstiles are under
SCP represents the turnstile ID
STATION is the name of the station
LINENAME contains all of the lines that serve the STATION
DIVISON represents the outdated divisions in the MTA from the 20th century
DATE represents the day that the data is from
TIME represents the timestamp during which the audit event occured
ENTRIES and EXITS represent the cumulative number of entries and exits at a turnstile at TIMESTAMP on DATE

Note that the timestamps are taken every four hours, starting at midnight. The entry and exit data taken from
the timestamp represent the number of entries and exits in the four hours leading up to the audit event.
For this reason, we need to make sure that the first datapoint from the next day is counted in the previous day

For example:

A002,R051,02-00-00,59 ST,NQR456W,BMT,04/19/2020,00:00:00,REGULAR,0007414835,0002517678

is a datapoint from the 19th of April, 2020 but it contains data about the 18th of April. Therefore, we need to
make sure it is counted in the correct date.

Note that some stop stations do repeat their names, and for this reason, we need to use the control values as a
pseudo-id. Note that turnstile identifiers repeat for different stations so they do not serve as a good id.
Note that the entries and exits are cumulative and thus we need to track daily ridership ourselves.

Because the data can be unexpected and there is simply too much data to go over with a fine-tooth comb, we cannot
guarantee that our daily ridership is generating correct data.

What does this script do?
We are querying for all ridership data reported since January 05, 2019 to present.

In each query, we go through every line of data to find the total number of entries and exits in every turnstile
at every station every day. After we retrieve data for each turnstile, we then compress the data to represent total
daily entries and exits per station.

After getting the data for each day, we then have to match the names from our generated dictionary to the names from
another official MTA file which contains location and borough data. After that, we write the data to a file in
CSV format. This new  file will be returned as text in a Flask route, which will be queried by our frontend JavaScript.
'''

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

            '''
                Handle putting data into the previous day for midnight datapoint
                If the turnstile is not yet in the day, we know that the current timestamp
                is at midnight. Knowing this, we can go back in time one day and check to
                see if the current turnstile is also represented on that day. If it is, then
                we add the last 4 hours of data to that day's data.
            '''
            d_date = datetime.timedelta(days=1)
            prev = date - d_date
            if prev in _station and control in _station[prev] and turnstile in _station[prev][control]:
                prev = _station[prev][control][turnstile]
                prev['enter'] += _enter - prev['c_enter']
                prev['exit'] += _exit - prev['c_exit']

        else:
            _turnstile = _control[turnstile]

            '''
                Increment the amount of change in entries and exits
            '''
            _turnstile['enter'] += _enter - _turnstile['c_enter']
            _turnstile['exit'] += _exit - _turnstile['c_exit']

        _turnstile['c_enter'], _turnstile['c_exit'] = _enter, _exit

    '''
        Compress turnstile data into station data
    '''
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
# while(date <= last_date):
#     # e.g. ['2020', '04', '25']
#     date_list = date.date().isoformat().split('-')

#     # e.g. '200425'
#     url_date = date_list[0][2:] + date_list[1] + date_list[2]

#     send_request(url_date)

#     date += datetime.timedelta(weeks=1)

send_request('200425')

print(time.time() - start)
