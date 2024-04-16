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
Object.defineProperty(exports, "__esModule", { value: true });
exports.realMouseWheel = void 0;
const fireCdpCommand_1 = require("../fireCdpCommand");
const getCypressElementCoordinates_1 = require("../getCypressElementCoordinates");
/** @ignore this, update documentation for this function at index.d.ts */
function realMouseWheel(subject, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { x, y } = (0, getCypressElementCoordinates_1.getCypressElementCoordinates)(subject, options.position, options.scrollBehavior);
        const { deltaX = 0, deltaY = 0 } = options || {};
        if (deltaX === 0 && deltaY === 0) {
            throw new Error("At least one is required. deltaX or deltaY.");
        }
        const log = Cypress.log({
            $el: subject,
            name: "realMouseWheel",
            consoleProps: () => ({
                "Applied To": subject.get(0),
                "Absolute Coordinates": { x, y },
            }),
        });
        log.snapshot("before");
        yield (0, fireCdpCommand_1.fireCdpCommand)("Input.dispatchMouseEvent", {
            type: "mouseWheel",
            x,
            y,
            deltaX,
            deltaY,
            modifier: 0,
            pointerType: "mouse",
        });
        log.snapshot().end();
        return subject;
    });
}
exports.realMouseWheel = realMouseWheel;
