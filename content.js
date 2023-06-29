// content.js
//function injectDOM() {
// const images = document.getElementsByTagName('body');
// for (let i = 0; i < images.length; i++) {
//  images[i].style.border = '20px solid red';
// }
//}

function init() {
  var tag = document.createElement("button");
  var text = document.createTextNode("Розумний щоденник");
  tag.appendChild(text);
  tag.className = "smart-button";
  tag.id = "smart-button"          // Add a CSS class name to the button
  var element = document.getElementsByClassName("w1");
  element.appendChild(tag);


  //another button
  //var tag2 = document.createElement("button");
  //var text2 = document.createTextNode("Розумний щоденник");
  //tag2.appendChild(text2);
  //tag2.className = "smart-button2";
  //tag2.id = "smart-button2"          // Add a CSS class name to the button
  //var element2 = document.getElementById("w34-collapse");
  //element2.appendChild(tag2);


}

init();

function replaceImg() {
  // ejournal 2.0
  const imageElement = document.querySelector('.navbar-brand img');

  imageElement.src = 'https://i.imgur.com/9n9EXd2.png';

  // boi 
  const imageElement2 = document.querySelector('.pt-image img');

  imageElement2.src = 'https://i.imgur.com/SYdvqfA.jpg';
  var imageElement4 = document.querySelector('header');
  imageElement4.style.backgroundImage = "url('https://i.imgur.com/5soF4Y1.jpg')";

  //does not work
  const imageElement3 = document.querySelector('.profile-photo img');
  imageElement3.src = 'https://i.imgur.com/SYdvqfA.jpg'


}

replaceImg()


function Theme() {
  const back = document.querySelector('body');
  back.style.backgroundColor = 'black';

  const diary = document.querySelectorAll('.thead-yellow');
  diary.forEach(element => {
    element.style.backgroundColor = 'black';
  });
};

Theme();












