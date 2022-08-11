import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(
    // Método que será invocado quando a função Lambda for invocada.
    event: APIGatewayProxyEvent,
    // event é um objeto que representa o evento que disparou a função Lambda.
    // Neste caso, o evento é uma requisição REST HTTP feita para a API Gateway.
    // O objeto event contém informações sobre a requisição, como o método HTTP
    // utilizado, o corpo da requisição, os headers, etc.

    context: Context
    // context é um objeto que contém informações sobre a execução da função
    // Lambda, como o id e nome da função, o nome do log group, o nome do log
    // stream, etc. É injetado pelo próprio AWS Lambda.

): Promise<APIGatewayProxyResult>
// Promise é uma classe que representa uma operação assíncrona. O método
// handler é assíncrono porque ele acessa o banco de dados DynamoDB para
// buscar os produtos. O método handler retorna uma Promise porque a
// função Lambda deve retornar uma Promise.

// APIGatewayProxyResult é um objeto que representa a resposta HTTP que
// será enviada para o cliente que fez a requisição. O objeto contém
// informações sobre o status code da resposta, o body da resposta, os
// headers da resposta, etc.

{
    const lambdaRequestId = context.awsRequestId;
    // awsRequestId é o id único da execução da função Lambda.

    const apiRequestId = event.requestContext.requestId;
    // apiRequestId é o id único da requisição feita pelo usuário para a
    // API Gateway.

    const method = event.httpMethod;
    if (event.resource === "/products") {
        if (method === "GET") {
            console.log("GET /products");

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "GET /products",
                }),
            }
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Bad Request",
        }),
    }
}