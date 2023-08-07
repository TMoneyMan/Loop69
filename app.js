/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(express.static('public'))
PORT = 32797;

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');

/*
    ROUTES
*/

app.get('/', function(req, res)
{  
    let query1 = "SELECT * FROM Orders;";              

    db.pool.query(query1, function(error, rows, fields){   

        res.render('orders', {data: rows});   

    })                                                      
});      

app.post('/add-order', function(req, res)
{

    let data = req.body;


    let customer_id = parseInt(data.customerID);
    console.log(customer_id);
    if (isNaN(customer_id)) {

        customer_id = 'NULL'

        
    }

    let shipment_id = parseInt(data.shipmentID);
    console.log(shipment_id);
    if (isNaN(shipment_id)) {

        shipment_id = 'NULL'

    }

    query1 = "INSERT INTO Orders (customer_id, shipment_id) VALUES ('${customer_id}', '${shipment_id}')";
    db.pool.query(query1, function(error, rows, fields){

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

    // Delete an order

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
                    res.sendStatus(204)
                    location.reload('/');
                    
                }
            })
        }
})});


// Update an order
app.put('/update-order', function(req, res, next) {
    let data = req.body;

    let order_id = parseInt(data.order_id);
    let customer_id = parseInt(data.customer_id);
    let shipment_id = parseInt(data.shipment_id);

    let updateOrder = `UPDATE Orders SET customer_id = ?, shipment_id = ? WHERE order_id = ?`;

    db.pool.query(updateOrder, [order_id, customer_id, shipment_id], function(error, rows, fields){

        if (error) {

            console.log(error);
            res.sendStatus(400);

        }

        else {

            res.sendStatus(204);
            location.reload('/');

                }
            })
        }
    );


/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://flip2.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});