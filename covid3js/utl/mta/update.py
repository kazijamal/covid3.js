import time
import os
import datetime

from process import send_request, process_request, correct_date

start = time.time()

f = open('../../static/data/mta_turnstile.csv', 'a')

date = datetime.datetime(2020, 5, 2)

url_date = correct_date(date)

week_data = send_request(url_date)

process_request(week_data, f)

f.close()
