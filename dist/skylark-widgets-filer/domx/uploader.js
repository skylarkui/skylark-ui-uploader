/**
 * skylark-widgets-filer - The skylark filer  widget library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-filer/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-eventer","skylark-domx-query","skylark-domx-files/dropzone","skylark-domx-files/pastezone","skylark-domx-files/picker","./upload"],function(e,t,i,s,r,o,n){"use strict";var a=e.Deferred,l=e.Evented.inherit({options:{dropZone:i(document),pasteZone:i(document),picker:void 0,paramName:void 0,singleFileUploads:!0,limitMultiFileUploads:void 0,limitMultiFileUploadSize:void 0,limitMultiFileUploadSizeOverhead:512,sequentialUploads:!1,limitConcurrentUploads:void 0,postMessage:void 0,multipart:!0,maxChunkSize:void 0,uploadedBytes:void 0,recalculateProgress:!0,progressInterval:100,bitrateInterval:500,autoUpload:!1,messages:{uploadedBytes:"Uploaded bytes exceed file size"},i18n:function(t,i){return t=this.messages[t]||t.toString(),i&&e.each(i,function(e,i){t=t.replace("{"+e+"}",i)}),t},formData:function(e){return e.serializeArray()},add:function(e,t){if(e.isDefaultPrevented())return!1;(t.autoUpload||!1!==t.autoUpload&&i(this).fileupload("instance").option("autoUpload"))&&t.process().done(function(){t.submit()})},processData:!1,contentType:!1,cache:!1},_specialOptions:["picker","dropZone","pasteZone","multipart","filesContainer","uploadTemplateId","downloadTemplateId"],_BitrateTimer:function(){this.timestamp=Date.now?Date.now():(new Date).getTime(),this.loaded=0,this.bitrate=0,this.getBitrate=function(e,t,i){var s=e-this.timestamp;return(!this.bitrate||!i||s>i)&&(this.bitrate=(t-this.loaded)*(1e3/s)*8,this.loaded=t,this.timestamp=e),this.bitrate}},_getTotal:function(t){var i=0;return e.each(t,function(e,t){i+=t.size||1}),i},_initProgressObject:function(t){var i={loaded:0,total:0,bitrate:0};t._progress?e.extend(t._progress,i):t._progress=i},_initResponseObject:function(e){var t;if(e._response)for(t in e._response)e._response.hasOwnProperty(t)&&delete e._response[t];else e._response={}},_onProgress:function(e,i){if(e.lengthComputable){var s,r=Date.now?Date.now():(new Date).getTime();if(i._time&&i.progressInterval&&r-i._time<i.progressInterval&&e.loaded!==e.total)return;i._time=r,s=Math.floor(e.loaded/e.total*(i.chunkSize||i._progress.total))+(i.uploadedBytes||0),this._progress.loaded+=s-i._progress.loaded,this._progress.bitrate=this._bitrateTimer.getBitrate(r,this._progress.loaded,i.bitrateInterval),i._progress.loaded=i.loaded=s,i._progress.bitrate=i.bitrate=i._bitrateTimer.getBitrate(r,s,i.bitrateInterval),this._trigger("progress",t.create("progress",{delegatedEvent:e}),i),this._trigger("progressall",t.create("progressall",{delegatedEvent:e}),this._progress)}},_getParamName:function(t){i(t.picker);var s=t.paramName;return e.isArray(s)||(s=[s]),s},_getDeferredState:function(e){return e.state?e.state():e.isResolved()?"resolved":e.isRejected()?"rejected":"pending"},_enhancePromise:function(e){return e.success=e.done,e.error=e.fail,e.complete=e.always,e},_getXHRPromise:function(e,t,i){var s=new a,r=s.promise;return t=t||this.options.context||r,!0===e?s.resolveWith(t,i):!1===e&&s.rejectWith(t,i),r.abort=s.promise,this._enhancePromise(r)},_addConvenienceMethods:function(e,i){var s=this,r=function(e){return(new a).resolveWith(s,e).promise};i.process=function(e,t){return(e||t)&&(i._processQueue=this._processQueue=(this._processQueue||r([this])).pipe(function(){return i.errorThrown?(new a).rejectWith(s,[i]).promise:r(arguments)}).pipe(e,t)),this._processQueue||r([this])},i.submit=function(){return"pending"!==this.state()&&(i.jqXHR=this.jqXHR=!1!==s._trigger("submit",t.create("submit",{delegatedEvent:e}),this)&&s._onSend(e,this)),this.jqXHR||s._getXHRPromise()},i.abort=function(){return this.jqXHR?this.jqXHR.abort():(this.errorThrown="abort",s._trigger("fail",null,this),s._getXHRPromise(!1))},i.state=function(){return this.jqXHR?s._getDeferredState(this.jqXHR):this._processQueue?s._getDeferredState(this._processQueue):void 0},i.processing=function(){return!this.jqXHR&&this._processQueue&&"pending"===s._getDeferredState(this._processQueue)},i.progress=function(){return this._progress},i.response=function(){return this._response}},_beforeSend:function(e,t){0===this._active&&(this._trigger("start"),this._bitrateTimer=new this._BitrateTimer,this._progress.loaded=this._progress.total=0,this._progress.bitrate=0),this._initResponseObject(t),this._initProgressObject(t),t._progress.loaded=t.loaded=t.uploadedBytes||0,t._progress.total=t.total=this._getTotal(t.files)||1,t._progress.bitrate=t.bitrate=0,this._active+=1,this._progress.loaded+=t.loaded,this._progress.total+=t.total},_onDone:function(e,i,s,r){var o=r._progress.total,n=r._response;r._progress.loaded<o&&this._onProgress(t.create("progress",{lengthComputable:!0,loaded:o,total:o}),r),n.result=r.result=e,n.textStatus=r.textStatus=i,n.jqXHR=r.jqXHR=s,this._trigger("done",null,r)},_onFail:function(e,t,i,s){var r=s._response;s.recalculateProgress&&(this._progress.loaded-=s._progress.loaded,this._progress.total-=s._progress.total),r.jqXHR=s.jqXHR=e,r.textStatus=s.textStatus=t,r.errorThrown=s.errorThrown=i,this._trigger("fail",null,s)},_trigger:function(e,i,s){var r=t.proxy(i);return r.type=e,r.data=s,this.trigger(r,s)},_onAlways:function(e,t,i,s){this._trigger("always",null,s)},_onSend:function(e,t){t.submit||this._addConvenienceMethods(e,t);var i,s=this;return this._beforeSend(e,t),s._sending+=1,t.url=s.options.url,t.dataType=s.options.dataType,t.xhrFields=s.options.xhrFields,(i=n(t)).progress(function(e){s._onProgress(e,i.options)}).done(function(e,t){s._onDone(e,t,i,i.options)}).fail(function(e,t){s._onFail(i,t,e,i.options)}).always(function(){s._sending-=1,s._active-=1,s._trigger("stop")}),i},_onAdd:function(i,s){var r,o,n,a,l=this,p=!0,d=e.extend({},this.options,s),u=s.files,c=u.length,h=d.limitMultiFileUploads,_=d.limitMultiFileUploadSize,g=d.limitMultiFileUploadSizeOverhead,f=0,m=this._getParamName(d),v=0;if(!_||c&&void 0!==u[0].size||(_=void 0),d.singleFileUploads||h||_)if(d.singleFileUploads||_||!h)if(!d.singleFileUploads&&_)for(n=[],r=[],a=0;a<c;a+=1)f+=u[a].size+g,(a+1===c||f+u[a+1].size+g>_||h&&a+1-v>=h)&&(n.push(u.slice(v,a+1)),(o=m.slice(v,a+1)).length||(o=m),r.push(o),v=a+1,f=0);else r=m;else for(n=[],r=[],a=0;a<c;a+=h)n.push(u.slice(a,a+h)),(o=m.slice(a,a+h)).length||(o=m),r.push(o);else n=[u],r=[m];return s.originalFiles=u,e.each(n||u,function(o,a){var d=e.extend({},s);return d.files=n?a:[a],d.paramName=r[o],l._initResponseObject(d),l._initProgressObject(d),l._addConvenienceMethods(i,d),p=l._trigger("add",t.create("add",{delegatedEvent:i}),d)}),p},_initEventHandlers:function(){var e=this;s(this.options.dropZone[0],{dropped:function(t){var i={};i.files=t,e._onAdd(null,i)}}),r(this.options.pasteZone[0],{pasted:function(t){var i={};i.files=t,e._onAdd(null,i)}}),o(this.options.picker[0],{multiple:!0,picked:function(t){var i={};i.files=t,e._onAdd(null,i)}})},_destroyEventHandlers:function(){},_setOption:function(t,i){var s=-1!==e.inArray(t,this._specialOptions);s&&this._destroyEventHandlers(),this._super(t,i),s&&(this._initSpecialOptions(),this._initEventHandlers())},_initSpecialOptions:function(){var e=this.options;e.picker&&(e.picker instanceof i||(e.picker=i(e.picker,this._elm))),e.dropZone&&(e.dropZone instanceof i||(e.dropZone=i(e.dropZone,this._elm))),e.pasteZone&&(e.pasteZone instanceof i||(e.pasteZone=i(e.pasteZone,this._elm)))},_getRegExp:function(e){var t=e.split("/"),i=t.pop();return t.shift(),new RegExp(t.join("/"),i)},_isRegExpOption:function(t,i){return"url"!==t&&"string"===e.type(i)&&/^\/.*\/[igm]{0,3}$/.test(i)},_construct:function(t,i){this._elm=t,this.options=e.mixin({},this.options,i),this._initSpecialOptions(),this._slots=[],this._sequence=this._getXHRPromise(!0),this._sending=this._active=0,this._initProgressObject(this),this._initEventHandlers()},active:function(){return this._active},progress:function(){return this._progress},add:function(t){t&&!this.options.disabled&&(t.files=e.makeArray(t.files),this._onAdd(null,t))},send:function(t){return t&&!this.options.disabled&&(t.files=e.makeArray(t.files),t.files.length)?this._onSend(null,t):this._getXHRPromise(!1,t&&t.context)}});return function(t,i){var s=new l(t,i);return s.on("all",function(t,r){var o=t.type;e.isFunction(i[o])&&i[o].call(s._elm,t,r)}),s}});
//# sourceMappingURL=../sourcemaps/domx/uploader.js.map
