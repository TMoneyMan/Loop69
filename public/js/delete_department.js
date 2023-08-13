function deleteDepartment(departmentID) {
    // Put our data we want to send in a javascript object
    let data = {
        department_id: departmentID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-department", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Delete the new data from the table
            deleteRow(data.department_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(department_id){

    let table = document.getElementById("departments-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == department_id) {
            table.deleteRow(i);
            break;
       }
    }
}

function deleteDropDownMenu(departmentID){
    let selectMenu = document.getElementById("input-deptName-update");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(departmentID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }