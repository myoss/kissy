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
if (! _$jscoverage['/modules.js']) {
  _$jscoverage['/modules.js'] = {};
  _$jscoverage['/modules.js'].lineData = [];
  _$jscoverage['/modules.js'].lineData[3] = 0;
  _$jscoverage['/modules.js'].lineData[4] = 0;
  _$jscoverage['/modules.js'].lineData[9] = 0;
  _$jscoverage['/modules.js'].lineData[13] = 0;
  _$jscoverage['/modules.js'].lineData[17] = 0;
  _$jscoverage['/modules.js'].lineData[21] = 0;
  _$jscoverage['/modules.js'].lineData[25] = 0;
  _$jscoverage['/modules.js'].lineData[29] = 0;
  _$jscoverage['/modules.js'].lineData[33] = 0;
  _$jscoverage['/modules.js'].lineData[37] = 0;
  _$jscoverage['/modules.js'].lineData[41] = 0;
  _$jscoverage['/modules.js'].lineData[45] = 0;
  _$jscoverage['/modules.js'].lineData[49] = 0;
  _$jscoverage['/modules.js'].lineData[53] = 0;
  _$jscoverage['/modules.js'].lineData[57] = 0;
  _$jscoverage['/modules.js'].lineData[61] = 0;
  _$jscoverage['/modules.js'].lineData[65] = 0;
  _$jscoverage['/modules.js'].lineData[69] = 0;
  _$jscoverage['/modules.js'].lineData[73] = 0;
  _$jscoverage['/modules.js'].lineData[77] = 0;
  _$jscoverage['/modules.js'].lineData[81] = 0;
  _$jscoverage['/modules.js'].lineData[85] = 0;
  _$jscoverage['/modules.js'].lineData[89] = 0;
  _$jscoverage['/modules.js'].lineData[93] = 0;
  _$jscoverage['/modules.js'].lineData[97] = 0;
  _$jscoverage['/modules.js'].lineData[100] = 0;
  _$jscoverage['/modules.js'].lineData[115] = 0;
  _$jscoverage['/modules.js'].lineData[119] = 0;
  _$jscoverage['/modules.js'].lineData[123] = 0;
  _$jscoverage['/modules.js'].lineData[127] = 0;
  _$jscoverage['/modules.js'].lineData[130] = 0;
  _$jscoverage['/modules.js'].lineData[147] = 0;
  _$jscoverage['/modules.js'].lineData[151] = 0;
  _$jscoverage['/modules.js'].lineData[155] = 0;
  _$jscoverage['/modules.js'].lineData[159] = 0;
  _$jscoverage['/modules.js'].lineData[163] = 0;
  _$jscoverage['/modules.js'].lineData[167] = 0;
  _$jscoverage['/modules.js'].lineData[171] = 0;
  _$jscoverage['/modules.js'].lineData[175] = 0;
  _$jscoverage['/modules.js'].lineData[179] = 0;
  _$jscoverage['/modules.js'].lineData[183] = 0;
  _$jscoverage['/modules.js'].lineData[187] = 0;
  _$jscoverage['/modules.js'].lineData[191] = 0;
  _$jscoverage['/modules.js'].lineData[195] = 0;
  _$jscoverage['/modules.js'].lineData[199] = 0;
  _$jscoverage['/modules.js'].lineData[203] = 0;
  _$jscoverage['/modules.js'].lineData[207] = 0;
  _$jscoverage['/modules.js'].lineData[211] = 0;
  _$jscoverage['/modules.js'].lineData[215] = 0;
  _$jscoverage['/modules.js'].lineData[219] = 0;
  _$jscoverage['/modules.js'].lineData[223] = 0;
  _$jscoverage['/modules.js'].lineData[227] = 0;
  _$jscoverage['/modules.js'].lineData[231] = 0;
  _$jscoverage['/modules.js'].lineData[235] = 0;
  _$jscoverage['/modules.js'].lineData[238] = 0;
  _$jscoverage['/modules.js'].lineData[243] = 0;
  _$jscoverage['/modules.js'].lineData[247] = 0;
  _$jscoverage['/modules.js'].lineData[251] = 0;
  _$jscoverage['/modules.js'].lineData[255] = 0;
  _$jscoverage['/modules.js'].lineData[259] = 0;
  _$jscoverage['/modules.js'].lineData[263] = 0;
  _$jscoverage['/modules.js'].lineData[267] = 0;
  _$jscoverage['/modules.js'].lineData[271] = 0;
  _$jscoverage['/modules.js'].lineData[275] = 0;
  _$jscoverage['/modules.js'].lineData[279] = 0;
  _$jscoverage['/modules.js'].lineData[283] = 0;
  _$jscoverage['/modules.js'].lineData[287] = 0;
  _$jscoverage['/modules.js'].lineData[291] = 0;
  _$jscoverage['/modules.js'].lineData[295] = 0;
  _$jscoverage['/modules.js'].lineData[299] = 0;
  _$jscoverage['/modules.js'].lineData[304] = 0;
}
if (! _$jscoverage['/modules.js'].functionData) {
  _$jscoverage['/modules.js'].functionData = [];
  _$jscoverage['/modules.js'].functionData[0] = 0;
  _$jscoverage['/modules.js'].functionData[1] = 0;
}
if (! _$jscoverage['/modules.js'].branchData) {
  _$jscoverage['/modules.js'].branchData = {};
  _$jscoverage['/modules.js'].branchData['104'] = [];
  _$jscoverage['/modules.js'].branchData['104'][1] = new BranchData();
  _$jscoverage['/modules.js'].branchData['135'] = [];
  _$jscoverage['/modules.js'].branchData['135'][1] = new BranchData();
}
_$jscoverage['/modules.js'].branchData['135'][1].init(118, 13, 'UA.ieMode < 9');
function visit11_135_1(result) {
  _$jscoverage['/modules.js'].branchData['135'][1].ranCondition(result);
  return result;
}_$jscoverage['/modules.js'].branchData['104'][1].init(37, 13, 'UA.ieMode < 9');
function visit10_104_1(result) {
  _$jscoverage['/modules.js'].branchData['104'][1].ranCondition(result);
  return result;
}_$jscoverage['/modules.js'].lineData[3]++;
(function(config, Feature, UA) {
  _$jscoverage['/modules.js'].functionData[0]++;
  _$jscoverage['/modules.js'].lineData[4]++;
  config({
  'anim': {
  alias: KISSY.Feature.getCssVendorInfo('transition') ? 'anim/transition' : 'anim/timer'}});
  _$jscoverage['/modules.js'].lineData[9]++;
  config({
  'anim/base': {
  requires: ['dom', 'promise']}});
  _$jscoverage['/modules.js'].lineData[13]++;
  config({
  'anim/timer': {
  requires: ['dom', 'anim/base']}});
  _$jscoverage['/modules.js'].lineData[17]++;
  config({
  'anim/transition': {
  requires: ['dom', 'anim/base']}});
  _$jscoverage['/modules.js'].lineData[21]++;
  config({
  attribute: {
  requires: ['event/custom']}});
  _$jscoverage['/modules.js'].lineData[25]++;
  config({
  base: {
  requires: ['attribute']}});
  _$jscoverage['/modules.js'].lineData[29]++;
  config({
  button: {
  requires: ['node', 'component/control']}});
  _$jscoverage['/modules.js'].lineData[33]++;
  config({
  color: {
  requires: ['attribute']}});
  _$jscoverage['/modules.js'].lineData[37]++;
  config({
  combobox: {
  requires: ['node', 'component/control', 'menu', 'attribute', 'io']}});
  _$jscoverage['/modules.js'].lineData[41]++;
  config({
  'component/container': {
  requires: ['component/control', 'component/manager']}});
  _$jscoverage['/modules.js'].lineData[45]++;
  config({
  'component/control': {
  requires: ['node', 'base', 'component/manager', 'xtemplate/runtime']}});
  _$jscoverage['/modules.js'].lineData[49]++;
  config({
  'component/extension/align': {
  requires: ['node']}});
  _$jscoverage['/modules.js'].lineData[53]++;
  config({
  'component/extension/content-render': {
  requires: ['component/extension/content-xtpl']}});
  _$jscoverage['/modules.js'].lineData[57]++;
  config({
  'component/extension/delegate-children': {
  requires: ['node', 'component/manager']}});
  _$jscoverage['/modules.js'].lineData[61]++;
  config({
  'component/plugin/drag': {
  requires: ['dd']}});
  _$jscoverage['/modules.js'].lineData[65]++;
  config({
  'component/plugin/resize': {
  requires: ['resizable']}});
  _$jscoverage['/modules.js'].lineData[69]++;
  config({
  'date/format': {
  requires: ['date/gregorian', 'i18n!date']}});
  _$jscoverage['/modules.js'].lineData[73]++;
  config({
  'date/gregorian': {
  requires: ['i18n!date']}});
  _$jscoverage['/modules.js'].lineData[77]++;
  config({
  'date/picker': {
  requires: ['node', 'date/gregorian', 'i18n!date/picker', 'component/control', 'date/format', 'date/picker-xtpl']}});
  _$jscoverage['/modules.js'].lineData[81]++;
  config({
  'date/popup-picker': {
  requires: ['date/picker-xtpl', 'date/picker', 'component/extension/shim', 'component/extension/align']}});
  _$jscoverage['/modules.js'].lineData[85]++;
  config({
  dd: {
  requires: ['node', 'base', 'event/gesture/drag']}});
  _$jscoverage['/modules.js'].lineData[89]++;
  config({
  'dd/plugin/constrain': {
  requires: ['node', 'base']}});
  _$jscoverage['/modules.js'].lineData[93]++;
  config({
  'dd/plugin/proxy': {
  requires: ['node', 'dd', 'base']}});
  _$jscoverage['/modules.js'].lineData[97]++;
  config({
  'dd/plugin/scroll': {
  requires: ['node', 'dd', 'base']}});
  _$jscoverage['/modules.js'].lineData[100]++;
  config({
  'dom/basic': {
  alias: ['dom/base', visit10_104_1(UA.ieMode < 9) ? 'dom/ie' : '', Feature.isClassListSupported() ? '' : 'dom/class-list']}, 
  dom: {
  alias: ['dom/basic', !Feature.isQuerySelectorSupported() ? 'dom/selector' : '']}});
  _$jscoverage['/modules.js'].lineData[115]++;
  config({
  'dom/class-list': {
  requires: ['dom/base']}});
  _$jscoverage['/modules.js'].lineData[119]++;
  config({
  'dom/ie': {
  requires: ['dom/base']}});
  _$jscoverage['/modules.js'].lineData[123]++;
  config({
  'dom/selector': {
  requires: ['dom/basic']}});
  _$jscoverage['/modules.js'].lineData[127]++;
  config({
  editor: {
  requires: ['node', 'html-parser', 'component/control']}});
  _$jscoverage['/modules.js'].lineData[130]++;
  config({
  'event/dom': {
  alias: ['event/dom/base', Feature.isHashChangeSupported() ? '' : 'event/dom/hashchange', visit11_135_1(UA.ieMode < 9) ? 'event/dom/ie' : '', Feature.isInputEventSupported() ? '' : 'event/dom/input', UA.ie ? '' : 'event/dom/focusin']}, 
  'event/gesture': {
  alias: ['event/gesture/base', Feature.isTouchGestureSupported() ? 'event/gesture/touch' : '']}});
  _$jscoverage['/modules.js'].lineData[147]++;
  config({
  event: {
  requires: ['event/dom', 'event/custom', 'event/gesture']}});
  _$jscoverage['/modules.js'].lineData[151]++;
  config({
  'event/custom': {
  requires: ['event/base']}});
  _$jscoverage['/modules.js'].lineData[155]++;
  config({
  'event/dom/base': {
  requires: ['event/base', 'dom']}});
  _$jscoverage['/modules.js'].lineData[159]++;
  config({
  'event/dom/focusin': {
  requires: ['event/dom/base']}});
  _$jscoverage['/modules.js'].lineData[163]++;
  config({
  'event/dom/hashchange': {
  requires: ['event/dom/base', 'dom']}});
  _$jscoverage['/modules.js'].lineData[167]++;
  config({
  'event/dom/ie': {
  requires: ['event/dom/base', 'dom']}});
  _$jscoverage['/modules.js'].lineData[171]++;
  config({
  'event/dom/input': {
  requires: ['event/dom/base', 'dom']}});
  _$jscoverage['/modules.js'].lineData[175]++;
  config({
  'event/gesture/base': {
  requires: ['event/dom/base', 'dom']}});
  _$jscoverage['/modules.js'].lineData[179]++;
  config({
  'event/gesture/drag': {
  requires: ['event/gesture/base', 'event/dom/base']}});
  _$jscoverage['/modules.js'].lineData[183]++;
  config({
  'event/gesture/shake': {
  requires: ['event/dom/base']}});
  _$jscoverage['/modules.js'].lineData[187]++;
  config({
  'event/gesture/touch': {
  requires: ['event/gesture/base', 'event/dom/base', 'dom']}});
  _$jscoverage['/modules.js'].lineData[191]++;
  config({
  feature: {
  requires: ['ua']}});
  _$jscoverage['/modules.js'].lineData[195]++;
  config({
  'filter-menu': {
  requires: ['menu', 'component/extension/content-xtpl', 'component/extension/content-render']}});
  _$jscoverage['/modules.js'].lineData[199]++;
  config({
  io: {
  requires: ['dom', 'event/custom', 'promise', 'event/dom']}});
  _$jscoverage['/modules.js'].lineData[203]++;
  config({
  menu: {
  requires: ['node', 'component/container', 'component/extension/delegate-children', 'component/control', 'component/extension/content-render', 'component/extension/content-xtpl', 'component/extension/align', 'component/extension/shim']}});
  _$jscoverage['/modules.js'].lineData[207]++;
  config({
  menubutton: {
  requires: ['node', 'button', 'component/extension/content-xtpl', 'component/extension/content-render', 'menu']}});
  _$jscoverage['/modules.js'].lineData[211]++;
  config({
  'navigation-view': {
  requires: ['component/container', 'component/control', 'component/extension/content-xtpl', 'component/extension/content-render']}});
  _$jscoverage['/modules.js'].lineData[215]++;
  config({
  'navigation-view/bar': {
  requires: ['component/control', 'button']}});
  _$jscoverage['/modules.js'].lineData[219]++;
  config({
  node: {
  requires: ['dom', 'event/dom', 'event/gesture', 'anim']}});
  _$jscoverage['/modules.js'].lineData[223]++;
  config({
  overlay: {
  requires: ['component/container', 'component/extension/shim', 'component/extension/align', 'node', 'component/extension/content-render']}});
  _$jscoverage['/modules.js'].lineData[227]++;
  config({
  resizable: {
  requires: ['node', 'base', 'dd']}});
  _$jscoverage['/modules.js'].lineData[231]++;
  config({
  'resizable/plugin/proxy': {
  requires: ['node', 'base']}});
  _$jscoverage['/modules.js'].lineData[235]++;
  config({
  router: {
  requires: ['event/dom', 'uri', 'event/custom']}});
  _$jscoverage['/modules.js'].lineData[238]++;
  config({
  'scroll-view': {
  alias: Feature.isTouchGestureSupported() ? 'scroll-view/touch' : 'scroll-view/base'}});
  _$jscoverage['/modules.js'].lineData[243]++;
  config({
  'scroll-view/base': {
  requires: ['node', 'anim', 'component/container', 'component/extension/content-render']}});
  _$jscoverage['/modules.js'].lineData[247]++;
  config({
  'scroll-view/plugin/pull-to-refresh': {
  requires: ['base']}});
  _$jscoverage['/modules.js'].lineData[251]++;
  config({
  'scroll-view/plugin/scrollbar': {
  requires: ['base', 'node', 'component/control', 'event/gesture/drag']}});
  _$jscoverage['/modules.js'].lineData[255]++;
  config({
  'scroll-view/touch': {
  requires: ['scroll-view/base', 'node', 'anim']}});
  _$jscoverage['/modules.js'].lineData[259]++;
  config({
  separator: {
  requires: ['component/control']}});
  _$jscoverage['/modules.js'].lineData[263]++;
  config({
  'split-button': {
  requires: ['component/container', 'button', 'menubutton']}});
  _$jscoverage['/modules.js'].lineData[267]++;
  config({
  stylesheet: {
  requires: ['dom']}});
  _$jscoverage['/modules.js'].lineData[271]++;
  config({
  swf: {
  requires: ['dom', 'json', 'attribute']}});
  _$jscoverage['/modules.js'].lineData[275]++;
  config({
  tabs: {
  requires: ['component/container', 'toolbar', 'button']}});
  _$jscoverage['/modules.js'].lineData[279]++;
  config({
  toolbar: {
  requires: ['component/container', 'component/extension/delegate-children', 'node']}});
  _$jscoverage['/modules.js'].lineData[283]++;
  config({
  tree: {
  requires: ['node', 'component/container', 'component/extension/content-xtpl', 'component/extension/content-render', 'component/extension/delegate-children']}});
  _$jscoverage['/modules.js'].lineData[287]++;
  config({
  uri: {
  requires: ['path']}});
  _$jscoverage['/modules.js'].lineData[291]++;
  config({
  xtemplate: {
  requires: ['xtemplate/runtime', 'xtemplate/compiler']}});
  _$jscoverage['/modules.js'].lineData[295]++;
  config({
  'xtemplate/compiler': {
  requires: ['xtemplate/runtime']}});
  _$jscoverage['/modules.js'].lineData[299]++;
  config({
  'xtemplate/runtime': {
  requires: ['path']}});
})(function(c) {
  _$jscoverage['/modules.js'].functionData[1]++;
  _$jscoverage['/modules.js'].lineData[304]++;
  KISSY.config('modules', c);
}, KISSY.Feature, KISSY.UA);
