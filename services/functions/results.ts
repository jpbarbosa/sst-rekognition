import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyHandlerV2) => {
  const params = {
    TableName: String(process.env.table),
  };

  try {
    const result = await dynamoDb.scan(params).promise();

    const sortedResult = {
      ...result,
      Items: result.Items?.sort((a, b) => {
        return b.createdAt - a.createdAt;
      }),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(sortedResult),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
