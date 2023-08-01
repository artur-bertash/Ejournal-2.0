// content.js
//function injectDOM() {
// const images = document.getElementsByTagName('body');
// for (let i = 0; i < images.length; i++) {
//  images[i].style.border = '20px solid red';
// }
//}

/**
 * @typedef {Object | "none"} AppraisalData
 * @property {string} grade
 * @property {string} type
 * @property {string} comment
 *
 * @typedef {Object} Subject
 * @property {number} number
 * @property {string} name
 * @property {string} homework
 * @property {AppraisalData} appraisal
 * 
 * @typedef {Object} Day
 * @property {string} date
 * @property {string} rawDate
 * @property {Subject[]} subjects
 */

/** Function to parse the table and extract the data
 * @returns {Day}
 */
function parseTable(table) {
  const headers = Array.from(table.querySelectorAll('thead tr td'));
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  const data = [];

  function parseAppraisalData(modalBody) {
    const appraisalData = [];
    const paragraphs = Array.from(modalBody.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      const parts = p.textContent.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        appraisalData.push({
          "Оцінка": "grade",
          "Тип": "type",
          "Коментар": "comment",
        }[key] + ": " + value);
      }
    });
    return appraisalData;
  }

  rows.forEach((row) => {
    const rowData = {};
    const cells = Array.from(row.querySelectorAll('td'));

    cells.forEach((cell, index) => {
      const header = headers[index].classList.contains('number')
        ? 'number'
        : headers[index].classList.contains('diary-thead-date')
          ? 'name'
          : headers[index].classList.contains('diary-thead-hometask')
            ? 'homework'
            : headers[index].classList.contains('diary-thead-appraisal')
              ? 'appraisal'
              : '';

      if (header === 'appraisal') {
        const modalBodies = cell.querySelectorAll('.modal-body');
        if (modalBodies.length > 0) {
          const appraisals = [];
          modalBodies.forEach((modalBody) => {
            const appraisalData = parseAppraisalData(modalBody);
            appraisals.push(appraisalData);
          });
          rowData.appraisal = appraisals;
        } else {
          rowData.appraisal = [];
        }
      } else {
        rowData[header] = cell.textContent.trim();
      }
    });

    if (rowData.name.trim().length) data.push(rowData);
  });

  return {
    date: parseDate(headers[1].innerHTML.trim()),
    rawDate: headers[1].innerHTML.trim(),
    subjects: data,
  };
}

