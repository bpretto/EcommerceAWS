import { DocumentClient } from "aws-sdk/clients/dynamodb";
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
        this.ddbClient = ddbClient;
        this.productsDdb = productsDdb;
    }

}