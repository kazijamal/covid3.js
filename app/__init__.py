'''
TwoFortyNine -- Kazi Jamal, Eric Lau, and Raymond Lee
SoftDev1 pd9
P04 -- Let the Data Speak
2020-05-04
'''

from flask import Flask, request, redirect, session, render_template, url_for, flash
import os

app = Flask(__name__)
app.secret_key = os.urandom(32)

# DASHBOARD
@app.route('/')
def root():
    return render_template('dashboard.html')

# SENTIMENT ANALYSIS

# absolute path to num-articles-per-day.csv
num_articles_per_day_csv = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "csv", "num-articles-per-day.csv") 

@app.route('/sentiment')
def sentiment():
    return render_template('sentiment/sentiment.html')


@app.route('/sentiment/publicmedia')
def publicmedia():
    return render_template('sentiment/publicmedia.html')

@app.route("/data/sentiment/publicmedia")
def publicMediaData():
    return open(num_articles_per_day_csv).read() 
    
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
@app.route('/data/transportation/mta')
def mta_transfer():
    csv_file = os.path.dirname(
        os.path.abspath(__file__)) + '/mta_turnstile.csv'
    return open(csv_file).read()


if __name__ == '__main__':
    app.debug = True
    app.run()
