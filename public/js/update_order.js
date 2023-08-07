
let updateOrderForm = document.getElementById('update-order-form-ajax');

updateOrderForm.addEventListener("submit", function (e) {

// Prevent the form from submitting
e.preventDefault();

 // Get form fields we need to get data from
 let inputOrderID = document.getElementById("order-select");
 let inputCustomerID = document.getElementById("input-customer-id");
 let inputShipmentID = document.getElementById("input-shipment-id");
 //let inputOrderDate = document.getElementById("input-order-date");

 // Get the values from the form fields
 let orderIDValue = inputOrderID.value;
 let customerIDValue = inputCustomerID.value;
 let shipmentIDValue = inputShipmentID.value;
 //let orderDateValue = inputOrderDate.value;


 // might need to delete once we implement these CRUD tables
 if (isNaN(customerIDValue))
 {
    return;
 }

 if (isNaN(shipmentIDValue))
 {
    return;
 }

 // Put our data we want to send in a javascript object
 let data = {
     orderID:    orderIDValue,
     customerID: customerIDValue,
     shipmentID: shipmentIDValue,
     //orderDate: orderDateValue,
}

 // Setup our AJAX request
 var xhttp = new XMLHttpRequest();
 xhttp.open("PUT", "/update-order", true);
 xhttp.setRequestHeader("Content-type", "application/json");

 // Tell our AJAX request how to resolve
 xhttp.onreadystatechange = () => {
     if (xhttp.readyState == 4 && xhttp.status == 200) {

         // Add the new data to the table
         updateRow(xhttp.response, orderIDValue);

     }
     else if (xhttp.readyState == 4 && xhttp.status != 200) {
         console.log("There was an error with the input.")
     }
 }

 // Send the request and wait for the response
 xhttp.send(JSON.stringify(data));




 function updateRow(data, orderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of order value
            let tdCustomer = updateRowIndex.getElementsByTagName("td")[1];
            let tdShipment = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign order to our value we updated to
            td.Customer.innerHTML = parsedData[0].customerID;
            td.Shipment.innerHTML = parsedData[0].shipmentID;
       }
    }
}
});