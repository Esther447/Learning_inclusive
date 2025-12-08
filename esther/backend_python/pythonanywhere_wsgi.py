"""
WSGI Configuration for PythonAnywhere
This file should be uploaded to PythonAnywhere and configured in the Web app settings.

Path in PythonAnywhere: /var/www/yourusername_pythonanywhere_com_wsgi.py
"""

import sys
import os

# Add your project directory to the path
# IMPORTANT: Replace 'yourusername' with your actual PythonAnywhere username
# IMPORTANT: Replace 'inclusive_learning_backend' with the actual folder name where you uploaded your code
project_home = '/home/yourusername/inclusive_learning_backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set the working directory
os.chdir(project_home)

# Import your FastAPI app
from main import app

# For PythonAnywhere, we need to use a WSGI wrapper
# mangum is already in requirements.txt
from mangum import Mangum

# Create the WSGI handler
handler = Mangum(app)

# PythonAnywhere expects 'application' variable
application = handler

