// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputfName = document.getElementById("input-first-name");
    let inputlName = document.getElementById("input-last-name");
    let inputEmail = document.getElementById("input-email");

    // Get the values from the form fields
    let fNameValue = inputfName.value;
    let lNameValue = inputlName.value;
    let emailValue = inputEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        fname: fNameValue,
        lname: lNameValue,
        email: emailValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputfName.value = '';
            inputlName.value = '';
            inputEmail.value = '';
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
    let currentTable = document.getElementById("customers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let customerIDCell = document.createElement("TD");
    let fNameCell = document.createElement("TD");
    let lNameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");

    // Fill the cells with correct data
    customerIDCell.innerText = newRow.customer_id;
    fNameCell.innerText = newRow.first_name;
    lNameCell.innerText = newRow.last_name;
    emailCell.innerText = newRow.email;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteOrder(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(customerIDCell);
    row.appendChild(fNameCell);
    row.appendChild(lNameCell);
    row.appendChild(emailCell);
    
    row.setAttribute('data-value', newRow.customer_id);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("customer-select");
    let option = document.createElement("option");
    option.text = `${newRow.customer_id} - ${newRow.first_name} - ${newRow.last_name} - ${newRow.email}`;
    option.value = newRow.customer_id;
    selectMenu.add(option);
}
