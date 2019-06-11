
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const ATHENA = new AWS.Athena({accessKeyId : event.account.accessKey,secretAccessKey : event.account.secretKey });
  
  let params = {
    QueryString: event.query,
    QueryExecutionContext: {
      Database: event.database
    }
  };
  let data = await ATHENA.startQueryExecution(params).promise();
  let execId = data.QueryExecutionId;
  
  let resultParams = {
    QueryExecutionId: execId,
  };
  let queryResult = await ATHENA.getQueryResults(resultParams).promise();
  console.log(JSON.stringify(queryResult));
  let result = queryResult.ResultSet;
  return result;
};