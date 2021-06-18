(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['pear'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<article class=\"pear\">\r\n\r\n    <a class=\"pear-image-container\" href=\"/pears/"
    + alias4(((helper = (helper = helpers.PID || (depth0 != null ? depth0.PID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"PID","hash":{},"data":data,"loc":{"start":{"line":3,"column":49},"end":{"line":3,"column":56}}}) : helper)))
    + "\">\r\n        <img class=\"pear-image\" src=\""
    + alias4(((helper = (helper = helpers.Image || (depth0 != null ? depth0.Image : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Image","hash":{},"data":data,"loc":{"start":{"line":4,"column":37},"end":{"line":4,"column":46}}}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = helpers.Description || (depth0 != null ? depth0.Description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Description","hash":{},"data":data,"loc":{"start":{"line":4,"column":55},"end":{"line":4,"column":70}}}) : helper)))
    + "\">\r\n    </a>\r\n    <div class=\"pear-content\">\r\n        <p class=\"pear-title\">\r\n            "
    + alias4(((helper = (helper = helpers.Title || (depth0 != null ? depth0.Title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Title","hash":{},"data":data,"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":21}}}) : helper)))
    + "\r\n        </p>\r\n        <p class=\"pear-poster\">\r\n            <a href=\"/users/"
    + alias4(((helper = (helper = helpers.Username || (depth0 != null ? depth0.Username : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Username","hash":{},"data":data,"loc":{"start":{"line":11,"column":28},"end":{"line":11,"column":40}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.Username || (depth0 != null ? depth0.Username : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Username","hash":{},"data":data,"loc":{"start":{"line":11,"column":42},"end":{"line":11,"column":54}}}) : helper)))
    + "</a>\r\n        </p>\r\n        <p class=\"pear-rating\">\r\n            "
    + alias4(((helper = (helper = helpers.Average || (depth0 != null ? depth0.Average : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Average","hash":{},"data":data,"loc":{"start":{"line":14,"column":12},"end":{"line":14,"column":23}}}) : helper)))
    + "\r\n        </p>\r\n    </div>\r\n\r\n</article>\r\n";
},"useData":true});
})();