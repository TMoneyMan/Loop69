
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

PORT = 32796;                 // Set a port number at the top so it's easy to change in the future

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

    let query2 = "SELECT * FROM Customers"

    db.pool.query(query1, function(error, rows, fields){   

        res.render('orders', {orders: rows});   

    })                                                      
});     

// Add Order
app.post('/add-order', function(req, res)
{
    let data = req.body;

<<<<<<< HEAD
    query1 = `INSERT INTO Shipments (shipment_date, shipment_status) VALUES ('${data.orderDate}}', '${false}}')`
=======
    query1 = `INSERT INTO Orders (customer_id, order_date) VALUES ('${data.customerID}', '${data.orderDate}}')`;
>>>>>>> 2405a5b1f13bc840b4841da2fb7dad6ccca0afb7
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error)
            res.sendStatus(400);

        }
        else {

            const nextShipmentID = db.pool.query('SELECT * FROM Shipments ORDER BY shipment_id DESC LIMIT 1')

            query2 = `INSERT INTO Orders (customer_id, shipment_id, order_date) SELECT '${data.customerID}', '${shipment_id}' , '${data.orderDate}}' from Shipments ORDER BY shipment_id DESC LIMIT 1`;
            db.pool.query(query2, function (error, rows, fields) {
        
                if (error) {
        
                    console.log(error)
                    res.sendStatus(400);
        
                }
                else {
        
                    query3 = `SELECT * FROM Orders;`;
                    db.pool.query(query3, function(error, rows, fields){
        
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

        }

    })

   
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

// Delete Customer
app.delete('/delete-customer', function(req, res, next) {
    
    let data = req.body;

    let customerID = parseInt(data.customer_id);
    
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

    db.pool.query(query1, function(error, rows, fields){   

        res.render('shipments', {shipments: rows});   

    })                                                      
});  

// find a shipment by searching for its order_id

// Add Shipment

// Update Shipment

// Delete Shipment

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
app.post('/add-department', function (req, res) {

    let data = req.body;

    query1 = `INSERT INTO Departments (department_name, dept_quantity) VALUES ('${data.dName}', '${data.dQuant}')`;
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error);
            res.sendStatus(400);

        }
        else {

            query2 = `SELECT * FROM Departments;`;
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

// Update Department


// Delete Department
app.delete('/delete-department', function(req, res, next) {

    let data = req.body;

    let departmentID = parseInt(data.department_id);

    let query1 = `DELETE FROM Departments WHERE department_id = ?`;
    let query2 = `DELETE FROM Items WHERE department_id = ?`


    db.pool.query(query2, [departmentID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(query1, [departmentID], function(error, rows, fields) {

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

// Items
app.get('/items', function (req, res) {
    let query1 = "SELECT * FROM Items";

    db.pool.query(query1, function(error, rows, fields){   

        res.render('items', {items: rows});   

    })                                                      
});  


// Add Item
app.post('/add-item-ajax', function(req, res)
{
    let data = req.body

    let item_quantity = parseInt(data.itemQuantity);
    console.log(item_quantity);
    if (item_quantity === '') {

        item_quantity = NULL

    }

    query1 = `INSERT INTO Items (item_name, item_price, item_quantity, department_id) VALUES (?, ?, ?, ?)`;
    db.pool.query(query1, [data.item_name, data.item_price, data.item_quantity, data.department_id],
        function (error, fields) {

        if (error) {

            console.log(error)
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


//-----------------------------------------------------------------------

// Order Items

// Add to OrderItems when Order is created

// When order is updated, add to OrderItems

// When order is deleted, remove OrderItems entry


// -----------------------------------------------------------------------

// OrderItems
app.get('/orderitems', function (req, res) {
    let query1 = "SELECT * FROM OrderItems";

    db.pool.query(query1, function(error, rows, fields){   

        res.render('orderitems', {orders: rows});   

    })                                                      
}); 

// Add OrderItems
app.post('/add-orderitem', function (req, res) {

    let data = req.body;

    query1 = `INSERT INTO OrderItems (order_id, item_id) VALUES ('${data.orderID}', '${data.itemID}')`;
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            console.log(error);
            res.sendStatus(400);

        }
        else {

            query2 = `SELECT * FROM OrderItems;`;
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

// Update OrderItems

// Delete OrderItems

// -----------------------------------------------------------------------

/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
