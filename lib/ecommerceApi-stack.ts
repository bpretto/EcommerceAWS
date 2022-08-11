import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cwlogs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class EcommerceApiStack extends cdk.Stack {
    // Esta classe representa a stack do CDK que contém a API Gateway.
    // A API Gateway é o ponto de entrada da aplicação. Ela recebe as
    // requisições HTTP e as encaminha para as funções Lambda que
    // executam as operações solicitadas.

    // Não é necessário criar um atributo de classe para a API Gateway
    // porque ela não será lida por nenhuma outra stack.

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
    }
}