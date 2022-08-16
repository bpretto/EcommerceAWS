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

    productsAdminHandler: lambdaNodejs.NodejsFunction;
    // Atributo que representa a função Lambda Products Admin.
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

        const logGroup = new cwlogs.LogGroup(this, "EcommerceApiLogs");
        // Cria um grupo de logs para a API Gateway. Será como uma pasta
        // que armazenará os logs de todas as requisições recebidas pela
        // API Gateway. Logs são particularmente úteis para depuração de
        // erros.

        const api = new apigateway.RestApi(
            this, // scope
            "EcommerceApi", // id
            {
                restApiName: "Ecommerce API",
                // Nome da API Gateway. Esse nome será exibido no console
                // do API Gateway.

                deployOptions: {
                    accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
                    // Define onde serão armazenados os logs das requisições.

                    accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                        // Define o formato dos logs das requisições recebidas.
                        httpMethod: true,
                        ip: true,
                        protocol: true,
                        requestTime: true,
                        resourcePath: true,
                        responseLength: true,
                        status: true,
                        caller: true,
                        user: true,
                        // Importante ressaltar que as informações sensíveis
                        // como ips e usuários não devem ser armazenadas em
                        // logs de ambiente de produção.
                    }),
                },
            }
        );

        const productsFetchIntegration = new apigateway.LambdaIntegration(
            props.productsFetchHandler,
            // Função Lambda que será invocada quando a API Gateway receber
            // uma requisição HTTP GET para os endpoints /products e
            // /products/{id}.
        );
        // Cria um objeto que representa a integração da API Gateway com
        // a função Lambda Products Fetch. A integração é responsável por
        // invocar a função Lambda quando a API Gateway receber uma
        // requisição HTTP para o endpoint /products e também por converter
        // a resposta da função Lambda em uma resposta HTTP.

        const productsAdminIntegration = new apigateway.LambdaIntegration(
            props.productsAdminHandler,
            // Função Lambda que será invocada quando a API Gateway receber
            // uma requisição HTTP POST, PUT ou DELETE para o endpoint /products.
        );


        const productsResource = api.root.addResource("products");
        // "/products"
        const productIdResourse = productsResource.addResource("{id}")
        // "/products/{id}"

        productsResource.addMethod("GET", productsFetchIntegration);
        // "/products" GET
        productIdResourse.addMethod("GET", productsFetchIntegration);
        // "/products/{id}" GET
        // GET em /products ou /products/{id} -> productsFetchIntegration
        // -> productsFetchHandler

        productsResource.addMethod("POST", productsAdminIntegration);
        // "/products" POST
        productIdResourse.addMethod("PUT", productsAdminIntegration);
        // "/products/{id}" PUT
        productIdResourse.addMethod("DELETE", productsAdminIntegration);
        // "/products/{id}" DELETE
        // POST, PUT ou DELETE em /products ou /products/{id} ->
        // productsAdminIntegration -> productsAdminHandler









    }
}