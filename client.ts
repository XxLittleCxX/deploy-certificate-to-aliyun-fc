// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import OpenApiUtil from '@alicloud/openapi-util';
import Util, * as $Util from '@alicloud/tea-util';

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
  static createClient(accessKeyId: string, accessKeySecret: string, accountId: string, ap: string): OpenApi {
    let config = new $OpenApi.Config({
      // 必填，您的 AccessKey ID
      accessKeyId: accessKeyId,
      // 必填，您的 AccessKey Secret
      accessKeySecret: accessKeySecret,
    });
    // 访问的域名
    config.endpoint = `${accountId}.${ap}.fc.aliyuncs.com`;
    return new OpenApi(config);
  }

  /**
   * API 相关
   * @param path params
   * @return OpenApi.Params
   */
  static createApiInfo(domainName: string): $OpenApi.Params {
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
    const [ap, domain] = (item as string).split(':')
    let client = Client.createClient(input.accessKeyId, input.accessKeySecret, input.accountId, ap);
    let params = Client.createApiInfo(domain);
    console.log(`Deploying certificate to FC domain ${domain}.`);
    let body: string = OpenApiUtil.arrayToStringWithSpecifiedStyle({
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
