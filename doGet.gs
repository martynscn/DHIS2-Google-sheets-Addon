function doGet(e) {
//  return HtmlService.createTemplateFromFile("page").evaluate();
  var t = HtmlService.createTemplateFromFile('page');
  
  // Steps
  // 1. Auto extract Org units, periods, data elements, indicators, other data dimensions from DHIS2
  // 2. Store those extracted data in the sheet called Data_dimensions
  // 3. We set a trigger to update the sheet Data_dimensions on a daily basis
  // 4. We retrieve the different dimensions we need and store in a variable such as t.org_units, t.periods, t.dx, t.ind, t.etc
  t.state = ["niger","kano"];
//  t.state = [["niger"],["kano"]];
  return t.evaluate();
//  return HtmlService.createTemplate("<h1>DHIS2 to Google Sheets Web App</h1>").evaluate();
}


function userClicked(name) {
  Logger.log(name + ' clicked the Button');
}


function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}