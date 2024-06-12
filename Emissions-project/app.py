from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sys

app = Flask(__name__)
CORS(app)

# RigsEmission
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

# Generator emissions        
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

#Scope1emission:
class Scope1EmissionsCalculator:
    def __init__(self):
        self.meta_data = {
            "Passenger Car": {
                "co2": 0.175,
                "ch4": 0.005,
                "n2o": 0.003,
            },
            "Light-Duty Truck": {
                "co2": 0.955,
                "ch4": 0.026,
                "n2o": 0.023,
            },
            "Motorcycle": {
                "co2": 0.377,
                "ch4": 0.0,
                "n2o": 0.019,
            },
            "Medium- and Heavy-Duty Truck": {
                "co2": 0.168,
                "ch4": 15,
                "n2o": 0.0047,
            }
        }

    def calculate_emissions(self, vehicle_type, distance=0, unit='miles'):
        distance = int(distance)
        if unit == 'km':
            distance = distance / 1.609
        co2 = distance * self.meta_data[vehicle_type]["co2"] * (1 / 1000)
        ch4 = distance * self.meta_data[vehicle_type]["ch4"] * (1 / 1000000)
        n2o = distance * self.meta_data[vehicle_type]["n2o"] * (1 / 1000000)
        return {
            "CO2": co2,
            "CH4": ch4,
            "N2O": n2o,
            "CO2e": (co2 + ch4 * 28 + n2o * 265)
        }

#co2mobl
class Co2MblFuelAMountCalculator:
    def __init__(self) -> None:
        self.meta_data = {
            "Motor Gasoline": {
                "kg_co2_per_unit": 8.78,
            },
            "Diesel Fuel": {
                "kg_co2_per_unit": 10.21,
            },
            "Liquefied Natural Gas (LNG)": {
                "kg_co2_per_unit": 4.5,
            },
            "Ethanol (100%)": {
                "kg_co2_per_unit": 5.75,
            },
            "Biodiesel (100%)": {
                "kg_co2_per_unit": 9.45,
            },
            "Liquefied Petroleum Gases (LPG) (Propane)": {
                "kg_co2_per_unit": 5.68,
            },
        }

    def calculate_emissions(self, fuel_type, fuel_consumption, unit):
        fuel_consumption = int(fuel_consumption)
        if unit == 'liter':
            fuel_consumption /= 3.785
        return {
            "metric_ton_co2": fuel_consumption * self.meta_data[fuel_type]["kg_co2_per_unit"] * (1 / 1000)
        }
#scope3
class Scope3Calculator:
    def __init__(self) -> None:
        self.meta_data = {
            "upstream": {
                "Medium- and Heavy-Duty Truck": {
                    "co2": 1.247,
                    "ch4": 0.011,
                    "n2o": 0.035,
                },
                "Passenger Car": {
                    "co2": 0.175,
                    "ch4": 0.005,
                    "n2o": 0.003,
                },
                "Light-Duty Truck": {
                    "co2": 0.955,
                    "ch4": 0.026,
                    "n2o": 0.023,
                },
                "Medium- and Heavy-Duty Truck-ds": {
                    "co2": 0.168,
                    "ch4": 15,
                    "n2o": 0.0047,
                },
                "Rail": {
                    "co2": 0.022,
                    "ch4": 0.0017,
                    "n2o": 0.0005,
                },
                "Waterborne Craft": {
                    "co2": 0.082,
                    "ch4": 0.0326,
                    "n2o": 0.0021,
                },
                "Aircraft": {
                    "co2": 0.905,
                    "ch4": 0,
                    "n2o": 0.0279,
                },
            },
            "business_travel": {
                "Passenger Car": {
                    "co2": 0.175,
                    "ch4": 0.005,
                    "n2o": 0.003,
                },
                "Light-Duty Truck": {
                    "co2": 0.955,
                    "ch4": 0.026,
                    "n2o": 0.023,
                },
                "Motorcycle": {
                    "co2": 0.377,
                    "ch4": 0.0,
                    "n2o": 0.019,
                },
                "Intercity Rail": {
                    "co2": 0.113,
                    "ch4": 0.0092,
                    "n2o": 0.0026,
                },
                "Commuter Rail": {
                    "co2": 0.133,
                    "ch4": 0.0105,
                    "n2o": 26,
                },
                "Transit Rail": {
                    "co2": 0.093,
                    "ch4": 0.0075,
                    "n2o": 10,
                },
                "Bus": {
                    "co2": 0.071,
                    "ch4": 0.0,
                    "n2o": 0.0021,
                },
                "Air Travel - Short Haul": {
                    "co2": 0.207,
                    "ch4": 0.0064,
                    "n2o": 0.0066,
                },
                "Air Travel - Medium Haul": {
                    "co2": 0.129,
                    "ch4": 0.0006,
                    "n2o": 0.0041,
                },
                "Air Travel - Long Haul": {
                    "co2": 0.163,
                    "ch4": 0.0006,
                    "n2o": 0.0052,
                },
            }
        }

    def calculate_emissions(self, category, vehicle_type,num_turns, unit, distance, num_passengers=1):
        distance = int(distance)
        if unit == 'km':
            distance = distance / 1.609

        co2 = distance * (self.meta_data[category][vehicle_type]["co2"]) * (1 / 1000) * num_passengers * num_turns
        ch4 = distance * (self.meta_data[category][vehicle_type]["ch4"]) * (1 / 1000000) * num_passengers * num_turns
        n2o = distance * (self.meta_data[category][vehicle_type]["n2o"]) * (1 / 1000000) * num_passengers * num_turns
        co2e = (co2 * 1) + (ch4 * 28) + (n2o * 265)
        return {
            "CO2": co2,
            "CH4": ch4,
            "N2O": n2o,
            "CO2e": co2e,
        }



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/page2')
def page2():
    return render_template('page2.html')

