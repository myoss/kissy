function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/overlay/overlay-xtpl.js']) {
  _$jscoverage['/overlay/overlay-xtpl.js'] = {};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[2] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[4] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[5] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[10] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[11] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[13] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[24] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[25] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[26] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[27] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[28] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[29] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[30] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[31] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[32] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[33] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[34] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[35] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[36] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[37] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[38] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[39] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[40] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[41] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[42] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[43] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[44] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[45] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[46] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[47] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[48] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[49] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[50] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[51] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[52] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[53] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[54] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[55] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[56] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[57] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[59] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[60] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[61] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[63] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[64] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[65] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[66] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[67] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[68] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[69] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[70] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[71] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[72] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[73] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[74] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[75] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[76] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[77] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[78] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[79] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[80] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[81] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[82] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[83] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[84] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[86] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[87] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[89] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[90] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[91] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[93] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[94] = 0;
}
if (! _$jscoverage['/overlay/overlay-xtpl.js'].functionData) {
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[0] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[1] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[2] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[3] = 0;
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[4] = 0;
}
if (! _$jscoverage['/overlay/overlay-xtpl.js'].branchData) {
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData = {};
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['10'] = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['10'][1] = new BranchData();
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['10'][2] = new BranchData();
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['83'] = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['83'][1] = new BranchData();
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['83'][2] = new BranchData();
}
_$jscoverage['/overlay/overlay-xtpl.js'].branchData['83'][2].init(157, 10, 'id18 === 0');
function visit46_83_2(result) {
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['83'][2].ranCondition(result);
  return result;
}_$jscoverage['/overlay/overlay-xtpl.js'].branchData['83'][1].init(149, 18, 'id18 || id18 === 0');
function visit45_83_1(result) {
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['83'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/overlay-xtpl.js'].branchData['10'][2].init(226, 29, 'typeof module !== "undefined"');
function visit44_10_2(result) {
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['10'][2].ranCondition(result);
  return result;
}_$jscoverage['/overlay/overlay-xtpl.js'].branchData['10'][1].init(226, 45, 'typeof module !== "undefined" && module.kissy');
function visit43_10_1(result) {
  _$jscoverage['/overlay/overlay-xtpl.js'].branchData['10'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/overlay-xtpl.js'].lineData[2]++;
KISSY.add(function(S, require, exports, module) {
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[0]++;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[4]++;
  var t = function(scope, S, payload, undefined) {
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[1]++;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[5]++;
  var buffer = "", engine = this, moduleWrap, escapeHtml = S.escapeHtml, nativeCommands = engine.nativeCommands, utils = engine.utils;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[10]++;
  if (visit43_10_1(visit44_10_2(typeof module !== "undefined") && module.kissy)) {
    _$jscoverage['/overlay/overlay-xtpl.js'].lineData[11]++;
    moduleWrap = module;
  }
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[13]++;
  var callCommandUtil = utils.callCommand, debuggerCommand = nativeCommands["debugger"], eachCommand = nativeCommands.each, withCommand = nativeCommands["with"], ifCommand = nativeCommands["if"], setCommand = nativeCommands.set, includeCommand = nativeCommands.include, parseCommand = nativeCommands.parse, extendCommand = nativeCommands.extend, blockCommand = nativeCommands.block, macroCommand = nativeCommands.macro;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[24]++;
  buffer += '';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[25]++;
  var option0 = {};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[26]++;
  var params1 = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[27]++;
  params1.push('ks-overlay-closable');
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[28]++;
  option0.params = params1;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[29]++;
  option0.fn = function(scope) {
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[2]++;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[30]++;
  var buffer = "";
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[31]++;
  buffer += '\n    ';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[32]++;
  var option2 = {};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[33]++;
  var params3 = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[34]++;
  var id4 = scope.resolve(["closable"]);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[35]++;
  params3.push(id4);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[36]++;
  option2.params = params3;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[37]++;
  option2.fn = function(scope) {
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[3]++;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[38]++;
  var buffer = "";
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[39]++;
  buffer += '\n        <a href="javascript:void(\'close\')"\n           id="ks-overlay-close-';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[40]++;
  var id5 = scope.resolve(["id"]);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[41]++;
  buffer += escapeHtml(id5);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[42]++;
  buffer += '"\n           class="';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[43]++;
  var option7 = {};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[44]++;
  var params8 = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[45]++;
  params8.push('close');
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[46]++;
  option7.params = params8;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[47]++;
  var id6 = callCommandUtil(engine, scope, option7, "getBaseCssClasses", 5);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[48]++;
  buffer += escapeHtml(id6);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[49]++;
  buffer += '"\n           role=\'button\'>\n            <span class="';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[50]++;
  var option10 = {};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[51]++;
  var params11 = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[52]++;
  params11.push('close-x');
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[53]++;
  option10.params = params11;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[54]++;
  var id9 = callCommandUtil(engine, scope, option10, "getBaseCssClasses", 7);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[55]++;
  buffer += escapeHtml(id9);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[56]++;
  buffer += '">close</span>\n        </a>\n    ';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[57]++;
  return buffer;
};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[59]++;
  buffer += ifCommand.call(engine, scope, option2, payload);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[60]++;
  buffer += '\n';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[61]++;
  return buffer;
};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[63]++;
  buffer += blockCommand.call(engine, scope, option0, payload);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[64]++;
  buffer += '\n\n<div id="ks-content-';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[65]++;
  var id12 = scope.resolve(["id"]);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[66]++;
  buffer += escapeHtml(id12);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[67]++;
  buffer += '"\n     class="';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[68]++;
  var option14 = {};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[69]++;
  var params15 = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[70]++;
  params15.push('content');
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[71]++;
  option14.params = params15;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[72]++;
  var id13 = callCommandUtil(engine, scope, option14, "getBaseCssClasses", 13);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[73]++;
  buffer += escapeHtml(id13);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[74]++;
  buffer += '">\n    ';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[75]++;
  var option16 = {};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[76]++;
  var params17 = [];
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[77]++;
  params17.push('ks-overlay-content');
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[78]++;
  option16.params = params17;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[79]++;
  option16.fn = function(scope) {
  _$jscoverage['/overlay/overlay-xtpl.js'].functionData[4]++;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[80]++;
  var buffer = "";
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[81]++;
  buffer += '\n        ';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[82]++;
  var id18 = scope.resolve(["content"]);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[83]++;
  if (visit45_83_1(id18 || visit46_83_2(id18 === 0))) {
    _$jscoverage['/overlay/overlay-xtpl.js'].lineData[84]++;
    buffer += id18;
  }
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[86]++;
  buffer += '\n    ';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[87]++;
  return buffer;
};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[89]++;
  buffer += blockCommand.call(engine, scope, option16, payload);
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[90]++;
  buffer += '\n</div>';
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[91]++;
  return buffer;
};
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[93]++;
  t.TPL_NAME = module.name;
  _$jscoverage['/overlay/overlay-xtpl.js'].lineData[94]++;
  return t;
});
