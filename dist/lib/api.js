"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storyMap = new Map();
const words = {
    'Given': 'Given',
    'When': 'When',
    'Then': 'Then',
    'And': 'And',
};
exports.Feature = (description, metadata, bodyFunc, jasmineFunc = describe) => {
    this.__currentFeature = description;
    jasmineFunc(`${description}:`, bodyFunc);
};
exports.fFeature = (description, metadata, bodyFunc) => {
    exports.Feature(description, metadata, bodyFunc, fdescribe);
};
exports.xFeature = (description, metadata, bodyFunc) => {
    exports.Feature(description, metadata, bodyFunc, xdescribe);
};
exports.Story = (id, description, metadata, bodyFunc, jasmineFunc = describe) => {
    const fullStoryName = `${id} - ${description}`;
    this.__currentStoryId = id;
    storyMap.set(id, {
        descriptionStack: { givens: [], whens: [] },
        metadata: metadata,
        featureName: this.__currentFeature,
        storyName: fullStoryName,
        insideWhenSequence: false,
        insideGivenSequence: false,
        givenSequenceLengths: [],
        givenRecLevel: 0
    });
    jasmineFunc(fullStoryName, bodyFunc);
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
    if (!story.insideWhenSequence) {
        story.descriptionStack.whens = [];
    }
    else {
        story.insideWhenSequence = false;
    }
    story.descriptionStack.whens.push(description); // empty after when chain has ended
    if (bodyFunc) {
        bodyFunc();
    }
    return {
        "And": (description, bodyFunc) => {
            story.insideWhenSequence = true;
            return exports.When.call(this, description, bodyFunc);
        }
    };
};
exports.Then = (id, description, jasmineFunc = it) => {
    const story = storyMap.get(this.__currentStoryId);
    const storyId = this.__currentStoryId;
    const stepFunc = (title) => {
        process.send({ event: 'step:triggerSpecMode' }); // workaround until runner and reporter are properly customized
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
    const bodyFunc = () => {
        // allure report metadata
        process.send({ event: 'test:meta', feature: `${story.featureName}` });
        process.send({ event: 'test:meta', story: `${story.storyName}` });
        process.send({ event: 'test:meta', issue: story.metadata.issues });
        process.send({ event: 'test:meta', severity: story.metadata.severity || 'normal' });
        process.send({ event: 'test:meta', description: 'my description' });
        // create an allure step for each given and when
        allDescriptions.slice(0, allDescriptions.length - 1).forEach(description => stepFunc(description));
        // for last allure step (then), check if results where correct
        process.send({ event: 'step:start', title: allDescriptions[allDescriptions.length - 1] });
        process.send({ event: 'step:end', verify: {
                criteriaId: id,
                storyId: storyId
            } });
    };
    jasmineFunc(`${words.Then} ${id}: ${description}`, bodyFunc);
};
exports.fThen = (id, description) => {
    exports.Then(id, description, fit);
};
exports.xThen = (id, description) => {
    exports.Then(id, description, xit);
};
exports.suite = (description, metadata, bodyFunc, jasmineFunc = describe) => {
    jasmineFunc(description, bodyFunc);
};
exports.fsuite = (description, metadata, bodyFunc) => {
    exports.suite(description, metadata, bodyFunc, fdescribe);
};
exports.xsuite = (description, metadata, bodyFunc) => {
    exports.suite(description, metadata, bodyFunc, xdescribe);
};
exports.testcase = (description, metadata, bodyFunc, jasmineFunc = it) => {
    this.__stepStack = [];
    jasmineFunc(description, bodyFunc);
};
exports.ftestcase = (description, metadata, bodyFunc) => {
    exports.testcase(description, metadata, bodyFunc, fit);
};
exports.xtestcase = (description, metadata, bodyFunc) => {
    exports.testcase(description, metadata, bodyFunc, xit);
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
exports.verify = function (specObj, func) {
    const verifyContainer = {
        specObj: specObj
    };
    process.send({ event: 'step:verifyStart', verifyContainer: verifyContainer });
    const _process = process;
    if (typeof _process.workflo === 'undefined') {
        _process.workflo = {};
    }
    _process.workflo.specObj = specObj;
    process.send({ event: 'step:start', title: `verify: ${JSON.stringify(specObj)}` });
    func();
    process.send({ event: 'step:end', type: 'verifyEnd' });
    _process.workflo.specObj = undefined;
};
//# sourceMappingURL=api.js.map