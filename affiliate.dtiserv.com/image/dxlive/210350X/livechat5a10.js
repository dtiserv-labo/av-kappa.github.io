//5ptplus_point
var afflivebanner = {
  that: this,
  coupon: {
    // code: {
    // 3: '2WZUUXUK',
    // 4: '2WF67G96'
    // },
    url: 'https://click.dtiserv2.com/cpromo/',
    imgname: 'coupon',
    bannerids: {
      w770: '12103500',
      w300: '12103501'
    }
  },
  clickurl: 'https://click.dtiserv2.com/Click2/',
  ids: {
    name: 'setAfflivechat',
    site: '103',
    msite: '491',
    bdiv: 'afflivechatban'
  },
  banners: {
    url: 'https://affiliate.dtiserv.com/image/dxlive/210350X/',
    ids: {
      '770x76': '2103501',
      '300x250': '2103502',
      '300x100': '2103503'
    }
  },
  scripts: new Object(),
  script: Array(),
  scriptId: [],


  getUseragent: function() {
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
      return this.ids.msite;
    }else{
      return this.ids.site;
    }
  },

  getCouponArray: function(wWidth, affid) {
    var siteid = this.getUseragent();
    var month = new Date().getMonth() + 1;
    var code =  dxcoupon[month].all.point_code;
    var cUrl = this.coupon.url + this.coupon.bannerids[wWidth] + '-' + siteid + '-' + affid + '/' + code;
    //var cBan = '<img style="display:block;" src="' + this.banners.url + this.coupon.imgname + '_' + wWidth + '_' + month + '.png">';
    var cBan = '<img style="display:block;" src="' + this.banners.url + this.coupon.imgname + '_' + wWidth + '.png">';
    var array = {};
    array.url = cUrl;
    array.ban = cBan;
    return array;
  },
  getCouponScript: function(callback) {
    var done = false;
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = 'https://www.mmaaxx.com/table/dx/9103063/dxcoupon.js';
    head.appendChild(script);
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
      if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
        done = true;
        callback()
        // Handle memory leak in IE
        script.onload = script.onreadystatechange = null;
        if ( head && script.parentNode ) {
            head.removeChild( script );
        }
        return true
      }
    }
  },
  getAffiscript: function() {
    this.scripts = document.getElementsByTagName('script');
    var numScript = this.scripts.length;
    var checkName = new RegExp(this.ids.name);
    for (i = 0; i < numScript; i++) {
      if (this.scripts[i].id.match(checkName) || this.scripts[i].className.match(checkName)) {
        this.script.push(this.scripts[i]);
        this.scriptId.push(this.scripts[i].id);
      }
    }
    return this.script;
  },
  getValuse: function(i) {
    var result = new Object();
    if (this.script[i].id.match(this.scriptId[i])) {
      var query = this.script[i].src.substring(this.script[i].src.indexOf('?') + 1);
      var params = query.split('&');
      var numParam = params.length;
      for (var i = 0; i < numParam; i++) {
        var element = params[i].split('=');
        var paramName = decodeURIComponent(element[0]);
        var paramValue = decodeURIComponent(element[1]);
        result[paramName] = decodeURIComponent(paramValue);
      }
    }
    return result;
  },

  setContent: function(o) {
    var bSize = o.size,
      bWidth      = bSize.split('x')[0],
      wWidth      = 'w' + bWidth,
      bParamArray = bSize.split('-'),
      bSize       = bParamArray[0],
      bFilename   = bParamArray[1],
      bMedia      = '',
      htmlCode    = '',
      bMediaUrl   = this.banners.url + bSize + '/' + bFilename,
      bFormat     = bFilename.split('.');

    var divid = this.ids.bdiv + bSize + '-' + bFormat[0];
    if(document.getElementById(divid) != undefined){
      return false;
    }
    var siteid    = this.getUseragent();
    var aLink     = this.clickurl + this.banners.ids[bSize] + '-' + siteid + '-' + o.affid;
    var target_id = this.ids.name + bSize + '-' + bFormat[0];
    var targetScript = document.getElementById(target_id);
    if(targetScript == null){
      targetScript = document.getElementsByClassName(target_id)[0];
    }
    var div          = document.createElement('div');
    div.id           = divid;
    var style        = 'style="display:block; max-width:'+ bWidth +'"'
    var coupon_array = this.getCouponArray(wWidth, o.affid);
    if (bFormat[1] == 'gif') {
      bMedia = '<img ' + style + ' src="' + bMediaUrl + '">'
    } else {
      bMedia = '<video ' + style + ' src="' + bMediaUrl + '" autoplay muted loop></video>';
    }
    switch (o.c) {
      case 'downb':
        htmlCode = '<a target="_blank" href="' + coupon_array.url + '">' + bMedia + coupon_array.ban + '</a>';
        break;
      case 'upb':
        htmlCode = '<a target="_blank" href="' + coupon_array.url + '">' + coupon_array.ban + bMedia + '</a>';
        break;
      default:
        htmlCode = '<a target="_blank" href="' + aLink + '">' + bMedia + '</a>';
    }
    div.innerHTML = htmlCode;
    targetScript.parentNode.insertBefore(div, targetScript.nextSibling);
  }
};

window.addEventListener('load', function(){
  afflivebanner.getCouponScript(function(){
    var affbansrc = afflivebanner.getAffiscript();
    var numAffban = affbansrc.length;
    for (i = 0; i < numAffban; i++) {
      var affbansrcObjValue = afflivebanner.getValuse(i);
      afflivebanner.setContent(affbansrcObjValue);
    }
  })
}, false);
