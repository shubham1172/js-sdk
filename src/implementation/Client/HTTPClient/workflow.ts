/*
Copyright 2023 The Dapr Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import HTTPClient from "./HTTPClient";
import IClientWorkflow from "../../../interfaces/Client/IClientWorkflow";
import { WorkflowGetResponseType } from "../../../types/workflow/WorkflowGetResponse.type";
import { Logger } from "../../../logger/Logger";
import { KeyValueType } from "../../../types/KeyValue.type";

export default class HTTPClientWorkflow implements IClientWorkflow {
  private readonly client: HTTPClient;
  private readonly logger: Logger;

  private static readonly DEFAULT_WORKFLOW_COMPONENT = "dapr";

  constructor(client: HTTPClient) {
    this.client = client;
    this.logger = new Logger("HTTPClient", "Workflow", client.options.logger);
  }

  async get(instanceID: string, workflowComponent?: string): Promise<WorkflowGetResponseType> {
    if (!instanceID || instanceID === "") {
      throw new Error("instanceID is required");
    }
    workflowComponent = workflowComponent ?? HTTPClientWorkflow.DEFAULT_WORKFLOW_COMPONENT;

    try {
      const result = await this.client.executeWithApiVersion(
        "v1.0-alpha1",
        `/workflows/${workflowComponent}/${instanceID}`,
        { method: "GET" },
      );

      if (typeof result === "string") {
        throw new Error(`Error getting workflow instance: ${result}`);
      }

      const resultJson = result as KeyValueType;

      const response: WorkflowGetResponseType = {
        instanceID: resultJson["instanceID"],
        workflowName: resultJson["workflowName"],
        createdAt: resultJson["createdAt"] ? new Date(resultJson["createdAt"]) : new Date(),
        lastUpdatedAt: resultJson["lastUpdatedAt"] ? new Date(resultJson["lastUpdatedAt"]) : new Date(),
        runtimeStatus: resultJson["runtimeStatus"],
        properties: resultJson["properties"],
      };

      return response;
    } catch (e: any) {
      this.logger.error(`Error getting workflow instance: ${e.message}`);
      throw e;
    }
  }

  start(
    workflowName: string,
    input?: any,
    instanceId?: string | undefined,
    workflowComponent?: string | undefined,
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async terminate(instanceId: string, workflowComponent?: string | undefined): Promise<void> {
    await this._invokeMethod(instanceId, "terminate", workflowComponent);
  }

  async pause(instanceId: string, workflowComponent?: string | undefined): Promise<void> {
    await this._invokeMethod(instanceId, "pause", workflowComponent);
  }

  async resume(instanceId: string, workflowComponent?: string | undefined): Promise<void> {
    await this._invokeMethod(instanceId, "resume", workflowComponent);
  }

  async purge(instanceId: string, workflowComponent?: string | undefined): Promise<void> {
    await this._invokeMethod(instanceId, "purge", workflowComponent);
  }

  raise(instanceId: string, eventName: string, input?: any, workflowComponent?: string | undefined): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async _invokeMethod(instanceId: string, method: string, workflowComponent?: string | undefined): Promise<any> {
    if (!instanceId || instanceId === "") {
      throw new Error("instanceID is required");
    }
    if (!method || method === "") {
      throw new Error("method is required");
    }

    workflowComponent = workflowComponent ?? HTTPClientWorkflow.DEFAULT_WORKFLOW_COMPONENT;

    try {
      await this.client.executeWithApiVersion(
        "v1.0-alpha1",
        `/workflows/${workflowComponent}/${instanceId}/${method}`,
        { method: "POST" },
      );
    } catch (e: any) {
      this.logger.error(`Error terminating workflow instance: ${e.message}`);
      throw e;
    }
  }
}
