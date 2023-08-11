// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("input-customer-id");
    let inputShipmentID = document.getElementById("input-shipment-id");
    let inputOrderDate = document.getElementById("input-order-date");

    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value;
    let shipmentIDValue = inputShipmentID.value;
    let orderDateValue = inputOrderDate.value;

    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDValue,
        shipmentID: shipmentIDValue,
        orderDate: orderDateValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerID.value = '';
            inputShipmentID.value = '';
            inputOrderDate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("orders-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let orderidCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let shipmentIDCell = document.createElement("TD");
    let orderDateCell = document.createElement("TD");

    // Fill the cells with correct data
    orderidCell.innerText = newRow.id;
    customerIDCell.innerText = newRow.customerID;
    shipmentIDCell.innerText = newRow.shipmentID;
    orderDateCell.innerText = newRow.orderDate;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteOrder(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(orderidCell);
    row.appendChild(customerIDCell);
    row.appendChild(shipmentIDCell);
    row.appendChild(orderDateCell);
    
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("order-select");
    let option = document.createElement("option");
    option.text = `${newRow.order_id} - ${newRow.customer_id} - ${newRow.shipment_id} - ${newRow.order_date}`;
    option.value = newRow.id;
    selectMenu.add(option);
}