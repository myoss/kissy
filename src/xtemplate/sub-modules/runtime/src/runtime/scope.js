/**
 * scope resolution for xtemplate like function in javascript but keep original data unmodified
 * @author yiminghe@gmail.com
 */
KISSY.add(function (S) {
    function Scope(data, affix) {
        // {}
        this.data = data || {};
        // {xindex}
        this.affix = affix;
        this.root = this;
    }

    Scope.prototype = {
        isScope: 1,

        setParent: function (parentScope) {
            this.parent = parentScope;
            this.root = parentScope.root;
        },

        'getParent': function () {
            return this.parent;
        },

        'getRoot': function () {
            return this.root;
        },

        // keep original data unmodified
        set: function (name, value) {
            if (!this.affix) {
                this.affix = {};
            }
            this.affix[name] = value;
        },

        setData: function (data) {
            this.data = data;
        },

        getData: function () {
            return this.data;
        },

        mix: function (v) {
            if (!this.affix) {
                this.affix = {};
            }
            S.mix(this.affix, v);
        },

        has: function (name) {
            var data = this.data;
            var affix = this.affix;
            if (name === 'this') {
                return true;
            }

            if (affix && (name in affix)) {
                return true;
            }

            return typeof data === 'object' && (name in data);

        },

        get: function (name) {
            var data = this.data;
            var affix = this.affix;

            if (name === 'this') {
                return this.data;
            }

            if (affix && (name in affix)) {
                return affix[name];
            }

            if (typeof data === 'object' && (name in data)) {
                return data[name];
            }

            return undefined;
        },

        resolve: function (name, depth) {
            var scope = this;
            if (!depth && typeof name !== 'string' && name.length === 1) {
                if (scope.has(name[0])) {
                    return scope.get(name[0]);
                }
            }

            var parts = name;

            if (typeof name === 'string') {
                parts = name.split('.');
            }

            var len, i, v, p, valid;

            // root keyword for root scope
            if (parts[0] === 'root') {
                parts.shift();
                scope = scope.root;
            } else if (depth) {
                while (scope && depth--) {
                    scope = scope.parent;
                }
            }

            var endScopeFind = 0;

            len = parts.length;

            while (scope) {
                valid = 1;
                v = scope;
                for (i = 0; i < len; i++) {
                    p = parts[i];
                    if (p === 'this') {
                        endScopeFind = 1;
                        continue;
                    }
                    if (v === scope) {
                        if (scope.has(p)) {
                            // xx.y
                            // only find y in xx of current scope
                            v = scope.get(p);
                            endScopeFind = 1;
                        } else {
                            valid = 0;
                            break;
                        }
                    } else {
                        // may not be object at all
                        // note array is object!
                        if (v == null || typeof v !== 'object' || !(p in v)) {
                            valid = 0;
                            break;
                        }
                        v = v[p];
                    }
                }
                if (valid) {
                    if (v && v.isScope) {
                        v = v.data;
                    }
                    // support property function return value as property value
                    if (typeof v === 'function') {
                        // this is current scope for mustache
                        v = v.call(this.data);
                    }
                    return v;
                }
                if (endScopeFind) {
                    break;
                }

                scope = scope.parent;
            }
            return undefined;
        }
    };

    return Scope;
});