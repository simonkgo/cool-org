/**
 *  this script should login to azure account;
 *  get credential to the computer that managed the deployment;
 *  run cool-user service;
 */
const shell = require('shelljs');

const coolUserMeta = {
    cloud:"Azure",
    cluster:"cmp-aks",
    group:"cmp-rg",
    messages: {
        oklogin: `Info: Logged to - ${this.cluster}`,
        okcredentials: `Info: Got Credentials to ${this.cluster}`,
        opsilogin: `Opsi: Something happened during login attempt to - ${this.cluster}`,
        opsicredentials: `Opsi: Something happened during get-credentials attempt to - ${this.cluster}`,
        bye:"Opsi: Something happened - shutting down the process"
    },
    files:{
        deployment:"../user-deployment.yaml",
        service:"../user-service.yaml"
    },
};
const cmdCredentials = (clusterName,groupName) => `az aks get-credentials --admin --name ${clusterName} --resource-group ${groupName}`;
const cmdLogin = () => 'az login';

const runLogin = () => {
    return new Promise((resolve,reject) =>{
        let cmd = cmdLogin();

        if (shell.exec(cmd).code !== 0) {
            shell.echo(coolUserMeta.messages.oklogin);
            resolve(0)
        }else{
            shell.echo(coolUserMeta.messages.opsilogin);
            reject(1)
        }
    });
};
const runCredentials = () => {
    return new Promise((resolve,reject) =>{
        let cmd = cmdCredentials(coolUserMeta.cluster, coolUserMeta.group);

        if (shell.exec(cmd).code !== 0) { // todo: confirm the credential override;
            shell.echo(coolUserMeta.messages.okcredentials);
            resolve(0)
        }else{
            shell.echo(coolUserMeta.messages.opsicredentials);
            reject(1)
        }
    });
};
const handleError = (err) => {
    switch (err) {
        case 1:
            console.log("err",err);
            return;
        case 2:
            return;
    };
};
const init = async () => {
    try {
        await runLogin();
        await runCredentials();
    }catch (err){
        handleError(err);
    }finally {
        shell.echo(coolUserMeta.messages.bye);
    };
};
