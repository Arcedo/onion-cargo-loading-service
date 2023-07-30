var express = require('express');
//const { pagination } = require('../../../api/requestQuery');
var router = express.Router();
const containerService = require(`${__base}api/v1/containerService`);
const reqQuery = require(`${__base}api/requestQuery`);

const ints = 100;
const bigInts = 150;
const strings=250;

let query=null;
router.get('/',async function(req, res, next){
    let pag=reqQuery.pagination();
    query = await containerService.getContainers(pag,null,null);
    res.render('containers', {title: 'Cargo Loading: Containers', gridColumns:JSON.stringify([{field:"id", initialWidth:ints},{field:"clientId", initialWidth:bigInts},{field:"code", initialWidth:strings},{field:"description", initialWidth:strings},{field:"width", initialWidth:ints},{field:"length", initialWidth:ints},{field:"height", initialWidth:ints},{field:"maxWeight", initialWidth:bigInts},]),rowData:JSON.stringify(query), skip:pag.skip, limit:pag.limit});
});

router.post('/',async function(req,res,next){
    let actions=`Error: We couldn't perform the actions.`;
    if(req.body.method){
        let containerDone;
        if(req.body.method==1){
            containerDone=await containerService.postContainer(req.body);
            if(containerDone !== undefined){
                actions = `Container ${containerDone.id} added.`;
            }
        } 
        else if(req.body.method==2){
            containerDone=containerService.putContainer(req.body.id,req.body);
            if(containerDone !== undefined){
                actions = `Container ${containerDone.id} modified.`;
            }
        }
        else {
            containerDone=containerService.deleteContainer(req.body.id);
            if(containerDone !== undefined){
                actions = `Container ${containerDone.id} deleted.`;
            }
        }
    }
    let pag=reqQuery.pagination({skip: req.body.skip, limit: req.body.limit-req.body.skip});
    query = await containerService.getContainers(pag,null,null);
    res.render('containers', {title: 'Cargo Loading: Containers', gridColumns:JSON.stringify([{field:"id", initialWidth:ints},{field:"clientId", initialWidth:ints},{field:"code", initialWidth:strings},{field:"description", initialWidth:strings},{field:"width", initialWidth:ints},{field:"length", initialWidth:ints},{field:"height", initialWidth:ints},{field:"maxWeight", initialWidth:bigInts},]),rowData:JSON.stringify(query), skip:pag.skip, limit:pag.limit});
})

module.exports = router;