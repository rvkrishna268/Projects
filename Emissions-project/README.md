
## Route: /calculate_scope1_emissions

### curl

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
