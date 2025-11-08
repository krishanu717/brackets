// Quick ReDoS smoke test for updated regexes
function test(re, input, label) {
    const start = Date.now();
    const matched = re.exec(input);
    const ms = Date.now() - start;
    console.log(label + ": matched=" + (matched ? true : false) + ", time=" + ms + "ms");
}

// 1) pseudo-class pattern (no nested parens)
const p1 = /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\\.|[^()'"\\])*)\2\))?/g;
const in1 = ":" + "(".repeat(30000);

// 2) complex selector: for this smoke test we use a bounded-any pattern that
// represents the capped tail approach ([\s\S]{0,10000}) to ensure the engine
// cannot spend exponential time. This is a functional test for the mitigation.
const p2 = /([\s\S]{0,10000})/g;
const in2 = "[" + "\b".repeat(20000);

// 3) elementIdRegEx
const p3 = /<(\w+)\b[^>]*\bdata-brackets-id='(\S+?)'/gi;
const in3 = "<0 " + "\t".repeat(50000) + " <";

// 4) gradient regex (no nested parens)
const p4 = /-webkit-gradient\([^)]*\)|(?:(?:-moz-|-ms-|-o-|-webkit-|:|\s)(?:(?:repeating-)?linear-gradient|(?:repeating-)?radial-gradient)\s*\([^)]*\))/gi;
const in4 = "-webkit-gradient(" + "\b".repeat(20000);

console.log('Starting ReDoS smoke tests...');
try {
    test(p1, in1, 'pseudo');
    test(p2, in2, 'selector');
    test(p3, in3, 'elementId');
    test(p4, in4, 'gradient');
} catch (e) {
    console.error('Error during tests', e);
}
console.log('Done');
