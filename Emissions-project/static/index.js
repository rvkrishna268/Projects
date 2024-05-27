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
                var resultsHTML = '<h3>Total Emissions:</h3>' +
                                '<p>CO2e (mt): ' + parseFloat(response.CO2e).toFixed(6) + '</p>' +
                                '<p>CO2 (mt): ' + parseFloat(response.CO2).toFixed(6) + '</p>' +
                                '<p>CH4 (mt): ' + parseFloat(response.CH4).toFixed(6) + '</p>' +
                                '<p>N2O (mt): ' + parseFloat(response.N2O).toFixed(6) + '</p>';
                $('#results').html(resultsHTML);
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
                var resultsHTML = '<h3>Total Emissions:</h3>' +
                                '<p>CO2e (mt): ' + parseFloat(response.CO2e).toFixed(6) + '</p>' +
                                '<p>CO2 (mt): ' + parseFloat(response.CO2).toFixed(6) + '</p>' +
                                '<p>CH4 (mt): ' + parseFloat(response.CH4).toFixed(6) + '</p>' +
                                '<p>N2O (mt): ' + parseFloat(response.N2O).toFixed(6) + '</p>';
                $('#generatorResults').html(resultsHTML);
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