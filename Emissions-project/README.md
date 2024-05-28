
## API Routes

### Route: /calculate_scope1_emissions

#### curl

```
curl --location 'http://127.0.0.1:5001/calculate_scope1_emissions' \
--header 'Content-Type: application/json' \
--data '{
    "distance": 1,
    "unit": "miles",
    "vehicle_type": "Medium- and Heavy-Duty Truck"
}'
```

Description of the endpoint.

- **Path:** `/calculate_scope1_emissions`
- **HTTP Method:** `POST`
- **Parameters:**
  - `distance`: integer
  - `unit`: Any of these 2
    - km
    - miles
  - `vehicle_type`: Any of the following options
    - Passenger Car
    - Light-Duty Truck
    - Motorcycle
    - Medium- and Heavy-Duty Truck


### Route: /co2_mobile_fuel_amount

#### curl

```
curl --location 'http://127.0.0.1:5001/co2_mobile_fuel_amount' \
--header 'Content-Type: application/json' \
--data '{
    "fuel_type": "Motor Gasoline",
    "unit": "gallons",
    "fuel_consumption": 1
}'
```

Description of the endpoint.

- **Path:** `/co2_mobile_fuel_amount`
- **HTTP Method:** `POST`
- **Parameters:**
  - `fuel_type`: Any of the following options
    - Motor Gasoline
    - Diesel Fuel
    - Liquefied Natural Gas (LNG)
    - Ethanol (100%)
    - Biodiesel (100%)
    - Liquefied Petroleum Gases (LPG) (Propane)
  - `unit`: Any of these 2
    - gallons
    - liter
  - `fuel_consumption`: integer
