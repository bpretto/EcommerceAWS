import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { ProductRepository } from "/opt/nodejs/productsLayer";

const productsDdb = process.env.PRODUCTS_DDB!;
// Nome da tabela DynamoDB que armazena os produtos.
const productsDdbClient = new DynamoDB.DocumentClient();
// Instanciação do cliente do DynamoDB.
const productsRepository = new ProductRepository(productsDdbClient, productsDdb);
// Instanciação do repositório de produtos.

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

    console.log(`lambdaRequestId: ${lambdaRequestId} \n apiRequestId: ${apiRequestId}`);
    // Imprime no CloudWatch os ids da execução da função Lambda e da
    // requisição feita pelo usuário. Gerar logs, em ambiente de produção,
    // gera custos. Além disso, não se deve colocar informações sensíveis
    // nos logs, nomes de usuários, ips, etc.

    const method = event.httpMethod;
    if (event.resource === "/products") {
        if (method === "GET") {
            console.log("GET /products");

            const products = await productsRepository.getAllProducts();
            // Busca todos os produtos no banco de dados.

            return {
                statusCode: 200,
                body: JSON.stringify(products),
            }
        }
    } else if (event.resource === "/products/{id}") {
        const productId = event.pathParameters!.id as string
        console.log(`GET /products/${productId}`);

        try {
            const product = await productsRepository.getProductById(productId);
            return {
                statusCode: 200,
                body: JSON.stringify(product),
            }
        } catch (error) {
            console.error((<Error>error).message)
            return {
                statusCode: 404,
                body: (<Error>error).message,
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