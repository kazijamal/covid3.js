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


@app.route('/')
def root():
    return render_template('index.html')


if __name__ == '__main__':
    app.debug = True
    app.run()
