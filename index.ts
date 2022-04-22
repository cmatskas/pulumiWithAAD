import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";
import * as identity from "@azure/identity";
import * as keyvault from "@azure/keyvault-secrets";

let sqladmin:string|undefined;
let sqlpassword: string|undefined;

const credential = new identity.ClientSecretCredential(
    process.env.ARM_TENANT_ID!,
    process.env.ARM_CLIENT_ID!,
    process.env.ARM_CLIENT_SECRET!
)

console.log(credential)

const client = new keyvault.SecretClient(
    "https://cm-identity-kv.vault.azure.net",
    credential
);

client.getSecret("sqlAdministratorLogin")
    .then(secret => sqladmin = secret.value);

client.getSecret("sqlAdministratorLoginPassword")
    .then(secret => sqlpassword = secret.value);

console.log(sqladmin);

const resourceGroup = new azure.resources.ResourceGroup("resource-group", {
    location: "West US",
    resourceGroupName: "pulumi-demo"    
});

const sqlServer = new azure.sql.Server("sql-server", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    administratorLogin: sqladmin,
    administratorLoginPassword: sqlpassword,
    version: "12.0"
});