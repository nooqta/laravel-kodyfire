"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const basic_kodyfire_1 = require("basic-kodyfire");
class Generator extends basic_kodyfire_1.Generator {
    constructor(params, technology) {
        super(params, technology);
    }
    generate(content) {
        var e_1, _a;
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this.input = content;
            this.technology.input = content;
            this.technology.rootDir = content.rootDir || this.technology.rootDir;
            try {
                // for every concept in concepts list
                for (var _d = __asyncValues(this.technology.concepts), _e; _e = yield _d.next(), !_e.done;) {
                    const [key] = _e.value;
                    // eslint-disable-next-line no-prototype-builtins
                    if (content.hasOwnProperty(key)) {
                        for (const data of content[key]) {
                            // do apropriate action
                            this.output = yield ((_b = this.technology.concepts.get(key)) === null || _b === void 0 ? void 0 : _b.generate(data));
                        }
                    }
                    else {
                        // We fallback to the default concept if it exists
                        if (this.technology.concepts.get("concept")) {
                            for (const data of content[key]) {
                                this.output = yield ((_c = this.technology.concepts
                                    .get("concept")) === null || _c === void 0 ? void 0 : _c.generate(data));
                            }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) yield _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // return result
            return this.output;
        });
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map