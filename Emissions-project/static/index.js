function updateRigOptions() {
    var rigType = $('#rigType').val();
    var rigSelect = $('#rig');
    rigSelect.empty();

    if (rigType === 'Onshore') {
        $('#savingsTypeSection').removeClass('hidden');
        $('#timeSection').removeClass('hidden');
        $('#fuelSection').addClass('hidden');
        rigSelect.append(new Option('Onshore Drilling Rig', 'Onshore Drilling Rig'));
        $('#savingsType').val('Time');
        toggleSavingsType();
    } else if (rigType === 'Offshore') {
        $('#savingsTypeSection').addClass('hidden');
        $('#timeSection').removeClass('hidden');
        $('#fuelSection').addClass('hidden');
        rigSelect.append(new Option('Drillship', 'Drillship'));
        rigSelect.append(new Option('Semi-Submersible', 'Semi-Submersible'));
        rigSelect.append(new Option('Jack-up', 'Jack-up'));
    }
}

function toggleSavingsType() {
    var savingsType = $('#savingsType').val();
    if (savingsType === 'Time') {
        $('#timeSection').removeClass('hidden');
        $('#fuelSection').addClass('hidden');
    } else {
        $('#timeSection').addClass('hidden');
        $('#fuelSection').removeClass('hidden');
    }
}

function submitForm() {
    var formData = {};
    $('#emissionsForm').find('input, select').each(function() {
        formData[this.name] = $(this).val() || '0'; // Ensure no empty values are sent
    });

    console.log('Sending data:', formData); // Log data being sent

    $.ajax({
        url: '/calculate',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            console.log('Received response:', response); // Log received response
            // Check if the response contains the emissions data
            if (response && response.CO2e !== undefined && !isNaN(response.CO2e)) {
                displayResults(response, 'results');
            } else {
                $('#results').html('<h3>Error: Invalid response received from the server.</h3>');
            }
        },
        error: function(error) {
            console.error('Error:', error);
            $('#results').html('<h3>Error: Could not reach the server. Please try again later.</h3>');
        }
    });
}

function submitGeneratorForm() {
    var formData = {};
    $('#generatorForm').find('input, select').each(function() {
        formData[this.name] = $(this).val() || '0'; // Ensure no empty values are sent
    });

    console.log('Sending data:', formData); // Log data being sent

    $.ajax({
        url: '/calculate_generator',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            console.log('Received response:', response); // Log received response
            // Check if the response contains the emissions data
            if (response && response.CO2e !== undefined && !isNaN(response.CO2e)) {
                displayResults(response, 'generatorResults');
            } else {
                $('#generatorResults').html('<h3>Error: Invalid response received from the server.</h3>');
            }
        },
        error: function(error) {
            console.error('Error:', error);
            $('#generatorResults').html('<h3>Error: Could not reach the server. Please try again later.</h3>');
        }
    });
}

function submitScope1Form() {
    var formData = {};
    $('#scope1Form').find('input, select').each(function() {
        formData[this.name] = $(this).val() || '0'; // Ensure no empty values are sent
    });

    console.log('Sending data:', formData); // Log data being sent

    $.ajax({
        url: '/calculate_scope1_emissions',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            console.log('Received response:', response); // Log received response
            // Check if the response contains the emissions data
            if (response && response.CO2e !== undefined && !isNaN(response.CO2e)) {
                displayResults(response, 'scope1Results');
            } else {
                $('#scope1Results').html('<h3>Error: Invalid response received from the server.</h3>');
            }
        },
        error: function(error) {
            console.error('Error:', error);
            $('#scope1Results').html('<h3>Error: Could not reach the server. Please try again later.</h3>');
        }
    });
}

function submitco2MobForm() {
    var formData = {};
    $('#co2MobForm').find('input, select').each(function() {
        formData[this.name] = $(this).val() || '0'; // Ensure no empty values are sent
    });

    console.log('Sending data:', formData); // Log data being sent

    $.ajax({
        url: '/co2_mobile_fuel_amount',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            console.log('Received response:', response); // Log received response
            // Check if the response contains the emissions data
            if (response && response.metric_ton_co2 !== undefined && !isNaN(response.metric_ton_co2)) {
                displayOnlyCo2Results(response, 'co2MobResults');
            } else {
                $('#co2MobResults').html('<h3>Error: Invalid response received from the server.</h3>');
            }
        },
        error: function(error) {
            console.error('Error:', error);
            $('#co2MobResults').html('<h3>Error: Could not reach the server. Please try again later.</h3>');
        }
    });
}
function displayResults(data, elementId) {
    var resultsDiv = $('#' + elementId);
    resultsDiv.empty(); // Clear previous results

    var resultsHTML = `
        <div class="result-box">
            <div class="result-label-header">Total CO2e Emissions (mt)</div>
            <div class="result-value-large">${parseFloat(data.CO2e).toFixed(6)}</div>
        </div>
        <div class="result-box result-row">
            <div class="result-field">
                <div class="result-label">CO2 (mt):</div>
                <div class="result-value">${parseFloat(data.CO2).toFixed(6)}</div>
            </div>
            <div class="result-field">
                <div class="result-label">CH4 (mt):</div>
                <div class="result-value-1">${parseFloat(data.CH4).toFixed(6)}</div>
            </div>
            <div class="result-field">
                <div class="result-label">N2O (mt):</div>
                <div class="result-value">${parseFloat(data.N2O).toFixed(6)}</div>
            </div>
        </div>`;

    resultsDiv.html(resultsHTML);
}

