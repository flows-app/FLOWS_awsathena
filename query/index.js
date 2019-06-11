
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const ATHENA = new AWS.Athena({accessKeyId : event.account.accessKey,secretAccessKey : event.account.secretKey });
  
  let params = {
    QueryString: event.query,
    QueryExecutionContext: {
      Database: event.database
    },
    ResultConfiguration: {
      EncryptionConfiguration: {
        EncryptionOption: "SSE_S3"
      },
      OutputLocation: event.outputlocation
    }
  };
  let data = await ATHENA.startQueryExecution(params).promise();
  let execId = data.QueryExecutionId;
  let running = true;
  while(running){
    let params = {
      QueryExecutionId: execId
    };
    let status = await ATHENA.getQueryExecution(params).promise();
    if(status.QueryExecution.Status.State=="SUCCEEDED" ||
      status.QueryExecution.Status.State=="FAILED" ||
      status.QueryExecution.Status.State=="CANCELLED"){
      running=false;
    }
  }
  let resultParams = {
    QueryExecutionId: execId,
  };
  let queryResult = await ATHENA.getQueryResults(resultParams).promise();
  console.log(JSON.stringify(queryResult));
  let result = queryResult.ResultSet;
  return result;
};