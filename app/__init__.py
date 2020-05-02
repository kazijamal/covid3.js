'''
TwoFortyNine -- Kazi Jamal, Eric Lau, and Raymond Lee
SoftDev1 pd9
P04 -- Let the Data Speak
2020-05-04
'''

from flask import Flask, request, redirect, session, render_template, url_for, flash
import os
import urllib.request

app = Flask(__name__)
app.secret_key = os.urandom(32)

# DASHBOARD
@app.route('/')
def root():
    return render_template('dashboard.html')

# ABOUT
@app.route('/about')
def about():
    return render_template('about.html')

# SENTIMENT ANALYSIS
@app.route('/sentiment')
def sentiment():
    return render_template('sentiment/sentiment.html')


@app.route('/sentiment/publicmedia')
def publicmedia():
    return render_template('sentiment/publicmedia.html')


@app.route('/sentiment/trumptweets')
def trumptweets():
    return render_template('sentiment/trumptweets.html')

# TRANSPORTATION
@app.route('/transportation')
def transportation():
    return render_template('transportation/transportation.html')


@app.route('/transportation/nycpublic')
def nycpublic():
    return render_template('transportation/nycpublic.html')


@app.route('/transportation/mobility')
def mobility():
    return render_template('transportation/mobility.html')

# NUMBERS
@app.route('/numbers')
def numbers():
    return render_template('numbers.html')


# DATA TRANSFER
def transfer_csv(file_name):
    csv_file = os.path.dirname(
        os.path.abspath(__file__)) + '/static/data/' + file_name
    return open(csv_file).read()


def request_csv(url):
    req = urllib.request.Request(url)
    req = urllib.request.urlopen(req)
    return req.read().decode('utf8')


@app.route('/data/transportation/mta')
def turnstile_transfer():
    return transfer_csv('mta_turnstile.csv')


@app.route('/data/transportation/covid/<file_type>')
def covid_transfer(file_type):
    return request_csv(f'https://raw.githubusercontent.com/nychealth/coronavirus-data/master/{file_type}.csv')


if __name__ == '__main__':
    app.debug = True
    app.run()
