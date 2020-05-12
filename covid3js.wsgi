#!/usr/bin/python3
import sys
sys.path.insert(0,"/var/www/covid3js/")
sys.path.insert(0,"/var/www/covid3js/covid3js/")

import logging
logging.basicConfig(stream=sys.stderr)

from covid3js import app as application