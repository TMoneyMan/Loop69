function deleteOrder(orderID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: orderID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // delete data from table
            deleteRow(orderID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(orderID){

    let table = document.getElementById("orders-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {
            table.deleteRow(i);
            break;
       }
    }
}

function deleteDropDownMenu(orderID){
    let selectMenu = document.getElementById("order-select");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(orderID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }