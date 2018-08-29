var get = {
    byId: function(id) {
        return typeof(id) == "string" ? document.getElementById(id) : id;
    },
    byTag: function(tagName, oParent) {
        return (oParent || window).getElementsByTagName(tagName);
    },
    byClass: function(cName, oParent) {
        var rClass = [];
        var reg1 = RegExp("( |)" + cName + "( |)");
        var nClass = this.byTag("*", oParent);
        for (var i = 0; i < nClass.length; i++) {
            if (reg1.test(nClass[i].className)) {
                rClass.push(nClass[i]);
            }
        }
        return rClass;
    }
}

var AutoPlay = function(id) { this.initialize(id) };
// 原型
AutoPlay.prototype = {
    initialize: function(id) {
        var oThis = this;
        this.bOrder = true;
        this.num = 0;
        this.oBox = get.byId(id);
        this.oSpan = get.byTag("span", this.oBox);
        this.oUl = get.byTag("ul", this.oBox)[0];
        this.oLi = get.byTag("li", this.oBox);
        // 动态设置ul宽度
        this.oUl.style.width = this.oLi[0].offsetWidth * this.oLi.length + "px";
        // 自执行一次
        this.next();
        clearInterval(this.timer);
        this.timer = setInterval(function() {
            oThis.next();
        }, 2000);
        this.oBox.onmouseover = function() {
            clearInterval(oThis.timer);
        };
        this.oBox.onmouseout = function() {
            oThis.timer = setInterval(function() {
                oThis.next();
            }, 2000)
        };
        for (var j = 0; j < this.oSpan.length; j++) {
            this.oSpan[j].index = j;
            this.oSpan[j].onmouseover = function() {
                oThis.num = this.index;
                oThis.next();
            };
        }
    },
    next: function() {
        if (this.num >= this.oLi.length - 1) {
            this.num = this.oLi.length - 1;
            this.bOrder = false;
        }
        if (this.num <= 0) {
            this.num = 0;
            this.bOrder = true;
        }
        for (var i = 0; i < this.oSpan.length; i++) {
            this.oSpan[i].className = "";
        }
        this.oSpan[this.num].className = "inner";
        this.doMove(-(this.num * this.oLi[0].offsetWidth));
        this.bOrder ? this.num++ : this.num--;
    },
    doMove: function(iTarget) {
        var oThis = this;
        clearInterval(this.newTimer);
        this.newTimer = setInterval(function() {
            var iLeft = oThis.oUl.offsetLeft;
            var iSpeed = (iTarget - iLeft) / 5;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (iLeft == iTarget) {
                clearInterval(oThis.newTimer);
            }
            oThis.oUl.style.left = iLeft + iSpeed + "px";
        }, 30)
    }

};

new AutoPlay("box");