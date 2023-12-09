var express = require("express");
var http = require("http");
let Graph = require("ngraph.graph");
let pathX = require("ngraph.path");
let fee = require("./fee2.js");
const cors = require("cors");

const port = 3048;

//temp data only
const feeConst = [
  {
    network: "ETH",
    chainName: "OP",
    etherValue: "0.077228297899151753",
  },
  {
    network: "ETH",
    chainName: "POL",
    etherValue: "0.07709781511076923",
  },
  {
    network: "ETH",
    chainName: "AVAX",
    etherValue: "0.110620313846153846",
  },
  {
    network: "ETH",
    chainName: "BASE",
    etherValue: "0.00155586029983675",
  },
  {
    network: "ETH",
    chainName: "BNB",
    etherValue: "0.009246523076923076",
  },
  { network: "OP", chainName: "ETH", etherValue: "0.2467432815378496" },
  {
    network: "OP",
    chainName: "POL",
    etherValue: "0.138479552707692307",
  },
  {
    network: "OP",
    chainName: "AVAX",
    etherValue: "0.110620313846153846",
  },
  {
    network: "OP",
    chainName: "BASE",
    etherValue: "0.138480673848250043",
  },
  {
    network: "POL",
    chainName: "ETH",
    etherValue: "0.2467432815378496",
  },
  {
    network: "POL",
    chainName: "OP",
    etherValue: "0.138492060559145944",
  },
  {
    network: "POL",
    chainName: "AVAX",
    etherValue: "0.110620313846153846",
  },
  {
    network: "POL",
    chainName: "BNB",
    etherValue: "0.146938830769230769",
  },
  {
    network: "AVAX",
    chainName: "ETH",
    etherValue: "0.242692002465319876",
  },
  {
    network: "AVAX",
    chainName: "OP",
    etherValue: "0.077228297899151753",
  },
  {
    network: "AVAX",
    chainName: "POL",
    etherValue: "0.077103219384615384",
  },
  {
    network: "AVAX",
    chainName: "BASE",
    etherValue: "0.138480646824337624",
  },
  {
    network: "AVAX",
    chainName: "BNB",
    etherValue: "0.146938830769230769",
  },
  {
    network: "BASE",
    chainName: "ETH",
    etherValue: "0.018503863489036898",
  },
  {
    network: "BASE",
    chainName: "OP",
    etherValue: "0.138492060559145944",
  },
  {
    network: "BASE",
    chainName: "AVAX",
    etherValue: "0.141831262153846153",
  },
  {
    network: "BASE",
    chainName: "BNB",
    etherValue: "0.146938830769230769",
  },
  {
    network: "BNB",
    chainName: "ETH",
    etherValue: "0.016889394739385895",
  },
  {
    network: "BNB",
    chainName: "POL",
    etherValue: "0.138477751283229514",
  },
  {
    network: "BNB",
    chainName: "AVAX",
    etherValue: "0.141831262153846153",
  },
  {
    network: "BNB",
    chainName: "BASE",
    etherValue: "0.138480676350746732",
  },
];

let feeDict = new Map();

async function createGraph(start, stop) {
    let allFees = await fee.getAllFees();
//   let allFees = feeConst;
  let graph = Graph();
  let graphMeta = [];
  let feeObj = allFees.flat();

  for (const o of feeObj) {
    graph.addLink(o.network, o.chainName, {
      data: o.etherValue,
      weight: o.etherValue,
    });
    graphMeta.push(o);
    feeDict.set(o.network + o.chainName, o.etherValue);
  }

  return { graph, graphMeta };
}
var app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  if (req.is("application/json")) {
    next();
  } else {
    res.status(400).send("Bad Request: Content-Type must be application/json");
  }
});

app.post("/", async function (req, res) {
  console.log(req.body);
  let graphStr = await createGraph(req.body.start, req.body.stop);

  let pathFinder = pathX.aStar(graphStr.graph, {
    oriented: true,

    distance(fromNode, toNode, link) {
      return parseFloat(link.data.weight);
    },
  });

  let out = pathFinder.find(req.body.start, req.body.stop);

  console.log("OUT - Optimal connection");

  const result = out
    .reverse()
    .map((obj) => obj.id)
    .join(">");
  console.log(":::::", result);



  let feeForDirPath = 99999;
  let feeForOptPath = [];
  let feeForOptPathSum = 0;
 

for (let i=0;i<out.length-1;i++){
        console.log(`price: ${i}`,feeDict.get(out[i].id+out[i+1].id))
        feeForOptPathSum+=parseFloat(feeDict.get(out[i].id+out[i+1].id))
}


  console.log(
    "Fee for direct path from " +
      req.body.start +
      " to " +
      req.body.stop +
      "==" +
      feeForDirPath
  );

  console.log("Fee for opt path " + feeForOptPath);
  console.log("Sum of Fee for opt path " + feeForOptPathSum);

  res
    .status(200)
    .send({ status: "ok", optimalPath: result, cost: feeForOptPathSum });
});

app.listen(port);
console.log(`Express server started on port: ${port}`);
