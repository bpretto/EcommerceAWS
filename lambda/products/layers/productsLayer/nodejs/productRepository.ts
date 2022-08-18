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

    async getProductById(productId: string): Promise<Product> {
        const data = await this.ddbClient.get({
            // Não se deve utilizar o método scan para buscar um produto,
            // pois, caso feito isso, o DynamoDB irá varrer toda a tabela
            // e retornar todos os produtos que condizem com o filtro. Ao
            // utilizar o método get, o DynamoDB só retornará o produto que
            // corresponde ao id informado, sem nem se atentar ao resto da
            // tabela. Isso é menos custoso em termos monetários e temporais.
            TableName: this.productsDdb,
            Key: {
                id: productId, // Chave primária do elemento.
            },
        }).promise();
        if (data.Item) { // Se o produto existe, retorna o produto.
            return data.Item as Product;
        } else { // Se o produto não existe, retorna um erro.
            throw new Error("Product not found");
        }
    }

    async create(product: Product): Promise<Product> {
        product.id = uuid(); // Gerar um id único para o produto.
        await this.ddbClient.put({
            TableName: this.productsDdb,
            Item: product,
        }).promise();
        return product;
    }

}