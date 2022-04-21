import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

let sqladmin:string|undefined;
let sqlpassword: string|undefined;

azure.keyvault.getSecret({
        resourceGroupName: "identity",
        vaultName: "cm-identity-kv",
        secretName: "sqlAdministratorLogin"
}).then(secret => {
    sqladmin = secret.properties.value;
});

azure.keyvault.getSecret({
    resourceGroupName: "identity",
    vaultName: "cm-identity-kv",
    secretName: "sqlAdministratorLoginPassword"
}).then(secret => {
    sqlpassword = secret.properties.value;
});


pulumi.log.info(sqladmin!);
pulumi.log.info(sqlpassword!);

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