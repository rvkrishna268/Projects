from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class GeneratorEmissionsCalculator:
    def __init__(self):
        self.emissions_data = {
            'CO2e per gallon': 0.01024268,
            'CO2 per gallon': 0.01021,
            'CH4 per gallon': 0.00000041,
            'N2O per gallon': 0.00000008
        }

    def calculate_emissions(self, fuel_amount, fuel_units):
        fuel_amount = float(fuel_amount)
        if fuel_units == 'Liters':
            fuel_amount *= 0.264172  # Convert liters to gallons
        
        emissions = {key.split(' per gallon')[0]: value * fuel_amount for key, value in self.emissions_data.items()}
        return emissions

@app.route('/calculate_generator', methods=['POST'])
def calculate_generator():
    data = request.get_json() or {}
    calculator = GeneratorEmissionsCalculator()
    result = calculator.calculate_emissions(
        fuel_amount=data.get('fuel_amount', '0'),
        fuel_units=data.get('fuel_units', 'Gallons')
    )
    return jsonify(result)

class RigEmissionsCalculator:
    def __init__(self):
        self.emissions_data = {
            'Drillship': {
                'CO2e per hour': 28.309968,
                'CO2 per hour': 27.972,
                'CH4 per hour': 0.000216,
                'N2O per hour': 0.001116
            },
            'Semi-Submersible': {
                'CO2e per hour': 26.84771694,
                'CO2 per hour': 26.50347,
                'CH4 per hour': 0.00106578,
                'N2O per hour': 0.00106578
            },
            'Jack-up': {
                'CO2e per hour': 4.727912132,
                'CO2 per hour': 4.671469688,
                'CH4 per hour': 3.60743E-05,
                'N2O per hour': 0.000186378
            },
            'Onshore Drilling Rig': {
                'CO2e per hour': 3.86307494,
                'CO2 per hour': 3.851212,
                'CH4 per hour': 0.000154652,
                'N2O per hour': 0.000030176,
                'CO2e per gallon': 0.01024268,
                'CO2 per gallon': 0.01021,
                'CH4 per gallon': 0.00000041,
                'N2O per gallon': 0.00000008
            }
        }

    def calculate_emissions(self, rig_type, savings_type='Time', time_hours=0, time_days=0, fuel_amount=0, fuel_units=None):
        emissions = {'CO2e': 0, 'CO2': 0, 'CH4': 0, 'N2O': 0}
        
        if savings_type == 'Fuel':
            fuel_amount = float(fuel_amount)
            if fuel_units == 'Liters':
                fuel_amount *= 0.264172  # Convert liters to gallons
            for gas in emissions:
                per_gallon_key = f'{gas} per gallon'
                if per_gallon_key in self.emissions_data[rig_type]:
                    emissions[gas] += self.emissions_data[rig_type][per_gallon_key] * fuel_amount
        else:  # Time calculations
            time_hours = float(time_hours)
            time_days = float(time_days)
            total_hours = time_hours + (time_days * 24)
            for gas in emissions:
                per_hour_key = f'{gas} per hour'
                if per_hour_key in self.emissions_data[rig_type]:
                    emissions[gas] += self.emissions_data[rig_type][per_hour_key] * total_hours

        return emissions

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json() or {}
    calculator = RigEmissionsCalculator()
    result = calculator.calculate_emissions(
        rig_type=data.get('rig_type', ''),
        savings_type=data.get('savings_type', 'Time'),
        time_hours=data.get('time_hours', '0'),
        time_days=data.get('time_days', '0'),
        fuel_amount=data.get('fuel_amount', '0'),
        fuel_units=data.get('fuel_units', '')
    )
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
