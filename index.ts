import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";

interface Data{
    azurerm_key_vault: {
        id:string
    }
};

let config = new pulumi.Config();
let data = config.requireObject<Data>("data");

const sql_username_secret = azure.keyvault.getSecret({
    name: "sqlAdministratorLogin",
    keyVaultId: data.azurerm_key_vault.id
});

const sql_password_secret = azure.keyvault.getSecret({
    name: "sqlAdministratorLoginPassword",
    keyVaultId: data.azurerm_key_vault.id
});

export const sql_username = sql_username_secret.then(secret => secret.value);
export const sql_password = sql_password_secret.then(secret => secret.value);

const resourceGroup = new azure.core.ResourceGroup("pulumi-demo", {location: "West US"});

const exampleSqlServer = new azure.sql.SqlServer("cm-pl-sql-server", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    version: "12.0",
    administratorLogin: sql_username,
    administratorLoginPassword: sql_password,
    tags: {
        environment: "demo",
    },
});