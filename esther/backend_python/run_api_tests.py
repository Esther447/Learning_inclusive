from starlette.testclient import TestClient
import sys, os, json, traceback
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

try:
    from main import app
except Exception as e:
    print('Failed to import app:', e)
    traceback.print_exc()
    raise

client = TestClient(app)

email = 'it-local-test@example.com'
password = 'Password123'

print('\n=== Testing SIGNUP ===')
resp = client.post('/api/auth/signup', json={'email': email, 'password': password, 'name': 'IT Local'})
print('status', resp.status_code)
try:
    print('body', resp.json())
except Exception:
    print('body text', resp.text)

print('\n=== Testing LOGIN ===')
resp = client.post('/api/auth/login', json={'email': email, 'password': password})
print('status', resp.status_code)
try:
    print('body', resp.json())
except Exception:
    print('body text', resp.text)
