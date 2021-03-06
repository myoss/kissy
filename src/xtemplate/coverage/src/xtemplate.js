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
if (! _$jscoverage['/xtemplate.js']) {
  _$jscoverage['/xtemplate.js'] = {};
  _$jscoverage['/xtemplate.js'].lineData = [];
  _$jscoverage['/xtemplate.js'].lineData[6] = 0;
  _$jscoverage['/xtemplate.js'].lineData[7] = 0;
  _$jscoverage['/xtemplate.js'].lineData[8] = 0;
  _$jscoverage['/xtemplate.js'].lineData[9] = 0;
  _$jscoverage['/xtemplate.js'].lineData[31] = 0;
  _$jscoverage['/xtemplate.js'].lineData[32] = 0;
  _$jscoverage['/xtemplate.js'].lineData[35] = 0;
  _$jscoverage['/xtemplate.js'].lineData[37] = 0;
  _$jscoverage['/xtemplate.js'].lineData[42] = 0;
  _$jscoverage['/xtemplate.js'].lineData[43] = 0;
  _$jscoverage['/xtemplate.js'].lineData[46] = 0;
  _$jscoverage['/xtemplate.js'].lineData[48] = 0;
  _$jscoverage['/xtemplate.js'].lineData[49] = 0;
  _$jscoverage['/xtemplate.js'].lineData[52] = 0;
  _$jscoverage['/xtemplate.js'].lineData[56] = 0;
  _$jscoverage['/xtemplate.js'].lineData[57] = 0;
  _$jscoverage['/xtemplate.js'].lineData[58] = 0;
  _$jscoverage['/xtemplate.js'].lineData[59] = 0;
  _$jscoverage['/xtemplate.js'].lineData[60] = 0;
  _$jscoverage['/xtemplate.js'].lineData[61] = 0;
  _$jscoverage['/xtemplate.js'].lineData[64] = 0;
  _$jscoverage['/xtemplate.js'].lineData[91] = 0;
}
if (! _$jscoverage['/xtemplate.js'].functionData) {
  _$jscoverage['/xtemplate.js'].functionData = [];
  _$jscoverage['/xtemplate.js'].functionData[0] = 0;
  _$jscoverage['/xtemplate.js'].functionData[1] = 0;
  _$jscoverage['/xtemplate.js'].functionData[2] = 0;
  _$jscoverage['/xtemplate.js'].functionData[3] = 0;
}
if (! _$jscoverage['/xtemplate.js'].branchData) {
  _$jscoverage['/xtemplate.js'].branchData = {};
  _$jscoverage['/xtemplate.js'].branchData['42'] = [];
  _$jscoverage['/xtemplate.js'].branchData['42'][1] = new BranchData();
  _$jscoverage['/xtemplate.js'].branchData['42'][2] = new BranchData();
  _$jscoverage['/xtemplate.js'].branchData['48'] = [];
  _$jscoverage['/xtemplate.js'].branchData['48'][1] = new BranchData();
  _$jscoverage['/xtemplate.js'].branchData['57'] = [];
  _$jscoverage['/xtemplate.js'].branchData['57'][1] = new BranchData();
  _$jscoverage['/xtemplate.js'].branchData['60'] = [];
  _$jscoverage['/xtemplate.js'].branchData['60'][1] = new BranchData();
}
_$jscoverage['/xtemplate.js'].branchData['60'][1].init(95, 23, 'typeof tpl === \'string\'');
function visit5_60_1(result) {
  _$jscoverage['/xtemplate.js'].branchData['60'][1].ranCondition(result);
  return result;
}_$jscoverage['/xtemplate.js'].branchData['57'][1].init(48, 14, '!self.compiled');
function visit4_57_1(result) {
  _$jscoverage['/xtemplate.js'].branchData['57'][1].ranCondition(result);
  return result;
}_$jscoverage['/xtemplate.js'].branchData['48'][1].init(310, 22, 'config.cache !== false');
function visit3_48_1(result) {
  _$jscoverage['/xtemplate.js'].branchData['48'][1].ranCondition(result);
  return result;
}_$jscoverage['/xtemplate.js'].branchData['42'][2].init(143, 22, 'config.cache !== false');
function visit2_42_2(result) {
  _$jscoverage['/xtemplate.js'].branchData['42'][2].ranCondition(result);
  return result;
}_$jscoverage['/xtemplate.js'].branchData['42'][1].init(143, 43, 'config.cache !== false && (fn = cache[tpl])');
function visit1_42_1(result) {
  _$jscoverage['/xtemplate.js'].branchData['42'][1].ranCondition(result);
  return result;
}_$jscoverage['/xtemplate.js'].lineData[6]++;
KISSY.add(function(S, require) {
  _$jscoverage['/xtemplate.js'].functionData[0]++;
  _$jscoverage['/xtemplate.js'].lineData[7]++;
  var XTemplateRuntime = require('xtemplate/runtime');
  _$jscoverage['/xtemplate.js'].lineData[8]++;
  var compiler = require('xtemplate/compiler');
  _$jscoverage['/xtemplate.js'].lineData[9]++;
  var cache = XTemplate.cache = {};
  _$jscoverage['/xtemplate.js'].lineData[31]++;
  function XTemplate() {
    _$jscoverage['/xtemplate.js'].functionData[1]++;
    _$jscoverage['/xtemplate.js'].lineData[32]++;
    XTemplate.superclass.constructor.apply(this, arguments);
  }
  _$jscoverage['/xtemplate.js'].lineData[35]++;
  S.extend(XTemplate, XTemplateRuntime, {
  compile: function() {
  _$jscoverage['/xtemplate.js'].functionData[2]++;
  _$jscoverage['/xtemplate.js'].lineData[37]++;
  var fn, self = this, config = self.config, tpl = self.tpl;
  _$jscoverage['/xtemplate.js'].lineData[42]++;
  if (visit1_42_1(visit2_42_2(config.cache !== false) && (fn = cache[tpl]))) {
    _$jscoverage['/xtemplate.js'].lineData[43]++;
    return fn;
  }
  _$jscoverage['/xtemplate.js'].lineData[46]++;
  fn = compiler.compileToFn(tpl, self.name);
  _$jscoverage['/xtemplate.js'].lineData[48]++;
  if (visit3_48_1(config.cache !== false)) {
    _$jscoverage['/xtemplate.js'].lineData[49]++;
    cache[tpl] = fn;
  }
  _$jscoverage['/xtemplate.js'].lineData[52]++;
  return fn;
}, 
  render: function() {
  _$jscoverage['/xtemplate.js'].functionData[3]++;
  _$jscoverage['/xtemplate.js'].lineData[56]++;
  var self = this;
  _$jscoverage['/xtemplate.js'].lineData[57]++;
  if (visit4_57_1(!self.compiled)) {
    _$jscoverage['/xtemplate.js'].lineData[58]++;
    self.compiled = 1;
    _$jscoverage['/xtemplate.js'].lineData[59]++;
    var tpl = self.tpl;
    _$jscoverage['/xtemplate.js'].lineData[60]++;
    if (visit5_60_1(typeof tpl === 'string')) {
      _$jscoverage['/xtemplate.js'].lineData[61]++;
      self.tpl = self.compile();
    }
  }
  _$jscoverage['/xtemplate.js'].lineData[64]++;
  return XTemplate.superclass.render.apply(self, arguments);
}}, {
  compiler: compiler, 
  Scope: XTemplateRuntime.Scope, 
  RunTime: XTemplateRuntime, 
  addCommand: XTemplateRuntime.addCommand, 
  removeCommand: XTemplateRuntime.removeCommand});
  _$jscoverage['/xtemplate.js'].lineData[91]++;
  return XTemplate;
});
