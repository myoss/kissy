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
if (! _$jscoverage['/menu/check-menuitem-xtpl.js']) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'] = {};
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData = [];
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[2] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[4] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[5] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[10] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[11] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[13] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[24] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[25] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[26] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[27] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[28] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[29] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[30] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[31] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[32] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[33] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[34] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[35] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[36] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[37] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[38] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[40] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[41] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[42] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[44] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[46] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[47] = 0;
}
if (! _$jscoverage['/menu/check-menuitem-xtpl.js'].functionData) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].functionData = [];
  _$jscoverage['/menu/check-menuitem-xtpl.js'].functionData[0] = 0;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].functionData[1] = 0;
}
if (! _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData = {};
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['10'] = [];
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['10'][1] = new BranchData();
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['10'][2] = new BranchData();
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['36'] = [];
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['36'][1] = new BranchData();
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['41'] = [];
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['41'][1] = new BranchData();
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['41'][2] = new BranchData();
}
_$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['41'][2].init(1699, 9, 'id3 === 0');
function visit6_41_2(result) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['41'][2].ranCondition(result);
  return result;
}_$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['41'][1].init(1692, 16, 'id3 || id3 === 0');
function visit5_41_1(result) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['41'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['36'][1].init(1430, 10, 'moduleWrap');
function visit4_36_1(result) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['36'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['10'][2].init(226, 29, 'typeof module !== "undefined"');
function visit3_10_2(result) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['10'][2].ranCondition(result);
  return result;
}_$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['10'][1].init(226, 45, 'typeof module !== "undefined" && module.kissy');
function visit2_10_1(result) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].branchData['10'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[2]++;
KISSY.add(function(S, require, exports, module) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].functionData[0]++;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[4]++;
  var t = function(scope, S, payload, undefined) {
  _$jscoverage['/menu/check-menuitem-xtpl.js'].functionData[1]++;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[5]++;
  var buffer = "", engine = this, moduleWrap, escapeHtml = S.escapeHtml, nativeCommands = engine.nativeCommands, utils = engine.utils;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[10]++;
  if (visit2_10_1(visit3_10_2(typeof module !== "undefined") && module.kissy)) {
    _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[11]++;
    moduleWrap = module;
  }
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[13]++;
  var callCommandUtil = utils.callCommand, debuggerCommand = nativeCommands["debugger"], eachCommand = nativeCommands.each, withCommand = nativeCommands["with"], ifCommand = nativeCommands["if"], setCommand = nativeCommands.set, includeCommand = nativeCommands.include, parseCommand = nativeCommands.parse, extendCommand = nativeCommands.extend, blockCommand = nativeCommands.block, macroCommand = nativeCommands.macro;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[24]++;
  buffer += '<div class="';
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[25]++;
  var option1 = {};
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[26]++;
  var params2 = [];
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[27]++;
  params2.push('checkbox');
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[28]++;
  option1.params = params2;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[29]++;
  var id0 = callCommandUtil(engine, scope, option1, "getBaseCssClasses", 1);
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[30]++;
  buffer += escapeHtml(id0);
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[31]++;
  buffer += '">\n</div>\n';
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[32]++;
  var option4 = {};
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[33]++;
  var params5 = [];
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[34]++;
  params5.push('component/extension/content-xtpl');
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[35]++;
  option4.params = params5;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[36]++;
  if (visit4_36_1(moduleWrap)) {
    _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[37]++;
    require("component/extension/content-xtpl");
    _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[38]++;
    option4.params[0] = moduleWrap.resolveByName(option4.params[0]);
  }
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[40]++;
  var id3 = includeCommand.call(engine, scope, option4, payload);
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[41]++;
  if (visit5_41_1(id3 || visit6_41_2(id3 === 0))) {
    _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[42]++;
    buffer += id3;
  }
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[44]++;
  return buffer;
};
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[46]++;
  t.TPL_NAME = module.name;
  _$jscoverage['/menu/check-menuitem-xtpl.js'].lineData[47]++;
  return t;
});
