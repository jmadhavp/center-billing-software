
@echo off
echo Starting Flask server...
cd src
python -m flask run --host=0.0.0.0 --port=5000
echo Flask server started. Opening browser...
start http://localhost:5000
