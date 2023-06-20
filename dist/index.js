import './sourcemap-register.cjs';/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

var __createBinding = (undefined && undefined.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (undefined && undefined.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (undefined && undefined.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const appsyncQuery_1 = require("./appsyncQuery");
const fs = require('fs').promises;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        //const awsExports = await fs.readFile('./aws.json', 'utf8')
        try {
            const envName = process.env.AMPLIFY_ENV_NAME || '';
            const awsExportsFilepath = core.getInput('awsExportsFilepath');
            const { default: awsExports } = yield Promise.resolve(`${awsExportsFilepath}`).then(s => __importStar(require(s)));
            const awsExportsFile = JSON.stringify(awsExports);
            console.log('sfadsdfa', envName, awsExportsFile);
            const tenantData = yield (0, appsyncQuery_1.getTenantByEnvQuery)({ awsEnvName: envName });
            if (tenantData) {
                yield (0, appsyncQuery_1.updateTenantQuery)({
                    id: tenantData.id,
                    config: awsExportsFile,
                    version: tenantData.version + 1
                });
            }
            else {
                yield (0, appsyncQuery_1.createTenantQuery)({
                    awsEnvName: envName,
                    config: awsExportsFile,
                    name: envName,
                    version: 1
                });
            }
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();


//# sourceMappingURL=index.js.map