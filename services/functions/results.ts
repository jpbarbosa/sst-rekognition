import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyHandlerV2) => {
  const params = {
    TableName: String(process.env.table),
  };

  const result = await dynamoDb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