function parseDate(string) {
  const [day, monthName] = string.trim().slice(string.indexOf(' ') + 1).split(' ');
  const month = [
    "січня", "лютого", "березня",
    "квітня", "травня", "червня",
    "липня", "серпня", "вересня",
    "жовтня", "листопада", "грудня",
  ].indexOf(monthName) + 1;
  return month == 0 ? "err" : `${day.padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
}
/*
function parseDates() {
  var tables = document.querySelectorAll('.diary-thead-date');
  var dates = [];

  tables.forEach(function (table) {
    var dateText = table.textContent.trim();
    dates.push(dateText);
  });

  return dates;
}*/

function isNone() {
  const tables = Array.from(document.querySelectorAll('.diary.table'));

  return tables.map(table => parseTable(table).subjects.length > 0).some(v => v) ? "full" : "empty";

  /*
  const parsedData = [];
  const result = document.querySelector('.segoi-ui');

  // Iterate over each table and call the parseTable function to extract the data
  tables.forEach(table => {
    const parsedTableData = parseTable(table);

    parsedData.push(parsedTableData);


  });
  appraisals = parsedData[1].map(item => item.appraisal)
  result.innerText = JSON.stringify(parsedData[1].map(item => item.appraisal), null, 2); //the comment
  function checkList(lst) {
    for (let item of lst) {
      if (typeof item === 'object' && item !== null) {
        return 'full';
      } else if (item !== '') {
        return 'not empty';
      }
    }
    return 'empty';
  }

  return result.innerText = checkList(appraisals);
*/
}


function goForwardBack() {
  const reslinks = [];
  const diaryLinks = document.querySelectorAll('.diary-slider a');

  diaryLinks.forEach(link => {
    const hrefValue = link.getAttribute('href');
    reslinks.push(hrefValue);
  });

  return reslinks;
}

function mergeLists(list1, list2) {
  const mergedList = [];
  const maxLength = Math.max(list1.length, list2.length);

  for (let i = 0; i < maxLength; i++) {
    mergedList.push([list1[i], list2[i]]);
  }

  return mergedList;
}

window.addEventListener("load", function () {

  if (document.URL.includes("diary.html")) {


    chrome.runtime.sendMessage({
      status: "loadedDiary",
    }).then(message => {
      if (message.dataType != "months") return;
      months = message.data;
      page = months.length - 1;
      createTable(page);
      document.querySelector('#button-left').onclick = buttonPreviousMonth;
      document.querySelector('#button-right').onclick = buttonNextMonth;
    });

    return

  }
  const tables = Array.from(document.querySelectorAll('.diary.table'));
  const days = tables.map(parseTable).filter(day => (!['субота', 'неділя'].includes(day.rawDate.split(',')[0])) || day.subjects.length > 0);
  /*
    // Define an array to store the parsed data from all tables
    const parsedData = [];
  
    var parsedDates = parseDate(tables);
    // Iterate over each table and call the parseTable function to extract the data
    tables.forEach(table => {
      const parsedTableData = parseTable(table);
  
      parsedData.push(parsedTableData);
    });
  
    const res = mergeLists(parsedDates, parsedData);
  */
  chrome.runtime.sendMessage({
    status: "loaded",
    backLink: goForwardBack()[0],
    forwardLink: goForwardBack()[1],
    empty: !days.some(day => day.subjects.length),
    data: days,
  });
});

function init() {
  if (document.URL.includes("diary.html")) {
    return

  }
  var tag = document.createElement("button");
  var text = document.createTextNode("Розумний щоденник");
  tag.appendChild(text);
  tag.className = "smart-button";
  tag.id = "smart-button";
  var element = document.getElementById("sidebar");
  if (element) {
    element.appendChild(tag);
  }


  const onClick = () => {


    // Sending a message from content.js
    chrome.runtime.sendMessage({ message: "The smart-button was pressed" });
    //window.open(goForwardBack()[1], '_blank');
    setTimeout(() => window.location.reload(), 10);
    //isNone()














    /*
    
    
        const tables = document.querySelectorAll('.diary.table');
    
    
        // Define an array to store the parsed data from all tables
        const parsedData = [];
        var dates = []
    
    
        // Iterate over each table and call the parseTable function to extract the data
        tables.forEach(table => {
          const parsedTableData = parseTable(table);
          const parsedDates = parseDate(table);
          parsedData.push(parsedTableData);
          dates.push(parsedDates)
    
    
    
        });
    
    
    
    
    
        // Output the parsed data
        console.log(JSON.stringify(parsedData, null, 2));
    
        tag.innerText = JSON.stringify(parsedData, null, 2);
    
    
    
    
    
    
    */


    //location.href = ('http://diary-pro.zzz.com.ua/#');
  };

  if (tag) {
    tag.addEventListener('click', onClick);
  }
}

init();

/**
 * @type {Day[][]}
 */
var months = [];
var page = 0;

function createTable(monthIndex) {
  if (document.URL.includes("e-journal")) {
    return
  }

  const days = months[monthIndex] ?? "throw";
  if (days == "throw") return;

  function createAndAppend(parent, type) {
    const element = document.createElement(type);
    parent.appendChild(element);
    return element;
  }

  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  while (thead.childElementCount) thead.removeChild(thead.firstChild);
  while (tbody.childElementCount) tbody.removeChild(tbody.firstChild);

  const headerRow = createAndAppend(thead, 'tr');
  createAndAppend(headerRow, 'td').innerHTML = "Номер";
  createAndAppend(headerRow, 'td').innerHTML = "Предмет";
  const subjectRowMap = new Map();

  for (let i = 0; i < days.length; i++) {
    createAndAppend(headerRow, 'th').innerHTML = days[i].date;
    let rowsProcessed = [];
    days[i].subjects.forEach(subject => {
      if (!subjectRowMap.has(subject.name)) {
        const tr = createAndAppend(tbody, 'tr');
        subjectRowMap.set(subject.name, tr);
        createAndAppend(tr, 'td').innerHTML = subjectRowMap.size;
        createAndAppend(tr, 'td').innerHTML = subject.name;
        for (let j = 0; j < i; j++) createAndAppend(tr, 'td');
      }

      const tr = subjectRowMap.get(subject.name);
      if (rowsProcessed.includes(tr)) return; // to consider: показує тільки першу оцінку за день, треба буде думати як інакше зробити
      const td = createAndAppend(tr, 'td');
      if (subject.appraisal != []) {
        const grades = [];
        subject.appraisal.forEach(item => {
          const grade = item.find(info => info.startsWith("grade: "));        //to consider: додав хуйню яка хендлить кейс з декількома оцінками 
          if (grade) {                                                        // але всеодно додає тільки перший предмет \\ проблема вище
            grades.push(grade.split(": ")[1]);
          }
        });
        td.innerHTML = grades
      }
      rowsProcessed.push(tr);
    });
    subjectRowMap.forEach(row => {
      if (!rowsProcessed.includes(row)) createAndAppend(row, 'td');
    })
  }
}

function buttonPreviousMonth() {
  if (page > 0) createTable(--page);
}

function buttonNextMonth() {
  if (page < months.length - 1) createTable(++page);
}

function replaceImg() {
  if (document.URL.includes("diary.html")) {
    return

  }
  // ejournal 2.0

  const imageElement = document.querySelector('.navbar-brand img');


  imageElement.src = 'https://i.imgur.com/9n9EXd2.png';

  // boi 
  const imageElement2 = document.querySelector('.pt-image img');

  imageElement2.src = 'https://i.imgur.com/SYdvqfA.jpg';
  var imageElement4 = document.querySelector('header');
  imageElement4.style.backgroundImage = "url('https://i.imgur.com/5soF4Y1.jpg')";


  const imageElement3 = document.querySelector('.profile-photo img');
  if (imageElement3) {
    imageElement3.src = 'https://i.imgur.com/SYdvqfA.jpg'
  }

  //not working
  //const imageEnd = document.getElementsByClassName("col-md-3 col-sm-3 col-xs-12 footer_logo");
  //imageEnd.src = 'https://i.imgur.com/9n9EXd2.png';



}

replaceImg()


function Theme() {
  if (document.URL.includes("diary.html")) {
    return

  }

  document.body.style.backgroundColor = 'AntiqueWhite';


  const diary = document.querySelectorAll('.thead-yellow');
  diary.forEach(element => {
    element.style.backgroundColor = 'BurlyWood';
  });
};

Theme();

//const smartButton = document.querySelector('.smart-button')sd sd sd
//if (smartButton) {
// smartButton.addEventListener('click', onClick)
////}

//const onClick = async (e) => {
// let queryOptions = { active: true, lastFocusedWindow: true };        sdfsfsdf
//const [tab] = await chrome.tabs.query(queryOptions)
//chrome.tabs.remove(tab.id)
//}



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.violation == "violation") {
    // Create a new div element
    var box = document.createElement('div');

    box.style.width = '400px';
    box.style.height = '200px';
    box.style.backgroundColor = 'rgba(211, 211, 211, 0.9)';
    box.style.position = 'fixed';
    box.style.top = '50%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.justifyContent = 'center';
    box.style.alignItems = 'center';
    box.style.borderRadius = '10px';
    box.style.padding = '20px';

    var mainText = document.createElement('span');
    mainText.textContent = 'Ви переключили вебсайт';
    mainText.style.fontFamily = 'Arial';
    mainText.style.fontSize = '24px';
    mainText.style.textAlign = 'center';
    mainText.style.marginBottom = '10px';

    var additionalText = document.createElement('span');
    additionalText.textContent = 'Ви можете продовжувати використовувати програму';
    additionalText.style.fontFamily = 'Arial';
    additionalText.style.fontSize = '18px';
    additionalText.style.textAlign = 'center';

    box.appendChild(mainText);
    box.appendChild(additionalText);

    // Append the box to the body or any other element you wish

    //var gifContainer = document.createElement("div");
    //gifContainer.id = "gifContainer";
    //box.appendChild(gifContainer);

    // Create an image element
    //var gifImage = new Image();

    // Set the source of the image to the GIF file
    //gifImage.src = "https://media0.giphy.com/media/rInIhIS9AYCrojSh3v/giphy.gif?cid=ecf05e478bvh7beb7ksx4c3b9tp7uzkeb0oqaaeqsrc5ofkl&ep=v1_gifs_search&rid=giphy.gif&ct=g";

    // Append the GIF image to the container
    //gifContainer.appendChild(gifImage);



    document.body.appendChild(box)
  }
});