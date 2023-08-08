
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

    db.pool.query(query1, function(error, rows, fields){   

        res.render('orders', {orders: rows});   

    })                                                      
});     

// Add Order
app.post('/add-order-ajax', function(req, res)
{
    let data = req.body

    let customer_id = parseInt(data.customerID);
    console.log(customer_id);
    if (customer_id === '') {

        customer_id = NULL

    }

    let shipment_id = data.shipmentID;
    if (shipment_id === '') {

        shipment_id = NULL

    }

    query1 = `INSERT INTO Orders (customer_id, shipment_id) VALUES (?, ?)`;
    db.pool.query(query1, [data.customer_id, data.shipment_id],
        function (error, fields) {

        if (error) {

            console.log(error)
            res.sendStatus(400);

        }
        else {

            query2 = `SELECT * FROM Orders;`;
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

// Delete Order
app.delete('/delete-order-ajax', function(req, res, next) {
    
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
                    res.sendStatus(204)
                    location.reload('/');
                    
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

// Add Customer

// Update Customer

// Delete Customer

//-----------------------------------------------------------------------

// Shipments
app.get('/shipments', function (req, res) {
    let query1 = "SELECT * FROM Shipments";

    db.pool.query(query1, function(error, rows, fields){   

        res.render('shipments', {shipments: rows});   

    })                                                      
});  

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

// Add Department

// Update Department

// Delete Department

//-----------------------------------------------------------------------

// Items
app.get('/items', function (req, res) {
    let query1 = "SELECT * FROM Items";

    db.pool.query(query1, function(error, rows, fields){   

        res.render('items', {items: rows});   

    })                                                      
});  


// Add Item

// Update Item

// Delete Item





/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});