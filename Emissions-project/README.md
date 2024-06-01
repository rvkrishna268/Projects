
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


### Route: /scope3

#### curl

```
curl --location 'http://127.0.0.1:8080/scope3' \
--header 'Content-Type: application/json' \
--data '[
    {
        "distance": 1,
        "unit": "miles",
        "vehicle_type": "Medium- and Heavy-Duty Truck",
        "category": "upstream"
    },
    {
        "distance": 1,
        "unit": "miles",
        "vehicle_type": "Medium- and Heavy-Duty Truck",
        "category": "upstream"
    }
]'
```

Description of the endpoint.

- **Path:** `/scope3`
- **HTTP Method:** `POST`
- **Parameters:**
  - `distance`: integer
  - `unit`: Any of these 2
    - km
    - miles
  - `category`: Any of the below
    - upstream
    - downstream
    - business_travel
    - employee_commuting
  - `vehicle_type`: Any of the following options category wise
    - business_travel
      - Passenger Car 
      - Light-Duty Truck
      - Motorcycle
    - employee_commuting
      - Intercity Rail
      - Commuter Rail
      - Transit Rail (i.e. Subway, Tram) 
      - Bus
      - Air Travel - Short Haul (< 300 miles) 
      - Air Travel - Medium Haul (>= 300 miles, < 2300 miles) 
      - Air Travel - Long Haul (>= 2300 miles) 
    - upstream
      - Medium- and Heavy-Duty Truck
      - Passenger Car
      - Light-Duty Truck
    - downstream
      - Medium- and Heavy-Duty Truck
      - Rail
      - Waterborne Craft (i.e. Ships, Boats, Barges etc.)
      - Aircraft (i.e. Airplanes, Helicopters)
  
