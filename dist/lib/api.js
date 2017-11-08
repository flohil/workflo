"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("./page_objects/builders");
const testinfo = require(jasmine.getEnv().testInfoFilePath);
const executionFilters = testinfo.executionFilters;
const traceInfo = testinfo.traceInfo;
const criteriaAnalysis = testinfo.criteriaAnalysis;
const automaticOnly = testinfo.automaticOnly;
const manualOnly = testinfo.manualOnly;
const storyMap = new Map();
const words = {
    'Given': 'Given',
    'When': 'When',
    'Then': 'Then',
    'And': 'And',
};
function featuresInclude(id) {
    return id in executionFilters.features;
}
function specsInclude(id) {
    return id in executionFilters.specs;
}
function suitesInclude(id) {
    return id in executionFilters.suites;
}
function testcasesInclude(id) {
    return id in executionFilters.testcases;
}
function shouldRunThen(story, criteria) {
    // check if spec is included in filters
    // do not execute spec if it is not in testcase filters but in validated in other testcases
    const testcases = traceInfo.specs[story].criteriaValidationFiles[criteria.toString()].testcaseIds;
    let inSomeTestcase = false;
    if (!manualOnly) {
        for (const testcase in testcases) {
            if (testcase in executionFilters.testcases) {
                return true;
            }
        }
    }
    if (criteria in criteriaAnalysis.specs[story].uncovered) {
        return true;
    }
    if (!automaticOnly) {
        if (criteria in criteriaAnalysis.specs[story].manual) {
            return true;
        }
    }
    return false;
}
exports.Feature = (description, metadata, bodyFunc, jasmineFunc = describe) => {
    if (description.length === 0) {
        throw new Error(`Feature description must not be empty!`);
    }
    this.__currentFeature = description;
    if (featuresInclude(description)) {
        jasmineFunc(`${description}:`, bodyFunc);
    }
};
exports.fFeature = (description, metadata, bodyFunc) => {
    exports.Feature(description, metadata, bodyFunc, fdescribe);
};
exports.xFeature = (description, metadata, bodyFunc) => {
    exports.Feature(description, metadata, bodyFunc, xdescribe);
};
exports.Story = (id, description, metadata, bodyFunc, jasmineFunc = describe) => {
    if (id.length === 0) {
        throw new Error(`Story id must not be empty!`);
    }
    const fullStoryName = `${id} - ${description}`;
    this.__currentStoryId = id;
    storyMap.set(id, {
        descriptionStack: { givens: [], whens: [] },
        metadata: metadata,
        featureName: this.__currentFeature,
        storyName: fullStoryName,
        description: description,
        insideWhenSequence: false,
        whenSequenceLengths: [],
        whenRecLevel: 0,
        insideGivenSequence: false,
        givenSequenceLengths: [],
        givenRecLevel: 0
    });
    if (specsInclude(id)) {
        jasmineFunc(fullStoryName, bodyFunc);
    }
};
exports.fStory = (id, description, metadata, bodyFunc) => {
    exports.Story(id, description, metadata, bodyFunc, fdescribe);
};
exports.xStory = (id, description, metadata, bodyFunc) => {
    exports.Story(id, description, metadata, bodyFunc, xdescribe);
};
exports.Given = (description, bodyFunc) => {
    const story = storyMap.get(this.__currentStoryId);
    const prevRecDepth = story.givenSequenceLengths.length;
    // new given block
    if (!story.insideGivenSequence) {
        // remove descriptions from previous given blocks in same recursion level
        const prevGivens = story.givenSequenceLengths[story.givenRecLevel];
        for (let i = 0; i < prevGivens; ++i) {
            story.descriptionStack.givens.pop();
        }
        story.givenSequenceLengths[story.givenRecLevel] = 0;
    }
    else {
        story.insideGivenSequence = false;
    }
    story.descriptionStack.givens.push(description);
    if (bodyFunc) {
        // for counting number of given sequence elements in nested block
        story.givenSequenceLengths.push(0);
        story.givenRecLevel++;
        bodyFunc();
        story.givenRecLevel--;
        const newRecDepth = story.givenSequenceLengths.length;
        // removes descriptions of nested givens
        if (newRecDepth > prevRecDepth) {
            const nestedDescriptionsCount = story.givenSequenceLengths[newRecDepth - 1];
            for (let i = 0; i < nestedDescriptionsCount; ++i) {
                story.descriptionStack.givens.pop();
            }
        }
        story.givenSequenceLengths.pop();
    }
    // if there is no count for current recursion level yet
    if (story.givenSequenceLengths.length <= story.givenRecLevel) {
        story.givenSequenceLengths.push(0);
    }
    // increase length of sequence in current recursion level
    story.givenSequenceLengths[story.givenSequenceLengths.length - 1]++;
    return {
        "And": (description, bodyFunc) => {
            story.insideGivenSequence = true;
            return exports.Given.call(this, description, bodyFunc);
        }
    };
};
exports.When = (description, bodyFunc) => {
    const story = storyMap.get(this.__currentStoryId);
    const prevRecDepth = story.whenSequenceLengths.length;
    // new when block
    if (!story.insideWhenSequence) {
        // remove descriptions from previous when blocks in same recursion level
        const prevWhens = story.whenSequenceLengths[story.whenRecLevel];
        for (let i = 0; i < prevWhens; ++i) {
            story.descriptionStack.whens.pop();
        }
        story.whenSequenceLengths[story.whenRecLevel] = 0;
    }
    else {
        story.insideWhenSequence = false;
    }
    story.descriptionStack.whens.push(description);
    if (bodyFunc) {
        // for counting number of when sequence elements in nested block
        story.whenSequenceLengths.push(0);
        story.whenRecLevel++;
        bodyFunc();
        story.whenRecLevel--;
        const newRecDepth = story.whenSequenceLengths.length;
        // removes descriptions of nested whens
        if (newRecDepth > prevRecDepth) {
            const nestedDescriptionsCount = story.whenSequenceLengths[newRecDepth - 1];
            for (let i = 0; i < nestedDescriptionsCount; ++i) {
                story.descriptionStack.whens.pop();
            }
        }
        story.whenSequenceLengths.pop();
    }
    // if there is no count for current recursion level yet
    if (story.whenSequenceLengths.length <= story.whenRecLevel) {
        story.whenSequenceLengths.push(0);
    }
    // increase length of sequence in current recursion level
    story.whenSequenceLengths[story.whenSequenceLengths.length - 1]++;
    return {
        "And": (description, bodyFunc) => {
            story.insideWhenSequence = true;
            return exports.When.call(this, description, bodyFunc);
        }
    };
};
exports.Then = (id, description, jasmineFunc = it, skip = false) => {
    const story = storyMap.get(this.__currentStoryId);
    const storyId = this.__currentStoryId;
    if (!shouldRunThen(storyId, id)) {
        return;
    }
    const stepFunc = (title) => {
        process.send({ event: 'step:start', title: title });
        process.send({ event: 'step:end' });
    };
    const reduceFunc = (acc, cur) => acc + `\n${words.And} ` + cur;
    const givenDescriptions = [`${words.Given} ${story.descriptionStack.givens[0]}`]
        .concat(story.descriptionStack.givens
        .slice(1, story.descriptionStack.givens.length)
        .map(description => `${words.And.toLocaleLowerCase()} ${description}`));
    const whenDescriptions = [`${words.When} ${story.descriptionStack.whens[0]}`]
        .concat(story.descriptionStack.whens
        .slice(1, story.descriptionStack.whens.length)
        .map(description => `${words.And.toLocaleLowerCase()} ${description}`));
    const thenDescription = `${words.Then} ${description}`;
    const allDescriptions = givenDescriptions.concat(whenDescriptions).concat([thenDescription]);
    const skipFunc = (skip) ? () => { pending(); } : undefined;
    const bodyFunc = () => {
        process.send({ event: 'test:setCurrentId', id: `${storyId}|${id}`, spec: true, descriptions: {
                spec: story.description,
                criteria: description
            } }); // split at last | occurence
        // allure report metadata
        process.send({ event: 'test:meta', feature: `${story.featureName}` });
        process.send({ event: 'test:meta', story: `${story.storyName}` });
        process.send({ event: 'test:meta', issue: story.metadata.issues });
        process.send({ event: 'test:meta', bug: story.metadata.bugs });
        process.send({ event: 'test:meta', severity: story.metadata.severity || 'normal' });
        // create an allure step for each given and when
        allDescriptions.slice(0, allDescriptions.length - 1).forEach(description => stepFunc(description));
        // for last allure step (then), check if results where correct
        process.send({ event: 'step:start', title: allDescriptions[allDescriptions.length - 1] });
        process.send({ event: 'step:end', validate: {
                criteriaId: id,
                storyId: storyId
            } });
    };
    const testData = {
        title: `${words.Then} ${id}: ${description}`,
        metadata: {
            feature: story.featureName,
            story: story.storyName,
            issue: story.metadata.issues,
            severity: story.metadata.severity
        }
    };
    jasmineFunc(JSON.stringify(testData), skipFunc || bodyFunc);
};
exports.fThen = (id, description) => {
    exports.Then(id, description, fit);
};
exports.xThen = (id, description) => {
    exports.Then(id, description, it, true);
};
exports.suite = (description, metadata, bodyFunc, jasmineFunc = describe) => {
    if (description.length === 0) {
        throw new Error(`Suite description must not be empty!`);
    }
    if (description.indexOf('.') > -1) {
        throw new Error(`Suite description must not contain '.' character: ${description}`);
    }
    else if (description.substr(0, 1) === '-') {
        throw new Error(`Suite description must start with '-' character: ${description}`);
    }
    if (!this.suiteIdStack) {
        this.suiteIdStack = [description];
    }
    else {
        this.suiteIdStack.push(description);
    }
    if (suitesInclude(this.suiteIdStack.join('.'))) {
        jasmineFunc(description, bodyFunc);
    }
    this.suiteIdStack.pop();
};
exports.fsuite = (description, metadata, bodyFunc) => {
    exports.suite(description, metadata, bodyFunc, fdescribe);
};
exports.xsuite = (description, metadata, bodyFunc) => {
    exports.suite(description, metadata, bodyFunc, xdescribe);
};
exports.testcase = (description, metadata, bodyFunc, jasmineFunc = it) => {
    if (description.length === 0) {
        throw new Error(`Testcase description must not be empty!`);
    }
    const fullId = `${this.suiteIdStack.join('.')}.${description}`;
    this.__stepStack = [];
    const testData = {
        title: description
    };
    const _bodyFunc = () => {
        process.send({ event: 'test:setCurrentId', id: fullId, testcase: true });
        // allure report metadata
        if (metadata.bugs) {
            process.send({ event: 'test:meta', bug: metadata.bugs });
        }
        process.send({ event: 'test:meta', severity: metadata.severity || 'normal' });
        bodyFunc();
    };
    if (testcasesInclude(`${this.suiteIdStack.join('.')}.${description}`)) {
        jasmineFunc(JSON.stringify(testData), _bodyFunc);
    }
};
exports.ftestcase = (description, metadata, bodyFunc) => {
    exports.testcase(description, metadata, bodyFunc, fit);
};
exports.xtestcase = (description, metadata, bodyFunc) => {
    exports.testcase(description, metadata, () => { pending(); });
};
const _when = function (step, prefix) {
    //process.send({event: 'step:start', title: `${prefix} ${step.description}`})
    step.execute(prefix);
    //process.send({event: 'step:end'})
    return {
        "and": step => _when(step, words.And.toLowerCase())
    };
};
const _given = function (step, prefix) {
    //process.send({event: 'step:start', title: `${prefix} ${step.description}`})
    step.execute(prefix);
    //process.send({event: 'step:end'})
    return {
        "and": step => _given(step, words.And.toLowerCase()),
        "when": step => _when(step, words.When)
    };
};
exports.given = function (step) {
    return _given(step, words.Given);
};
exports.validate = function (specObj, func) {
    const validateContainer = {
        specObj: specObj
    };
    process.send({ event: 'validate:start', specObj: specObj });
    const _process = process;
    if (typeof _process.workflo === 'undefined') {
        _process.workflo = {};
    }
    _process.workflo.specObj = specObj;
    process.send({ event: 'step:start', title: `validate: ${JSON.stringify(specObj)}` });
    func();
    process.send({ event: 'validate:end', specObj: specObj });
    process.send({ event: 'step:end', type: 'validateEnd' });
    _process.workflo.specObj = undefined;
};
function xpath(selector) {
    return builders_1.XPathBuilder.getInstance().reset(selector);
}
exports.xpath = xpath;
//# sourceMappingURL=api.js.map