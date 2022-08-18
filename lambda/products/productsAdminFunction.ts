import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Product, ProductRepository } from "/opt/nodejs/productsLayer";

const productsDdb = process.env.PRODUCTS_DDB!;
// Nome da tabela DynamoDB que armazena os produtos.
const productsDdbClient = new DynamoDB.DocumentClient();
// Instanciação do cliente do DynamoDB.
const productsRepository = new ProductRepository(productsDdbClient, productsDdb);
// Instanciação do repositório de produtos.

export async function handler(
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    const lambdaRequestId = context.awsRequestId;
    const apiRequestId = event.requestContext.requestId;

    console.log(`lambdaRequestId: ${lambdaRequestId} \n apiRequestId: ${apiRequestId}`);

    if (event.resource === "/products") {
        console.log("POST /products");
        const product = JSON.parse(event.body!) as Product;
        const createdProduct = await productsRepository.createProduct(product);
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: JSON.stringify(createdProduct),
            }),
        }
    } else if (event.resource === "/products/{id}") {
        const productId = event.pathParameters!.id as string
        if (event.httpMethod === "PUT") {
            console.log(`PUT /products/${productId}`);
            const product = JSON.parse(event.body!) as Product;
            try {
                const updatedProduct = await productsRepository.updateProduct(productId, product);
                return {
                    statusCode: 200,
                    body: JSON.stringify(updatedProduct),
                }
            } catch (ConditionalCheckFailedException) {
                // ConditionalCheckFailedException é uma exceção do DynamoDB que é
                // lançada quando o item não existe no banco de dados.
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: `Product with id ${productId} not found`,
                    }),
                }
            }
        } else if (event.httpMethod === "DELETE") {
            console.log(`DELETE /products/${productId}`);
            try {
                const product = await productsRepository.deleteProduct(productId);
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
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Bad Request",
        })
    }
}