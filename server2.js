var express = require('express');
var http = require('http');
let Graph = require('ngraph.graph');
let pathX = require('ngraph.path');
let fee = require('./fee2.js');
const cors = require('cors');

const port=3048;

async function createGraph(start,stop) {
let out = await fee.getAllFees();
        // console.log(out);
let graph = Graph();
let graphMeta =[];

out.forEach(function(x){

x.forEach(function (o) {
        // console.log(o.network, o.chainName, o.etherValue);
        graph.addLink(o.network, o.chainName, {weight: o.etherValue});
                graphMeta.push(o);
});
});
return {graph,graphMeta};
}

var app = express();
app.use(express.json());
app.use( cors({
        origin: '*'
      }));
// var server = http.createServer(app);


app.use((req, res, next) => {
        if (req.is('application/json')) {
          next();
        } else {
          res.status(400).send('Bad Request: Content-Type must be application/json');
        }
      });



app.post('/', async function(req, res) {

console.log(req.body);
let graphStr = await createGraph(req.body.start,req.body.stop);

console.log(graphStr.feeForDirPath);
let pathFinder = pathX.aStar(graphStr.graph, {
         oriented: true,
  // We tell our pathfinder what should it use as a distance function:
  distance(fromNode, toNode, link) {
    // We don't really care about from/to nodes in this case,
    // as link.data has all needed information:
    return parseFloat(link.data.weight);
  }
});
let out = pathFinder.find(req.body.start, req.body.stop);

console.log("OUT - Optimal connection");

const result= out.reverse().map(obj=> obj.id).join('>');
console.log(":::::",result);





console.log("OUT");

let feeForDirPath = 99999;
let feeForOptPath =[];
let feeForOptPathSum = 0;
let ii=0;


let reversedOut = out.reverse();
graphStr.graphMeta.forEach(function(p){
                // console.log(req.body.start+ "===" +p.network+ "&&" +req.body.stop+ "==="+ p.chainName);
        if(req.body.start === p.network && req.body.stop === p.chainName){
        // if(req.body.start === p.network && req.body.stop === p.network){
                feeForDirPath = p.etherValue
        }
                // console.log(">>>>>>>",out[ii].id+ "===" +p.network+ "&&" +out[ii+1].id+ "==="+ p.chainName,"<<<<<<<<");



                for (let jj = 0; jj < reversedOut.length-1; jj ++) {
                                if(reversedOut[jj].id === p.network && reversedOut[jj+1].id === p.chainName) {
                                feeForOptPath.push(p.etherValue);

                                feeForOptPathSum += parseFloat(p.etherValue);
                               

                }
                }




});




console.log("Fee for direct path from " +req.body.start+ " to "+ req.body.stop + "==" + feeForDirPath);

console.log("Fee for opt path " + feeForOptPath);
console.log("Sum of Fee for opt path " + feeForOptPathSum);


res.status(200).send({ 'status': 'ok', 'optimalPath': result,'cost': feeForOptPathSum});
});

app.listen(port);
console.log(`Express server started on port: ${port}`);