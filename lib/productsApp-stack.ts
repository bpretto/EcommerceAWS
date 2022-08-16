import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";


export class ProductsAppStack extends cdk.Stack {
    // Esta classe representa a stack do CDK que contém as funções Lambda
    // Products Admin (para criar, atualizar e excluir produtos), Products
    // Fetch (para buscar produtos) e Products-Events (para processar eventos),
    // além de uma tabela DynamoDB para armazenar os produtos. 

    readonly productsFetchHandler: lambdaNodejs.NodejsFunction;
    // atributo que representa a função Lambda Products Fetch

    readonly productsDdb: dynamodb.Table;
    // atributo que representa a tabela DynamoDB que armazena os produtos

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        // Scope é o objeto que representa onde a stack do CDK está inserida.
        // Id é o nome da stack. Props são propriedades opcionais que podem
        // ser passadas para a stack.

        super(scope, id, props);

        this.productsDdb = new dynamodb.Table(
            this, // scope
            "Products", // id
            {
                tableName: "Products", // nome da tabela
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                // ação a ser tomada quando a stack for excluída
                partitionKey: {
                    name: "id", // nome do atributo da chave primária
                    type: dynamodb.AttributeType.STRING // tipo do atributo
                },
                billingMode: dynamodb.BillingMode.PROVISIONED,
                // o tipo de cálculo de custo da tabela
                readCapacity: 1, // capacidade de leitura por segundo
                writeCapacity: 1 // capacidade de escrita por segundo
            } // configurações da tabela
        );
        // Cria uma tabela DynamoDB para armazenar os produtos
        // É criada antes da função Lambda Products Fetch, pois a função
        // Products Fetch depende da tabela para buscar os produtos     

        this.productsFetchHandler = new lambdaNodejs.NodejsFunction(
            this,
            // scope (esta função Lambda pertence à esta stack)
            "ProductsFetchFunction",
            // id (não é o nome da função Lambda, mas sim a identificação
            // deste recurso dentro da stack)
            {
                functionName: "ProductsFetchFunction",
                // nome da função Lambda (igual ao id para facilitar a
                // identificação no console da AWS e no código do projeto,
                // mas são coisas diferentes).

                entry: "lambda/products/productsFetchFunction.ts",
                // Ponto de entrada da função Lambda. Quando uma função Lambda é
                // invocada, um método específico é invocado. Esse método estará
                // definido no arquivo que está sendo referenciado aqui.

                handler: "handler",
                // Nome do método do arquivo productsFetchFunction.ts que será
                // invocado quando a função Lambda for invocada.

                memorySize: 128,
                // Quantidade de memória alocada para a função Lambda ser
                // executada.

                timeout: cdk.Duration.seconds(5),
                // Tempo máximo que a função Lambda pode ser executada.

                bundling: {
                    // Configurações de empacotamento da função Lambda. O empacotamento
                    // é o processo de transformar o código fonte da função Lambda em
                    // um arquivo zip que será enviado para a AWS para ser executado na
                    // nuvem. O empacotamento é feito pelo CDK automaticamente, mas é
                    // possível configurar algumas coisas, como o diretório de saída do
                    // arquivo zip, o diretório de entrada do código fonte, etc.

                    minify: true,
                    // Minifica o código da função Lambda (torna enxuto) para
                    // reduzir o tamanho do pacote que será enviado para a AWS.

                    sourceMap: false,
                    // Não gera um arquivo de mapa de origem (source map) para
                    // facilitar a depuração do código da função Lambda, pois
                    // o arquivo de mapa de origem é muito grande.
                },
            }
        );
    }
}