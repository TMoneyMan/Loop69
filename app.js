
/*
    SETUP
*/

// Express
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static Files
app.use(express.static('public'))

PORT = 32797;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector.js');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');         // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));    // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                     // Tell express to use handlebars engine whenever it encounters a *.hbs file.

const { json } = require('express');

/*
    ROUTES
*/
// GET ROUTES

//Home Page
app.get('/', function (req, res) {
    res.render('index');
});

// ------------------------------------------------------------------------------------

// Orders
app.get('/orders', function (req, res) {
    let query1 = "SELECT * FROM Orders";

    // Dropdown
    let query2 = "SELECT * FROM Customers"

    db.pool.query(query1, function(error, rows, fields){   

        let orders = rows;

        db.pool.query(query2, function(error, rows, fields){
            let customers = rows;
            return res.render('orders', {orders: orders, customers: customers});
        })
    })                                                      
});     

// Add Order
app.post('/add-order', function(req, res) {
    let data = req.body;

    const customer_id = data.customerID
    const order_date = data.orderDate

    query1 = `INSERT INTO Orders (customer_id, order_date) VALUES ('${data.customerID}', '${data.orderDate}}')`;
    query2 = `SELECT LAST_INSERT_ID() AS shipment_id`;
    query3 = `INSERT INTO Shipments (shipment_id, order_id, shipment_date, shipment_status) VALUES (@shipment_id, @order_id, '${data.orderDate}', 'Shipped')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error)
            res.sendStatus(400);

        }
        else {

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    console.log(error);
                    res.sendStatus(400);

                }
                else {

                    db.pool.query(query3, function(error, rows, fields) {

                        if (error) {
                    
                            console.log(error);
                            res.sendStatus(400);
        
                        }
                        else {
                                    
                                    res.send(rows);
                }
            
            })
                
        }
            

    })

}})

});


// Search for an Order, view OrderItems (contents in Order)


// Delete Order
app.delete('/delete-order', function(req, res, next) {
    
    let data = req.body;

    let orderID = parseInt(data.id);
    
    let deleteOrderShip = `DELETE FROM Shipments where order_id = ?`
    let deleteOrder = `DELETE FROM Orders WHERE order_id = ?;`;

    // Run the 1st query
    db.pool.query(deleteOrder, [orderID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(deleteOrderShip, [orderID], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                    
                }
            })
        }
})});

// Update Order

//-----------------------------------------------------------------------

// Customers
app.get('/customers', function (req, res) {
    let query1 = "SELECT * FROM Customers";

    db.pool.query(query1, function(error, rows, fields){   

        res.render('customers', {customers: rows});   

    })                                                      
});  

// Search for Customers, view their orders

// Add Customer
app.post('/add-customer', function (req, res) {

    let data = req.body;

    query1 = `INSERT INTO Customers (first_name, last_name, email) VALUES ('${data.fname}', '${data.lname}', '${data.email}')`;
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error);
            res.sendStatus(400);

        }
        else {

            query2 = `SELECT * FROM Customers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    console.log(error);
                    res.sendStatus(400);

                }
                else {
                    res.send(rows);
                }

            })

        }


    })

});


// Update Customer
app.put('/put-customer-ajax', function(req,res,next){
    let data = req.body;
  
    let customer_id = parseInt(data.customer_id);
    let email = data.email;
  
    let selectCustomers = `SELECT * FROM Customers WHERE customer_id = ?`
    let queryUpdateCustomer = `UPDATE Customers SET email = ? WHERE Customers.customer_id = ?`;
    
  
          // Run the 1st query
          db.pool.query(selectCustomers, [customer_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(queryUpdateCustomer, [customer_id, email], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});


// Delete Customer
app.delete('/delete-customer', function(req, res, next) {
    
    let data = req.body;

    let customerID = parseInt(data.customer_id);
    if (isNaN(customer_id))
    {
        customer_id = 'NULL'
    }

    
    let query1 = `DELETE FROM Customers WHERE customer_id = ?`;
    let query2 = `DELETE FROM Orders WHERE customer_id = ?`


    db.pool.query(query2, [customerID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(query1, [customerID], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
})});


//-----------------------------------------------------------------------

// Shipments
app.get('/shipments', function (req, res) {
    let query1 = "SELECT * FROM Shipments";

    // Dropdown
    let query2 = "SELECT * from Orders";

    db.pool.query(query1, function(error, rows, fields){   

        let shipments = rows;

        db.pool.query(query2, function(error, rows, fields){
            let orders = rows;
            return res.render('shipments', {shipments: shipments, orders: orders});
        })

    })                                                      
});  

// Add Shipment
app.post('/add-shipment', function (req, res) {

    let data = req.body;

    let shipment_status = parseInt(data.shipment_status);
    if (isNaN(shipment_status))
    {
        shipment_status = 'NULL'
    }

    query1 = `INSERT INTO Shipments (order_id, shipment_date, shipment_status) VALUES ('${data.orderID}', '${data.shipmentDate}', '${data.shipmentStatus}')`;
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error);
            res.sendStatus(400);

        }
        else {

            query2 = `SELECT * FROM Shipments`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    console.log(error);
                    res.sendStatus(400);

                }
                else {
                    res.send(rows);
                }

            })

        }


    })

});

// Update Shipment

// Delete Shipment
app.delete('/delete-shipment', function(req, res, next) {
    
    let data = req.body;

    let shipmentID = parseInt(data.shipment_id);
    
    let query1 = `DELETE FROM Shipments WHERE shipment_id = ?`;
    let query2 = `DELETE FROM Orders WHERE shipment_id = ${shipmentID}`


    db.pool.query(query2, [shipmentID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(query1, [shipmentID], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
})});

//-----------------------------------------------------------------------

// Departments
app.get('/departments', function (req, res) {
    let query1 = "SELECT * FROM Departments";

    db.pool.query(query1, function(error, rows, fields){   

        res.render('departments', {departments: rows});   

    })                                                      
});  

// search departments for a specific item

// Add Department

// Update Department

// Delete Department

//-----------------------------------------------------------------------

// Items
app.get('/items', function (req, res) {
    let query1 = "SELECT * FROM Items";

    // Dropdown
    let query2 = "SELECT * FROM Departments";

    db.pool.query(query1, function(error, rows, fields){   

        let items = rows;

        db.pool.query(query2, function(error, rows, fields){

            let departments = rows;
            res.render('items', {items: items, departments: departments});  
        })
    })                                                      
});  

// Add Item
app.post('/add-item', function (req, res) {

    let data = req.body;

    query1 = `INSERT INTO Items (item_name, item_price, item_quantity, department_id) VALUES ('${data.itemName}', '${data.itemPrice}', '${data.itemQuantity}', '${data.deptID}')`;
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error);
            res.sendStatus(400);

        }
        else {

            query2 = `SELECT * FROM Items;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    console.log(error);
                    res.sendStatus(400);

                }
                else {
                    res.send(rows);
                }

            })

        }


    })

});


// Update Item

// Delete Item
app.delete('/delete-item', function(req, res, next) {
    
    let data = req.body;

    let item_id = parseInt(data.item_id);
    
    let query1 = `DELETE FROM Items WHERE item_id = ?`;

    db.pool.query(query1, [item_id], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        else
        {
            res.sendStatus(204);
        }
})});


//-----------------------------------------------------------------------

// Order Items

// Add to OrderItems when Order is created

// When order is updated, add to OrderItems

// When order is deleted, remove OrderItems entry


// -----------------------------------------------------------------------

/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
