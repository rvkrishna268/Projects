function updateRigOptions() {
  var rigType = $("#rigType").val();
  var rigSelect = $("#rig");
  rigSelect.empty();

  if (rigType === "Onshore") {
    $("#savingsTypeSection").removeClass("hidden");
    $("#timeSection").removeClass("hidden");
    $("#fuelSection").addClass("hidden");
    rigSelect.append(
      new Option("Onshore Drilling Rig", "Onshore Drilling Rig")
    );
    $("#savingsType").val("Time");
    toggleSavingsType();
  } else if (rigType === "Offshore") {
    $("#savingsTypeSection").addClass("hidden");
    $("#timeSection").removeClass("hidden");
    $("#fuelSection").addClass("hidden");
    rigSelect.append(new Option("Drillship", "Drillship"));
    rigSelect.append(new Option("Semi-Submersible", "Semi-Submersible"));
    rigSelect.append(new Option("Jack-up", "Jack-up"));
  }
}

function toggleSavingsType() {
  var savingsType = $("#savingsType").val();
  if (savingsType === "Time") {
    $("#timeSection").removeClass("hidden");
    $("#fuelSection").addClass("hidden");
  } else {
    $("#timeSection").addClass("hidden");
    $("#fuelSection").removeClass("hidden");
  }
}

function submitForm() {
  var formData = {};
  $("#emissionsForm")
    .find("input, select")
    .each(function () {
      formData[this.name] = $(this).val() || "0"; // Ensure no empty values are sent
    });

  console.log("Sending data:", formData); // Log data being sent

  $.ajax({
    url: "/calculate",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      console.log("Received response:", response); // Log received response
      // Check if the response contains the emissions data
      if (response && response.CO2e !== undefined && !isNaN(response.CO2e)) {
        displayResults(response, "results");
      } else {
        $("#results").html(
          "<h3>Error: Invalid response received from the server.</h3>"
        );
      }
    },
    error: function (error) {
      console.error("Error:", error);
      $("#results").html(
        "<h3>Error: Could not reach the server. Please try again later.</h3>"
      );
    },
  });
}

function submitGeneratorForm() {
  var formData = {};
  $("#generatorForm")
    .find("input, select")
    .each(function () {
      formData[this.name] = $(this).val() || "0"; // Ensure no empty values are sent
    });

  console.log("Sending data:", formData); // Log data being sent

  $.ajax({
    url: "/calculate_generator",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      console.log("Received response:", response); // Log received response
      // Check if the response contains the emissions data
      if (response && response.CO2e !== undefined && !isNaN(response.CO2e)) {
        displayResults(response, "generatorResults");
      } else {
        $("#generatorResults").html(
          "<h3>Error: Invalid response received from the server.</h3>"
        );
      }
    },
    error: function (error) {
      console.error("Error:", error);
      $("#generatorResults").html(
        "<h3>Error: Could not reach the server. Please try again later.</h3>"
      );
    },
  });
}

function submitScope1Form() {
  var formData = {};
  $("#scope1Form")
    .find("input, select")
    .each(function () {
      formData[this.name] = $(this).val() || "0"; // Ensure no empty values are sent
    });

  console.log("Sending data:", formData); // Log data being sent

  $.ajax({
    url: "/calculate_scope1_emissions",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      console.log("Received response:", response); // Log received response
      // Check if the response contains the emissions data
      if (response && response.CO2e !== undefined && !isNaN(response.CO2e)) {
        displayResults(response, "scope1Results");
      } else {
        $("#scope1Results").html(
          "<h3>Error: Invalid response received from the server.</h3>"
        );
      }
    },
    error: function (error) {
      console.error("Error:", error);
      $("#scope1Results").html(
        "<h3>Error: Could not reach the server. Please try again later.</h3>"
      );
    },
  });
}

function submitco2MobForm() {
  var formData = {};
  $("#co2MobForm")
    .find("input, select")
    .each(function () {
      formData[this.name] = $(this).val() || "0"; // Ensure no empty values are sent
    });

  console.log("Sending data:", formData); // Log data being sent

  $.ajax({
    url: "/co2_mobile_fuel_amount",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      console.log("Received response:", response); // Log received response
      // Check if the response contains the emissions data
      if (
        response &&
        response.metric_ton_co2 !== undefined &&
        !isNaN(response.metric_ton_co2)
      ) {
        displayOnlyCo2Results(response, "co2MobResults");
      } else {
        $("#co2MobResults").html(
          "<h3>Error: Invalid response received from the server.</h3>"
        );
      }
    },
    error: function (error) {
      console.error("Error:", error);
      $("#co2MobResults").html(
        "<h3>Error: Could not reach the server. Please try again later.</h3>"
      );
    },
  });
}
function displayResults(data, elementId) {
  var resultsDiv = $("#" + elementId);
  resultsDiv.empty(); // Clear previous results

  var resultsHTML = `
        <div class="result-box">
            <div class="result-label-header">Total CO2e Emissions (Metric Ton)</div>
            <div class="result-value-large">${parseFloat(data.CO2e).toFixed(
              6
            )}</div>
        </div>
        <div class="result-box result-row">
            <div class="result-field">
                <div class="result-label">Carbon Dioxide (Metric Ton):</div>
                <div class="result-value">${parseFloat(data.CO2).toFixed(
                  6
                )}</div>
            </div>
            <div class="result-field">
                <div class="result-label">Methane (Metric Ton):</div>
                <div class="result-value-1">${parseFloat(data.CH4).toFixed(
                  6
                )}</div>
            </div>
            <div class="result-field">
                <div class="result-label">Nirous Oxide (Metric Ton):</div>
                <div class="result-value">${parseFloat(data.N2O).toFixed(
                  6
                )}</div>
            </div>
        </div>`;

  resultsDiv.html(resultsHTML);
}

function displayOnlyCo2Results(data, elementId) {
  var resultsDiv = $("#" + elementId);
  resultsDiv.empty(); // Clear previous results

  var resultsHTML = `
        <div class="result-box">
            <div class="result-label-header">Total Carbon Dioxide Emissions</div>
            <div class="result-value-large">${parseFloat(
              data.metric_ton_co2
            ).toFixed(6)}</div>
        </div>
    `;
  resultsDiv.html(resultsHTML);
}
function addRow(button) {
  var row = $(button).closest("tr").clone();
  console.log(row);
  row.find("input, select").val("");
  row
    .find("button")
    .removeClass("btn-success")
    .addClass("btn-danger")
    .text("-")
    .attr("onclick", "removeRow(this)");
  $(button).closest("tbody").append(row);
}

function addRowPage4(tableBodyId) {
  var row = $("#" + tableBodyId + " tr:first").clone();
  row.find("input, select").val("");
  row
    .find("button")
    .removeClass("btn-success")
    .addClass("btn-danger")
    .text("-")
    .attr("onclick", "removeRow(this)");
  $("#" + tableBodyId).append(row);
}

function removeRow(button) {
  $(button).closest("tr").remove();
}

function submitScopeForm(category) {
  var formData = [];

  var tableBodyId;
  switch (category) {
    case "upstream":
      tableBodyId = "upstreamTableBody";
      break;
    // case "downstream":
    //   tableBodyId = "downstreamTableBody";
    //   break;
    case "business_travel":
      tableBodyId = "businessTravelTableBody";
      break;

    default:
      console.error("Invalid category:", category);
      return;
  }

  $("#" + tableBodyId + " tr").each(function () {
    var vehicleType = $(this).find('select[name="vehicle_type[]"]').val();
    var distanceUnit = $(this).find('select[name="distance_unit[]"]').val();
    var distance = $(this).find('input[name="distance[]"]').val();
    var numPassengers = $(this).find('input[name="num_passengers[]"]').val();


    if (vehicleType && distanceUnit && distance && numPassengers) {
      formData.push({
        vehicle_type: vehicleType,
        unit: distanceUnit,
        distance: parseFloat(distance),
        num_passengers: parseInt(numPassengers) || 1,
        category: category,
      });
    }
  });

  console.log("Sending data:", formData);

  $.ajax({
    url: "/scope3",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      console.log("Received response:", response);
      if (response && response.results) {
        displayScope3Results(response, "results");
      } else {
        $("#results").html(
          "<h3>Error: Invalid response received from the server.</h3>"
        );
      }
    },
    error: function (error) {
      console.error("Error:", error);
      $("#results").html(
        "<h3>Error: Could not reach the server. Please try again later.</h3>"
      );
    },
  });
}

