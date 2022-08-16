#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerceApi-stack';


const app = new cdk.App();
// Cria uma instância da classe App, que representa a aplicação CDK.
// A aplicação CDK é o ponto de entrada da aplicação. Ela é responsável
// por criar as stacks do CDK e realizar o deploy da aplicação.

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
// Cria um objeto que representa o ambiente de deploy da aplicação.

const tags = {
  cost: "ECommerce",
  developer: "BernardoPretto",
};
// Tags são úteis para identificar os recursos criados pela aplicação
// e para aplicar políticas de custo e segurança.

const productsAppStack = new ProductsAppStack(
  app, // scope
  "ProductsApp", // id
  {
    tags: tags,
    env: env,
  }
  // props
)

const ecommerceApiStack = new EcommerceApiStack(
  app, // scope
  "EcommerceApi", // id
  {
    productsFetchHandler: productsAppStack.productsFetchHandler,
    // Atributo que representa a função Lambda Products Fetch.
    productsAdminHandler: productsAppStack.productsAdminHandler,
    // Atributo que representa a função Lambda Products Admin.
    tags: tags,
    env: env,
  }
  // props
);

ecommerceApiStack.addDependency(productsAppStack);
// Define a dependência entre as stacks. A stack EcommerceApiStack
// depende da stack ProductsAppStack. Isso significa que a stack
// EcommerceApiStack só será criada após a stack ProductsAppStack ser
// criada. Isso é necessário porque a stack EcommerceApiStack precisa
// do atributo productsFetchHandler da stack ProductsAppStack. Se a
// stack EcommerceApiStack for criada antes da stack ProductsAppStack,
// o atributo productsFetchHandler não estará disponível.