  function doGet() {
    return HtmlService.createTemplateFromFile('index.html')
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  function getDataSortDate() {
    return SpreadsheetApp
      .openById('1-HmBSO0ViOWjC4ttaAxOZ1sygnfWmKvMJBswBRyouQA')
      .getSheetByName('Form Responses 1')
      .getRange('A11:J')
      .sort(7)
      .getValues();
  }
  function getDataSortName() {
    return SpreadsheetApp
      .openById('1-HmBSO0ViOWjC4ttaAxOZ1sygnfWmKvMJBswBRyouQA')
      .getSheetByName('Form Responses 1')
      .getRange('A11:J')
      .sort(3)
      .getValues();
  }
  function getTotalSlots() {
    return SpreadsheetApp
      .openById('1-HmBSO0ViOWjC4ttaAxOZ1sygnfWmKvMJBswBRyouQA')
      .getSheetByName('Form Responses 1')
      .getRange(4, 2, 4, 23)
      .getValues();
  }
  function detectCrew(now) {
    var first = new Date(now.getFullYear(), 0, 1);
    var weekNo = Math.ceil( (((now - first) / 86400000) + first.getDay() + 1) / 7 );
    if (weekNo % 2 == 0) {
      return "A_C";
    } else {
      return "B_D";
    }
  }
  function makeClassName(i, j, a_c, b_d, order, num_a, num_b, num_c, num_d) {
    var className = "";
    var num = 0;
    if (a_c.indexOf(j) > -1) {
      if (order == "first") {
        num = num_a;
      } else {
        num = num_c;
      }
    } else if (b_d.indexOf(j) > -1) {
      if (order == "first") {
        num = num_b;
      } else {
        num = num_d;
      }
    }
    if (i != 0 && i == num - 1) {
        className = "bottom";
    } else if (i != 0 && i < num - 1) {
        className = "medium";
    } else if (i == 0 && i == num - 1) {
        className = "full";
    } else if (i == 0 && i < num - 1) {
        className = "top";
    }
    Logger.log(className)
    return className
  }
  function firstOfWeek(diff) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var monday = new Date(today.setDate(today.getDate()-today.getDay() + diff));
    return monday;
  }
  
  function getWeek(diff) {
    var curr = new Date();
    var first = curr.getDate() - curr.getDay() + diff;
    var week = [];
    for (var i = 0; i < 7; i++) {
      var next = new Date(curr.getTime());
      next.setDate(first + i);
      next.setHours(0,0,0,0);
      week.push(next);
    }
    return week;
  }
  
  function filtered_person(dept, crew, date, data) {
    var person = [];
    for (var i = 0; i < data.length; i++) {
      var start = "";
      var last = "";
      var absence = "";
      if (data[i][6]) {
        start = new Date(new Date(data[i][6]).getTime() + 2 * 60* 60* 1000);
      }
      if (data[i][9]) {
        last = new Date(new Date(data[i][9]).getTime() + 2 * 60* 60* 1000);
      }
      if (data[i][10]) {
        absence = new Date(new Date(data[i][10]).getTime() + 2 * 60* 60* 1000);
      }
      if (start && data[i][3] == dept && data[i][4] == crew){
        if (!last || last > date) {
          if (start < date) {
            person.push(data[i][1] + " " + data[i][2]);
          } else if (start > date) {
            continue;
          } else {
            person.push(data[i][1] + " " + data[i][2] + 'yellow');
          }
        }
      }
    }
    return person;
  }
  function make_persons(crew, dept, week, data, order) {
    var persons = [];
    if (crew == "A_C") {
      if (order == "first") {
        var crews = ["A Crew", "A Crew", "B Crew", "B Crew", "A Crew", "A Crew", "A Crew"];
      } else {
        var crews = ["C Crew", "C Crew", "D Crew", "D Crew", "C Crew", "C Crew", "C Crew"];
      }
    }
    if (crew == "B_D") {
      if (order == "first") {
        var crews = ["B Crew", "B Crew", "A Crew", "A Crew", "B Crew", "B Crew", "B Crew"];
      } else {
        var crews = ["D Crew", "D Crew", "C Crew", "C Crew", "D Crew", "D Crew", "D Crew"];
      }
    }
    for (var i = 0; i < 7; i++) {
      persons[i] = filtered_person(dept, crews[i], week[i], data);
    }
    return persons;
  }
  function get_length(totalSlots) {
    var length = {};
    length.rollFedCurAB = Math.max(totalSlots[0][9], totalSlots[1][9]);
    length.rollFedCurCD = Math.max(totalSlots[2][9], totalSlots[3][9]);
    length.rollFedNextAB = Math.max(totalSlots[0][11], totalSlots[1][11]);
    length.rollFedNextCD = Math.max(totalSlots[2][11], totalSlots[3][11]);

    length.inlineCurAB = Math.max(totalSlots[0][2], totalSlots[1][2]);
    length.inlineCurCD = Math.max(totalSlots[2][2], totalSlots[3][2]);
    length.inlineNextAB = Math.max(totalSlots[0][4], totalSlots[1][4]);
    length.inlineNextCD = Math.max(totalSlots[2][4], totalSlots[3][4]);

    length.ecoStarCurAB = Math.max(totalSlots[0][14], totalSlots[1][14]);
    length.ecoStarCurCD = Math.max(totalSlots[2][14], totalSlots[3][14]);
    length.ecoStarNextAB = Math.max(totalSlots[0][16], totalSlots[1][16]);
    length.ecoStarNextCD = Math.max(totalSlots[2][16], totalSlots[3][16]);

    length.northPlantCurAB = Math.max(totalSlots[0][19], totalSlots[1][19]);
    length.northPlantCurCD = Math.max(totalSlots[2][19], totalSlots[3][19]);
    length.northPlantNextAB = Math.max(totalSlots[0][21], totalSlots[1][21]);
    length.northPlantNextCD = Math.max(totalSlots[2][21], totalSlots[3][21]);

    return length;
  }
  function create_table(persons, max_length) {
    var table = new Array(7);
    for (var i = 0; i < max_length; i++) {
      table[i] = new Array();
    }
    for (var i=0; i<max_length; i++) {
      for (var j=0; j<persons.length; j++) {
        if (persons[j][i]) {
          table[i][j] = persons[j][i];
        } else {
          table[i][j] = null;
        }
      }
    }
    return table;
  }
