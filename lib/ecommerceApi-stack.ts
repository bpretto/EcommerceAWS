import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cwlogs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface EcommerceApiStackProps extends cdk.StackProps {
    // Interface que representa as propriedades a serem passadas para
    // a stack do CDK. Essa interface é opcional, mas é uma boa prática
    // criar uma interface para as propriedades da stack, pois facilita
    // a manutenção do código e a reutilização de código.

    productsFetchHandler: lambdaNodejs.NodejsFunction;
    // Atributo que representa a função Lambda Products Fetch.
};

export class EcommerceApiStack extends cdk.Stack {
    // Esta classe representa a stack do CDK que contém a API Gateway.
    // A API Gateway é o ponto de entrada da aplicação. Ela recebe as
    // requisições HTTP e as encaminha para as funções Lambda que
    // executam as operações solicitadas.

    // Não é necessário criar um atributo de classe para a API Gateway
    // porque ela não será lida por nenhuma outra stack.

    constructor(scope: Construct, id: string, props: EcommerceApiStackProps) {
        super(scope, id, props);

        const api = new apigateway.RestApi(
            this, // scope
            "EcommerceApi", // id
            {
                restApiName: "Ecommerce API",
                // Nome da API Gateway. Esse nome será exibido no console
                // do API Gateway.
            }
        );

        const productsFetchIntegration = new apigateway.LambdaIntegration(
            props.productsFetchHandler,
            // Função Lambda que será invocada quando a API Gateway receber
            // uma requisição HTTP para o endpoint /products.
        );
        // Cria um objeto que representa a integração da API Gateway com
        // a função Lambda Products Fetch. A integração é responsável por
        // invocar a função Lambda quando a API Gateway receber uma
        // requisição HTTP para o endpoint /products e também por converter
        // a resposta da função Lambda em uma resposta HTTP.

        const productsResource = api.root.addResource("products");
        // "/products"

        productsResource.addMethod("GET", productsFetchIntegration);
        // "/products" GET
        // GET em /products -> productsFetchIntegration -> productsFetchHandler

    }
}