function displayScope3Results(data, elementId) {
  var resultsDiv = $("#" + elementId);
  resultsDiv.empty();

  var resultsHTML =
    '<table class="table"><thead><tr><th>Carbon Dioxide (Metric Ton)</th><th>Methane (Metric Ton)</th><th>Nitrous Oxide (Metric Ton)</th><th>CO2e (Metric Ton)</th></tr></thead><tbody>';

  data.results.forEach(function (result) {
    resultsHTML += `<tr>
                            <td>${parseFloat(result.CO2).toFixed(8)}</td>
                            <td>${parseFloat(result.CH4).toFixed(8)}</td>
                            <td>${parseFloat(result.N2O).toFixed(8)}</td>
                            <td>${parseFloat(result.CO2e).toFixed(8)}</td>
                        </tr>`;
  });

  resultsHTML += "</tbody></table>";

  resultsHTML += `<h3>Total Emissions</h3>
  <div class="total-emissions-container">
  <div class="total-co2e">
      <div class="total-co2e-header">Total CO2e Emissions (Metric Ton):</div>
      <div class="total-co2e-value" id="total-co2e-value">${parseFloat(
        data.total.CO2e
      ).toFixed(6)}</div>
  </div>
  <div class="individual-emissions">
      <div class="emission-box">
          <div class="emission-label">Carbon Dioxide (Metric Ton):</div>
          <div class="emission-value1" id="co2-emissions-value">${parseFloat(
            data.total.CO2
          ).toFixed(6)}</div>
      </div>
      <div class="emission-box">
          <div class="emission-label">Methane (Metric Ton):</div>
          <div class="emission-value" id="ch4-emissions-value">${parseFloat(
            data.total.CH4
          ).toFixed(6)}</div>
      </div>
      <div class="emission-box">
          <div class="emission-label">Nitrous Oxide (Metric Ton):</div>
          <div class="emission-value1" id="n2o-emissions-value">${parseFloat(
            data.total.N2O
          ).toFixed(6)}</div>
      </div>
  </div>
</div>`;

  resultsDiv.html(resultsHTML);
}

document.addEventListener("DOMContentLoaded", (event) => {
  // Select all input fields that need to be checked
  const inputs = document.querySelectorAll('input[type="number"][min="0"]');

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value < 0) {
        input.value = 0;
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", (event) => {
  const vehicleTypeSelects = document.querySelectorAll(".vehicle-type");
  const numPassengersHeader = document.getElementById("numPassengersHeader");

  vehicleTypeSelects.forEach((select) => {
    select.addEventListener("change", function () {
      const row = this.closest("tr");
      const numPassengersContainer = row.querySelector(
        ".num-passengers-container"
      );

      if (
        ["Passenger Car", "Light-Duty Truck", "Motorcycle"].includes(this.value)
      ) {
        numPassengersContainer.classList.add("hidden");
      } else {
        numPassengersContainer.classList.remove("hidden");
      }

      // Check if any of the selects have a value that should show the header
      let showHeader = false;
      vehicleTypeSelects.forEach((sel) => {
        if (
          !["Passenger Car", "Light-Duty Truck", "Motorcycle"].includes(
            sel.value
          ) &&
          sel.value !== ""
        ) {
          showHeader = true;
        }
      });

      if (showHeader) {
        numPassengersHeader.classList.remove("hidden");
      } else {
        numPassengersHeader.classList.add("hidden");
      }
    });
  });
  // Select all input fields that need to be checked
  const inputs = document.querySelectorAll('input[type="number"][min="0"]');

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value < 0) {
        input.value = 0;
      }
    });
  });
});

function addRowPage5(tableBodyId) {
  var row = $("#" + tableBodyId + " tr:first").clone();
  row.find("input, select").val("");
  row.find(".num-passengers-container").addClass("hidden"); // Ensure the new row's passengers field is hidden initially
  row
    .find("button")
    .removeClass("btn-success")
    .addClass("btn-danger")
    .text("-")
    .attr("onclick", "removeRow(this)");
  $("#" + tableBodyId).append(row);

  // Reapply the change event listener for the new row's vehicle type select
  row.find(".vehicle-type").on("change", function () {
    const numPassengersContainer = row.find(".num-passengers-container");
    if (
      ["Passenger Car", "Light-Duty Truck", "Motorcycle"].includes(this.value)
    ) {
      numPassengersContainer.addClass("hidden");
    } else {
      numPassengersContainer.removeClass("hidden");
    }
    // Check if any of the selects have a value that should show the header
    let showHeader = false;
    $(".vehicle-type").each(function () {
      if (
        !["Passenger Car", "Light-Duty Truck", "Motorcycle"].includes(
          this.value
        ) &&
        this.value !== ""
      ) {
        showHeader = true;
      }
    });

    if (showHeader) {
      $("#numPassengersHeader").removeClass("hidden");
    } else {
      $("#numPassengersHeader").addClass("hidden");
    }
  });
}
