// content.js
//function injectDOM() {
// const images = document.getElementsByTagName('body');
// for (let i = 0; i < images.length; i++) {
//  images[i].style.border = '20px solid red';
// }
//}


// Function to parse the table and extract the data
function parseTable(table) {
  const headers = Array.from(table.querySelectorAll('thead tr td'));
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  // Create an array to store the parsed data
  const data = [];

  // Function to parse the appraisal data from the modal body
  function parseAppraisalData(modalBody) {
    const appraisalData = {};
    const paragraphs = Array.from(modalBody.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      const parts = p.textContent.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        appraisalData[key] = value;
      }
    });
    return appraisalData;
  }

  // Loop through each row and extract the data
  rows.forEach((row) => {
    const rowData = {};
    const cells = Array.from(row.querySelectorAll('td'));

    // Loop through each cell and map the data to the corresponding header
    cells.forEach((cell, index) => {
      const header = headers[index].classList.contains('number')
        ? 'number'
        : headers[index].classList.contains('diary-thead-date')
          ? 'subject'
          : headers[index].classList.contains('diary-thead-hometask')
            ? 'homework'
            : headers[index].classList.contains('diary-thead-appraisal')
              ? 'appraisal'
              : '';

      if (header === 'appraisal' && cell.children.length > 0) {
        // Extract the appraisal data from the modal body
        const modalBody = cell.querySelector('.modal-body');
        if (modalBody) {
          rowData[header] = parseAppraisalData(modalBody);
        } else {
          rowData[header] = cell.textContent.trim();
        }
      } else {
        rowData[header] = cell.textContent.trim();
      }
    });

    // Add the parsed data for the current row to the data array
    data.push(rowData);
  });

  return data;
}


function parseDate(table) {

  var element = document.querySelector('.diary-thead-date');
  return element.innerText



}

function isNone() {
  const tables = document.querySelectorAll('.diary.table');
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

  result.innerText = checkList(appraisals);

}


function goForwardBack() {
  reslinks = []
  const diaryLinks = document.querySelectorAll('.diary-slider a');
  if (diaryLinks) {
    diaryLinks.forEach(link => {
      const hrefValue = link.getAttribute('href');
      reslinks.push(hrefValue);
      return reslinks

    });
    return

  }
  //0 is back 1 is forward

}

function init() {
  if (document.URL.includes("diary-pro")) {
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

    isNone()

















    const tables = document.querySelectorAll('.diary.table');


    // Define an array to store the parsed data from all tables
    const parsedData = [];


    // Iterate over each table and call the parseTable function to extract the data
    tables.forEach(table => {
      const parsedTableData = parseTable(table);
      const parsedDates = parseDate(table);
      parsedData.push([parsedDates, parsedTableData]);



    });




    // Output the parsed data
    console.log(JSON.stringify(parsedData, null, 2));

    tag.innerText = JSON.stringify(parsedData, null, 2);









    //location.href = ('http://diary-pro.zzz.com.ua/#');
  };

  if (tag) {
    tag.addEventListener('click', onClick);
  }
}

init();



function createTable() {
  if (document.URL.includes("e-journal")) {
    return
  }
  // Get a reference to the table body element
  var tableBody = document.querySelector('tbody');

  // Create a new row element
  var newRow = document.createElement('tr');

  // Create cell elements and set their content
  var cell1 = document.createElement('td');
  cell1.textContent = '2';

  var cell2 = document.createElement('td');
  cell2.textContent = 'Physics';

  var cell3 = document.createElement('td');
  cell3.textContent = '10';

  var cell4 = document.createElement('td');
  cell4.textContent = '15';

  // Append the cell elements to the new row
  newRow.appendChild(cell1);
  newRow.appendChild(cell2);
  newRow.appendChild(cell3);
  newRow.appendChild(cell4);

  // Append the new row to the table body
  tableBody.appendChild(newRow);


}
createTable()
function replaceImg() {
  if (document.URL.includes("diary-pro")) {
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
  if (document.URL.includes("diary-pro")) {
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












