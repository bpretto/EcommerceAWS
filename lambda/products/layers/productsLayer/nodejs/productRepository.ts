import { DocumentClient } from "aws-sdk/clients/dynamodb";
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

import { v4 as uuid } from "uuid";

export interface Product {
    id: string;
    productName: string; // name é uma palavra reservada do DynamoDB.
    code: string;
    price: number;
    model: string;
};

export class ProductRepository {

    private ddbClient: DocumentClient;
    // É necessário criar um cliente para acessar o DynamoDB.
    // Contudo, ele será criado pela função Lambda que invocar
    // esta classe, para que seja criado um cliente para cada
    // invocação.

    private productsDdb: string;

    constructor(ddbClient: DocumentClient, productsDdb: string) {
        this.ddbClient = ddbClient; // Cliente que acessa o DynamoDB.
        this.productsDdb = productsDdb; // Nome da tabela do DynamoDB.
    }

    async getAllProducts(): Promise<Product[]> {
        const data = await this.ddbClient.scan({
            TableName: this.productsDdb,
        }).promise();
        return data.Items as Product[];
    };
    // Operação com fins didáticos, o ideal não é buscar todos
    // os produtos, sem nenhum tipo de filtro.

}