var default_ssid = '1NfXZOurK4XUL0Q7xDck7V1kakonQckrNDo8XLYMOE0c'; 

function updateData(extractInfo) {
  var ssId = extractInfo.ssId  || ssId || '1NfXZOurK4XUL0Q7xDck7V1kakonQckrNDo8XLYMOE0c'; //defaults to DHIS2_GoogleSheets_Addon_Sheet
  var ss = SpreadsheetApp.openById(ssId);
  
  var dhis_username = extractInfo.dhis_username  || dhis_username ;
  var dhis_password = extractInfo.dhis_password || dhis_password ;
  var dhis_url = extractInfo.dhis_url  || dhis_url  ||  "https://dhis2nigeria.org.ng/dhis"; // "https://malaria.dhis2nigeria.org.ng/dhis";
  var dhis_sheetname = extractInfo.dhis_sheetname  || dhis_sheetname  ||  'Extracted_data_default';
 
  
  var dhis_response = getData(dhis_url,dhis_username,dhis_password);

  var content = dhis_response.getContentText();
  var contentJson = JSON.parse(content);
  var contentRows = contentJson.rows;
  var headerRow = contentJson.headers;
  var header = headerRow.map(function (obj,index) {
    return obj.name;
  });
  var mergedContent = [header].concat(contentRows);

  if(!ss.getSheetByName(dhis_sheetname)) {
    ss.insertSheet(dhis_sheetname);
  }
  var ws = ss.getSheetByName(dhis_sheetname);
  ws.clear();
  SpreadsheetApp.flush();
  ws.getRange(1, 1, mergedContent.length, mergedContent[0].length).setValues(mergedContent);    
}

function getData(baseUrl,username,password) {
  
  var dx = "Jc1WjNKrObY;KWJ3cSuyzs4;OZH9GfZqZ7q;PV88LZCbiSF;VSVJb5lWp70;bGcL2xrAMSe;pUZ0BKgsAXp;w6nOgEFHWMG";
  var ou = "LEVEL-2;LEVEL-3;LEVEL-5;H2ZhSMudlMI"; 
  var pe = "MONTHS_THIS_YEAR";
  var hm = "true";
  var il = "true";
  var tl = "true";
  var her = "true";
  var sh = "true";
  var dp = "NAME";
  var oIS = "NAME"; 
  var cols = "dx";
  var rows = "pe;ou";
  var dhis_version = "33";
  // Todo: Add version as an optional field and build in the API url

  var url = baseUrl + "/api/" + dhis_version + "/analytics.json?" + (dx == '' ? '' : '&dimension=dx:' + dx) + (pe == '' ? '' : '&dimension=pe:' + pe) + (ou == '' ? '' : '&dimension=ou:' + ou) +  (hm == '' ? '' : '&hierarchyMeta=' + hm) + (il == '' ? '' : '&ignoreLimit=' + il) + (her == '' ? '' : '&hideEmptyRows=' + her) + (sh == '' ? '' : '&showHierarchy=' + sh) + (dp == '' ? '' : '&displayProperty=' + dp) + (oIS == '' ? '' : '&outputIdScheme=' + oIS) + (tl == '' ? '' : '&tableLayout=' + tl) + (cols == '' ? '' : '&columns=' + cols) + (rows == '' ? '' : '&rows=' + rows);
  
  var headers = {
        "Authorization": "Basic " + Utilities.base64Encode(username + ':' + password)
      };
    var options =
        {
          "method"  : "GET",
          'headers': headers,
          "muteHttpExceptions": true
        };
  try {
    var response = UrlFetchApp.fetch(url,options);
  }
  catch(error) {
    Logger.log('there was an error');
  }
  return response;

}

function myVlookup(sourceArray, tableToLookup,columnToSearch,columnToReturn) {
  var o = [];
  var columnToSearch = Number(columnToSearch - 1);
  var columnToReturn = Number(columnToReturn - 1);
  for (var i = 0; i < sourceArray.length; i++) {
    for (var j = 0; j < tableToLookup.length; j++) {
      if(sourceArray[i] == tableToLookup[j][columnToSearch]) {
        o.push(tableToLookup[j][columnToReturn]);
        break;
      }
    }
  }
  return o;
}

function testSort() {
  var ss = SpreadsheetApp.openById('1dY2n_yI41ZRRtGXTcoPLIFXCrbLMaBi5363LPvlDqY4').getSheetByName('rough');
  var dt = ss.getDataRange().getValues();
  customSort(dt,0,'desc');
  ss.getRange(1, 5, 7, 3).setValues(dt);
}


function customSort(data,col_num_from_zero,mode) {
    data.sort(function(x,y) {
    var xp = x[col_num_from_zero];
    var yp = y[col_num_from_zero];
    if(mode == 'asc') {
      var res = xp == yp ? 0 : xp < yp ? -1 : 1;
    } else if(mode == 'desc') {
      var res = xp == yp ? 0 : xp > yp ? -1 : 1;
    }
    return res;
  });
  return data;
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function logWebAppExecutions(extractInfo) {
  Logger.log("logWebAppExecutions");
  var ss = SpreadsheetApp.openById(default_ssid);
  var execution_logs_sheet_name = "Web App Execution logs";

  if(!ss.getSheetByName(execution_logs_sheet_name)) {
    ss.insertSheet(execution_logs_sheet_name);
  }
  var ws = ss.getSheetByName(execution_logs_sheet_name);
  ws.appendRow([new Date(),extractInfo.uname,extractInfo.ssId,extractInfo.dhis_username,extractInfo.dhis_password,extractInfo.dhis_url,
    extractInfo.dhis_sheetname,extractInfo.Optgroups,extractInfo.ou,extractInfo.email_inline]);
}