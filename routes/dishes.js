var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);
let dishes = db.collection('dishes');

//get list of dishes
router.get('/', async function(req, res) {
    let list 
    try{
        list = await dishes.list();
    }
    catch(err){console.log(err)};
    res.status(200).send(list);
});

//post a new dish to DB, if exisitng, overwrite.
router.post('/', jsonParser, async function(req, res) {
    let { name, country } = req.body;
    try{
        await dishes.set(name, {
            country : country
        })
    }
    catch(err){console.log(err)};
    res.end("Set/updated Dish.")
//name and country. assume correct format.
});

//get specific dish of key
router.get('/:dishKey', jsonParser, async function(req,res) {
    let dishKey = req.params.dishKey;
    let result;
    try{
       result = await dishes.get(dishKey);
    }
    catch(err){console.log(err)};
    res.status(200).send(result);
});

module.exports = router;