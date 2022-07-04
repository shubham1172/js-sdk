/*
Copyright 2022 The Dapr Authors
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

import { LoggerService } from "../../src";

export class MockLoggerService implements LoggerService {
    public errorCounter = 0;
    public warnCounter = 0;
    public infoCounter = 0;
    public verboseCounter = 0;
    public debugCounter = 0;

    error(_message: any, ..._optionalParams: any[]): void {
        this.errorCounter++;
    }
    warn(_message: any, ..._optionalParams: any[]): void {
        this.warnCounter++;
    }
    info(_message: any, ..._optionalParams: any[]): void {
        this.infoCounter++;
    }
    verbose(_message: any, ..._optionalParams: any[]): void {
        this.verboseCounter++;
    }
    debug(_message: any, ..._optionalParams: any[]): void {
        this.debugCounter++
    }
}