@app.route('/page3')
def page3():
    return render_template('page3.html')

@app.route('/page4')
def page4():
    return render_template('page4.html')

@app.route('/page5')
def page5():
    return render_template('page5.html')


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


@app.route('/calculate_generator', methods=['POST'])
def calculate_generator():
    data = request.get_json() or {}
    calculator = GeneratorEmissionsCalculator()
    result = calculator.calculate_emissions(
        fuel_amount=data.get('fuel_amount', '0'),
        fuel_units=data.get('fuel_units', 'Gallons')
    )
    return jsonify(result)


@app.route('/calculate_scope1_emissions', methods=['POST'])
def calculate_scope1_emissions():
    try:
        data = request.get_json() or {}
        calculator = Scope1EmissionsCalculator()
        result = calculator.calculate_emissions(
            vehicle_type=data.get("vehicle_type"),
            distance=data.get('distance', 0),
            unit=data.get('unit', 'miles')
        )
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({
            "message": "Something Went Wrong, Please try again",
            "error": str(e)
        }), 500

@app.route('/co2_mobile_fuel_amount', methods=['POST'])
def co2_mobile_fuel_amount():
    try:
        data = request.get_json() or {}
        calculator = Co2MblFuelAMountCalculator()
        result = calculator.calculate_emissions(
            fuel_type=data.get("fuel_type"),
            fuel_consumption=data.get('fuel_consumption', 0),
            unit=data.get('unit', 'gallons')
        )
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({
            "message": "Something Went Wrong, Please try again",
            "error": str(e)
        }), 500

@app.route('/scope3', methods=['POST'])
def scope3():
    try:
        data = request.get_json() or []
        if not data:
            return jsonify({
                "message": "No data provided",
                "error": "Empty input list"
            }), 400

        calculator = Scope3Calculator()
        results = []
        for each_data in data:
            if each_data.get("vehicle_type") and each_data.get('unit'):
                result = calculator.calculate_emissions(
                    category=each_data.get("category"),
                    vehicle_type=each_data.get('vehicle_type'),
                    num_turns=each_data.get('num_turns'),
                    unit=each_data.get('unit', 'km'),
                    distance=each_data.get('distance', 0) or 0,
                    num_passengers=each_data.get('num_passengers', 1)
                )
                results.append(result)
        
        if not results:
            return jsonify({
                "message": "No valid results to process",
                "error": "Empty results list"
            }), 400

        summed_data = {key: sum(d[key] for d in results) for key in results[0]}
        return jsonify({
            "results": results,
            "total": summed_data
        })
    except Exception as e:
        return jsonify({
            "message": "Something Went Wrong, Please try again",
            "error": str(e)
        }), 500


if __name__ == '__main__':
    prod = '--prod' in sys.argv
    port = 80 if prod else 8080
    app.run(debug=True, use_reloader=not prod, port=port)
