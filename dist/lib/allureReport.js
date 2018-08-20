"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const allure = require('allure-commandline');
const wrench = require('wrench');
const getInstalledPath = require('get-installed-path');
function rmdir(dir) {
    const list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
        const filename = path.join(dir, list[i]);
        const stat = fs.statSync(filename);
        if (filename == "." || filename == "..") {
            // pass these files
        }
        else if (stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        }
        else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
}
function ensureRunPath(run) {
    let latestRun;
    if (fs.existsSync(process.env.WDIO_WORKFLO_LATEST_RUN_PATH)) {
        latestRun = fs.readFileSync(process.env.WDIO_WORKFLO_LATEST_RUN_PATH, 'utf8');
    }
    run = run || latestRun;
    const runPath = path.join(process.env.WDIO_WORKFLO_RESULTS_PATH, run);
    if (!fs.existsSync(runPath)) {
        throw new Error(`Could not find folder ${runPath} for generating or opening allure report`);
    }
    return runPath;
}
function ensureExecutable() {
    const allureCliPath = require.resolve('allure-commandline');
    const allureBinPath = path.resolve(allureCliPath, '../', 'dist/bin');
    try {
        fs.chmodSync(path.join(allureBinPath, 'allure'), 0o755);
    }
    finally { }
    try {
        fs.chmodSync(path.join(allureBinPath, 'allure.bat'), 0o755);
    }
    finally { }
}
function generateReport(workfloConf, run) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const runPath = ensureRunPath(run);
        const allureCliPath = require.resolve('allure-commandline');
        // replace original allure-commandline bin files with patched ones,
        // which support issue tracker pattern and bug tracker pattern
        const allureBinPath = path.resolve(allureCliPath, '../', 'dist/bin');
        const allureBinBakPath = `${allureBinPath}_bak`;
        const allurePatchBinPath = path.resolve(__dirname, '../../templates/node_modules/allure-commandline/dist/bin');
        ensureExecutable();
        wrench.copyDirSyncRecursive(allurePatchBinPath, allureBinPath);
        try {
            fs.chmodSync(path.join(allureBinPath, 'allure'), 0o755);
        }
        finally { }
        try {
            fs.chmodSync(path.join(allureBinPath, 'allure.bat'), 0o755);
        }
        finally { }
        process.env.ALLURE_BUG_TRACKER_PATTERN = workfloConf.allure.bugTrackerPattern;
        process.env.ALLURE_ISSUE_TRACKER_PATTERN = workfloConf.allure.issueTrackerPattern;
        // returns ChildProcess instance
        const generation = allure([
            'generate',
            path.join(runPath, 'allure-results'),
            '-o',
            path.join(runPath, 'allure-report'),
            '--clean'
        ]);
        generation.on('exit', function (exitCode) {
            if (fs.existsSync(allureBinBakPath)) {
                rmdir(allureBinPath);
                fs.renameSync(allureBinBakPath, allureBinPath);
            }
            console.log('Report generation finished with code:', exitCode);
            resolve(exitCode);
        });
    }));
}
exports.generateReport = generateReport;
function openReport(workfloConf, run) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const runPath = ensureRunPath(run);
        ensureExecutable();
        // returns ChildProcess instance
        const open = allure([
            'open',
            path.join(runPath, 'allure-report')
        ]);
        open.on('exit', function (exitCode) {
            console.log('Showing report for run:', runPath);
            resolve(exitCode);
        });
    }));
}
exports.openReport = openReport;
//# sourceMappingURL=allureReport.js.map