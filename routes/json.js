var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

const AWS = require("aws-sdk");
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const s3 = new AWS.S3()


//Cyclic.sh nasic auth to access /json endpoint, only for auth users.

//get text from JSON file.
router.get('/', async function(req, res) {
let text;
    try{
        let content = await s3.getObject({
            Bucket : process.env.CYCLIC_BUCKET_NAME,
            Key : "text_file.json",
        }).promise(); 
        text = JSON.parse(content.Body)
    }
    catch(err){console.log(err), res.send("something went wrong")}
  res.status(200).send(text);
});

//post text to JSON file. Request body should be "Content"
router.post('/', jsonParser, async function(req, res) {
    let content  = req.body?.Content;
    console.log(content)
    try{
        await s3.putObject({
        Body : JSON.stringify({Content : content}, null, 2),
        Bucket : process.env.CYCLIC_BUCKET_NAME,
        Key : "text_file.json"
        }).promise() 
    }   
    catch(err){ console.log(err), res.send("Something went wrong :(").end()};
    res.status(200).json("Text saved successfully");
});


module.exports = router;