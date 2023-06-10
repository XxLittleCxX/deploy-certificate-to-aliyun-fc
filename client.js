"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const openapi_client_1 = require("@alicloud/openapi-client"), $OpenApi = openapi_client_1;
const openapi_util_1 = require("@alicloud/openapi-util");
const $Util = require("@alicloud/tea-util");
const fs = require("fs");
const core = require("@actions/core");
const input = {
    accessKeyId: core.getInput("access-key-id"),
    accessKeySecret: core.getInput("access-key-secret"),
    fullchainFile: core.getInput("fullchain-file"),
    keyFile: core.getInput("key-file"),
    fcDomains: core.getInput("fc-domains"),
    accountId: core.getInput("account-id")
};
class Client {
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(accessKeyId, accessKeySecret, accountId, ap) {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // 访问的域名
        config.endpoint = `${accountId}.${ap}.fc.aliyuncs.com`;
        return new openapi_client_1.default(config);
    }
    /**
     * API 相关
     * @param path params
     * @return OpenApi.Params
     */
    static createApiInfo(domainName) {
        let params = new $OpenApi.Params({
            // 接口名称
            action: "UpdateCustomDomain",
            // 接口版本
            version: "2021-04-06",
            // 接口协议
            protocol: "HTTPS",
            // 接口 HTTP 方法
            method: "PUT",
            authType: "AK",
            style: "FC",
            // 接口 PATH
            pathname: `/2021-04-06/custom-domains/${domainName}`,
            // 接口请求体内容格式
            reqBodyType: "json",
            // 接口响应体内容格式
            bodyType: "json",
        });
        return params;
    }
}
async function deployCertificateToFc() {
    const fullchain = fs.readFileSync(input.fullchainFile, "utf-8");
    const key = fs.readFileSync(input.keyFile, "utf-8");
    const domains = Array.from(new Set(input.fcDomains.split(",").filter(x => x)));
    for (const item of domains) {
        const [ap, domain] = item.split(':');
        let client = Client.createClient(input.accessKeyId, input.accessKeySecret, input.accountId, ap);
        let params = Client.createApiInfo(domain);
        console.log(`Deploying certificate to FC domain ${domain}.`);
        let body = openapi_util_1.default.arrayToStringWithSpecifiedStyle({
            certConfig: {
                certName: domain.split('.').join(''),
                certificate: fullchain,
                privateKey: key,
            },
        }, "body", "json");
        // runtime options
        let runtime = new $Util.RuntimeOptions({});
        let request = new $OpenApi.OpenApiRequest({
            body: body,
        });
        // 复制代码运行请自行打印 API 的返回值
        // 返回值为 Map 类型，可从 Map 中获得三类数据：响应体 body、响应头 headers、HTTP 返回的状态码 statusCode。
        let resp = await client.callApi(params, request, runtime);
    }
}
async function main() {
    await deployCertificateToFc();
}
main().catch(error => {
    console.log(error.stack);
    core.setFailed(error);
    process.exit(1);
});
