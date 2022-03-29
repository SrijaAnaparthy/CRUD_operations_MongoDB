var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.set("view engine",'pug');
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;
var MongoClient = mongodb.MongoClient;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.get('/unicornshome',function(req,res)
{
    var connection = new MongoClient("mongodb://127.0.0.1:27017");

connection.connect(function(err,con)
{
    if(err)
    {
        console.log("connection err::",err);
    }
        var db = con.db('unicorns');
        db.collection('unicorns').find().toArray(function(err,data)
        {
            if(err){console.log("err::",err)}
            console.log("Data::",data)
            res.render("table",{unicorns:data});
            //res.json(data);
            con.close();
           
        })
})
})

app.post('/adding_data', function (req, res) {
    var insert_data = {
        name: req.body.name,
        dob: req.body.dob,
        loves: req.body.loves,
        weight: req.body.weight,
        gender: req.body.gender,
        vampires: req.body.vampires,
    };
    MongoClient.connect('mongodb://127.0.0.1:27017', function (err, db) {
        if (err) throw err;
        var dbo = db.db('unicorns');
        dbo.collection('unicorns').insertOne(insert_data, function (err, obj) {
            if (err) throw err;
            console.log('1 document inserted');
            db.close();
            res.redirect('/unicornshome');
        });
    });
});


app.get('/delete', function (req, res) {
    var id = req.query.id;
    MongoClient.connect('mongodb://127.0.0.1:27017', function (err, db) {
        if (err) throw err;
        var dbo = db.db('unicorns');
        dbo.collection('unicorns').deleteOne(
            { _id: new mongodb.ObjectId(id) },
            function (err, obj) {
                if (err) throw err;
                console.log('1 document deleted');
                db.close();
                res.redirect('/unicornshome');
            }
        );
    });
});


app.get('/fetchdata', function (req, res) {
    var id = req.query.id;
    MongoClient.connect('mongodb://127.0.0.1:27017', function (err, db) {
        if (err) throw err;
        var dbo = db.db('unicorns');
        dbo.collection('unicorns').find(
            { _id: new mongodb.ObjectId(id) }).toArray(function (err, obj) {
                if (err) throw err;
                res.send(obj)
                db.close();
                res.redirect('/unicornshome');
            });
    });
});


app.get("/edit/:id",function(req,res)
{
    var connection=new MongoClient("mongodb://127.0.0.1:27017");

    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("connection err::",err)
        }
        else
        {
            var db=con.db('unicorns');
            db.collection('unicorns').find({"_id":new mongodb.ObjectID(req.params.id)}).toArray(function(err,data)
            {
                if(err)
                {
                    console.log("data error in fectching")
                }
                res.render("edit",{unicorns:data});
                con.close();

            })
        }
    })
      
})
app.post("/update",function(req,res)
{
    
    console.log(req.body);
    var connection=new MongoClient("mongodb://127.0.0.1:27017");
    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("connection err::",err)
        }
        else
        {
            var db=con.db('unicorns');
            var t=req.body.loves.split(',')
            db.collection('unicorns').updateOne({"name":(req.body.name)},{$set:{"dob":req.body.dob,"loves":t,"weight":req.body.weight,"gender":req.body.gender,"vampires":req.body.vampires}},function(err,data)
            {
                 if(err)
                {
                    console.log("data error in delittion")
                }
                console.log("update route called");
                res.redirect("/unicornshome");
                con.close();  
            })
        }
    })
      
})


const port = 3000 // Port we will listen on
  
// Function to listen on the port
app.listen(port, () => console.log(`Server running on port ${port}`));


