import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

export class ProductsAppLayersStack extends cdk.Stack {
    // Lambda Layers é uma ferramenta que permite que o código de uma função
    // Lambda seja compartilhado entre várias stacks. As funções Lambda
    // Products Admin e Products Fetch compartilham o trecho de código que
    // faz a conexão com a tabela DynamoDB, por exemplo.

    readonly productsLayer: lambda.LayerVersion;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.productsLayer = new lambda.LayerVersion(this, "ProductsLayer", {
            code: lambda.Code.fromAsset("lambda/products/layers/productsLayer"),
            // Local onde está o código da layer.

            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            // Runtimes com os quais a layer é compatível.

            layerVersionName: "ProductsLayer",
            // Nome da versão da layer, que aparece no console da AWS.

            removalPolicy: cdk.RemovalPolicy.RETAIN,
            // Ação a ser tomada quando a stack for excluída. Será mantida
            // para que possa ser utilizada em outras stacks.
        });

        new ssm.StringParameter(this, "ProductsLayerVersionArn", {
            parameterName: "ProductsLayerVersionArn",
            // Nome do parâmetro que armazena a versão da layer.
            stringValue: this.productsLayer.layerVersionArn,
            // Valor do parâmetro.
        });
        // Cria um parâmetro que armazena a versão da layer. É necessário
        // armazená-lo para que possa ser utilizado em outras stacks.
    }
}