function displayOnlyCo2Results(data, elementId) {
    var resultsDiv = $('#' + elementId);
    resultsDiv.empty(); // Clear previous results

    var resultsHTML = `
        <div class="result-box">
            <div class="result-label-header">Total CO2 Emissions</div>
            <div class="result-value-large">${parseFloat(data.metric_ton_co2).toFixed(6)}</div>
        </div>
    `;
    resultsDiv.html(resultsHTML);
}

function addRow(button) {
    var row = $(button).closest('tr').clone();
    row.find('input, select').val('');
    row.find('button').removeClass('btn-success').addClass('btn-danger').text('-').attr('onclick', 'removeRow(this)');
    $('#tableBody').append(row);
}

function removeRow(button) {
    $(button).closest('tr').remove();
}

function submitScopeForm(category) {
    var formData = [];

    var tableBodyId;
    switch (category) {
        case 'upstream':
            tableBodyId = 'upstream';
            break;
        case 'downstream':
            tableBodyId = 'downstream';
            break;
        case 'business_travel':
            tableBodyId = 'business_travel';
            break;
        case 'employee_commuting':
            tableBodyId = 'employee_commuting';
            break;
        default:
            console.error('Invalid category:', category);
            return;
    }
    
    $('#' + tableBodyId + ' tr').each(function() {
        var vehicleType = $(this).find('select[name="vehicle_type[]"]').val();
        var distanceUnit = $(this).find('select[name="distance_unit[]"]').val();
        var distance = $(this).find('input[name="distance[]"]').val();

        if (vehicleType && distanceUnit && distance) {
            formData.push({
                vehicle_type: vehicleType,
                unit: distanceUnit,
                distance: parseFloat(distance),
                category: category
            });
        }
    });

    console.log('Sending data:', formData);

    $.ajax({
        url: '/scope3',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            console.log('Received response:', response);
            if (response && response.results) {
                displayResults(response, 'results');
            } else {
                $('#results').html('<h3>Error: Invalid response received from the server.</h3>');
            }
        },
        error: function(error) {
            console.error('Error:', error);
            $('#results').html('<h3>Error: Could not reach the server. Please try again later.</h3>');
        }
    });
}

function displayResults(data, elementId) {
    var resultsDiv = $('#' + elementId);
    resultsDiv.empty();

    var resultsHTML = '<table class="table"><thead><tr><th>CH4 (mt)</th><th>CO2 (mt)</th><th>CO2e (mt)</th><th>NO2 (mt)</th></tr></thead><tbody>';
    
    data.results.forEach(function(result) {
        resultsHTML += `<tr>
                            <td>${parseFloat(result.CH4).toFixed(8)}</td>
                            <td>${parseFloat(result.CO2).toFixed(8)}</td>
                            <td>${parseFloat(result.CO2e).toFixed(8)}</td>
                            <td>${parseFloat(result.NO2).toFixed(8)}</td>
                        </tr>`;
    });

    resultsHTML += '</tbody></table>';

    resultsHTML += `<h3>Total Emissions</h3>
                    <table class="table">
                        <thead><tr><th>CH4 (mt)</th><th>CO2 (mt)</th><th>CO2e (mt)</th><th>NO2 (mt)</th></tr></thead>
                        <tbody>
                            <tr>
                                <td>${parseFloat(data.total.CH4).toFixed(8)}</td>
                                <td>${parseFloat(data.total.CO2).toFixed(8)}</td>
                                <td>${parseFloat(data.total.CO2e).toFixed(8)}</td>
                                <td>${parseFloat(data.total.NO2).toFixed(8)}</td>
                            </tr>
                        </tbody>
                    </table>`;

    resultsDiv.html(resultsHTML);
}