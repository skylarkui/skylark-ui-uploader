/**
 * skylark-widgets-filer - The skylark filer  widget library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-filer/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-data-collection/ArrayList","./domx/uploader","skylark-domx-query","skylark-widgets-base/Widget","./filer"],function(e,s,t,i,o,n){function r(e){if(0==e)return"0 B";var s=parseInt(Math.floor(Math.log(e)/Math.log(1024)));return(e/Math.pow(1024,s)).toFixed(2)+" "+["B","KB","MB","GB","TB"][s]}function l(e){return new Date(e).toLocaleString()}var a=e.Stateful.inherit({state:"pending",start:function(){this.isPending()&&(this.get("processor").submit(),this.state="running",this.trigger("filestarted",this))},cancel:function(){this.get("processor").abort(),this.destroy(),this.state="canceled",this.trigger("filecanceled",this)},progress:function(e){this.trigger("fileprogress",this.get("processor").progress())},fail:function(e){this.state="error",this.trigger("filefailed",e)},done:function(e){this.state="error",this.trigger("filedone",e)},isPending:function(){return"pending"==this.getState()},isRunning:function(){return"running"==this.getState()},isDone:function(){return"done"==this.getState()},isError:function(){return"error"==this.getState()||"canceled"==this.getState},getState:function(){return this.state}}),d=s.inherit({item:a}),c=o.inherit({className:"upload-manager-file row",options:{selectors:{fileName:".name",fileSize:".size",cancel:".cancel",clear:".clear",progress:".progress",message:".message"}},state:{fileName:String,fileSize:Number},_init:function(){this.processUploadMsg=this.options.processUploadMsg,this.doneMsg=this.options.doneMsg,this.model=this.options.model,this.fileName(this.options.fileName),this.fileSize(this.options.fileSize),this.model.on("destroy",this.close,this),this.model.on("fileprogress",this.updateProgress,this),this.model.on("filefailed",this.hasFailed,this),this.model.on("filedone",this.hasDone,this),this.model.on("all",this.update,this),this.update()},_refresh:function(e){},updateProgress:function(e){var s=parseInt(e.loaded/e.total*100,10),t=r(e.loaded)+" of "+r(e.total);s>=100&&this.processUploadMsg&&(t=this.processUploadMsg),this._velm.$(".progress").find(".bar").css("width",s+"%").parent().find(".progress-label").html(t)},hasFailed:function(e){this._velm.$(".message").html('<i class="icon-error"></i> '+e)},hasDone:function(e){this._velm.$(".message").html('<i class="icon-success"></i> '+(this.doneMsg||"Uploaded"))},update:function(){var e=this.options.selectors,s=this._velm.$(e.size+","+e.cancel),t=this._velm.$(e.progress+","+e.cancel),i=this._velm.$(e.message+","+e.clear);this.model.isPending()?(t.add(i).addClass("hidden"),s.removeClass("hidden")):this.model.isRunning()?(s.add(i).addClass("hidden"),t.removeClass("hidden")):(this.model.isDone()||this.model.isError())&&(s.add(t).addClass("hidden"),i.removeClass("hidden"))},_startup:function(){var e=this;this._velm.$(this.options.selectors.cancel).click(function(){e.model.cancel(),e.collection.remove(e.model)}),this._velm.$(this.options.selectors.clear).click(function(){e.model.destroy(),e.collection.remove(e.model)})},computeData:function(){return i.extend({displaySize:r,displayDate:l},this.model.get("data"))}}),h=o.inherit({klassName:"Uploader",pluginName:"lark.uploader",options:{uploadUrl:"/upload",autoUpload:!1,selectors:{fileList:".file-list",nodata:".file-list .no-data",pickFiles:".file-picker",startUploads:".start-uploads",cancelUploads:".cancel-uploads"},dataType:"json",fileItem:{selectors:{},template:null}},state:{},_init:function(){this._files=new d;var s=this._velm.$(this.options.selectors.pickFiles),i=this;this.uploadProcess=t(this._elm,{dataType:this.options.dataType,url:this.options.uploadUrl,formData:this.options.formData,autoUpload:this.options.autoUpload,singleFileUploads:!0,picker:s,add:function(s,t){t.uploadManagerFiles=[],e.each(t.files,function(e,s){s.id=i.file_id++;var o=new a({data:s,processor:t});t.uploadManagerFiles.push(o),i._files.add(o),i.renderFile(o)})},progress:function(s,t){e.each(t.uploadManagerFiles,function(e,s){s.progress(t)})},fail:function(s,t){e.each(t.uploadManagerFiles,function(e,s){var i="Unknown error";"string"==typeof t.errorThrown?i=t.errorThrown:"object"==typeof t.errorThrown?i=t.errorThrown.message:t.result&&(i=t.result.error?t.result.error:t.result.files&&t.result.files[e]&&t.result.files[e].error?t.result.files[e].error:"Unknown remote error"),s.fail(i)})},done:function(s,t){e.each(t.uploadManagerFiles,function(e,s){s.done(t.result)})}}),this.bindProcessEvents(),this._velm.$(this.options.selectors.cancelUploads).click(function(){for(;i._files.length;)i._files.at(0).cancel()}),this._velm.$(this.options.selectors.startUploads).click(function(){i._files.forEach(function(e){e.start()})}),this._refresh({files:!0}),this._files.on("all",function(){i._refresh({files:!0})})},_refresh:function(e){var s,t,i,o,n=this;e.files&&(s=n.options.selectors,t=n._files,i=n._velm.$(s.cancelUploads+","+s.startUploads),o=n._velm.$(s.nodata),t.count()>0?(i.removeClass("hidden"),o.addClass("hidden")):(i.addClass("hidden"),o.removeClass("hidden")))},renderFile:function(s){var t=new c(i(e.template(this.options.fileItem.template,s.get("data")))[0],{model:s,template:this.options.fileItem.template});t.render(),t.attach(this._velm.$(this.options.selectors.fileList)[0])},bindProcessEvents:function(){}});return n.Uploader=h});
//# sourceMappingURL=sourcemaps/Uploader.js.map
