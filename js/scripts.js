//Declare all global variables
const body = document.querySelector('body');
const searchDiv = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const employeeInfo = []; 

//function to fetch API with url
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log('Looks like there was a problem', error))
}

//checks if promise is resolved
function checkStatus(response) {
    if(response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
}

//creates and appends a new div
function createDiv(parent, clas) {
    const div = document.createElement('div');
    div.classList.add(clas);
    parent.appendChild(div); 
    return div;
}

//generates all employee divs and adds info
function generateEmployees(data) {
    const card = createDiv(gallery, 'card');
    
    const imgContainer = createDiv(card, 'card-img-container');
    imgContainer.innerHTML = generateImage(data);

    const infoContainer = createDiv(card, 'card-info-container');
    infoContainer.innerHTML = generateName(data);

    card.addEventListener('click', function(event) {
        createModal(data);
    })
}

//creates a modal as with close, next, and previous buttons
function createModal(data) {
    const index = data.index;
    const container = createDiv(body, 'modal-container');

    const modal = createDiv(container, 'modal');
    modal.innerHTML = `<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>`;

    const infoContainer = createDiv(modal, 'modal-info-container');
    infoContainer.innerHTML = `
        <img class="modal-img" src="${data.img}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${data.firstName} ${data.lastName}</h3>
        <p class="modal-text">${data.email}</p>
        <p class="modal-text cap">${data.city}</p>
        <hr>
        <p class="modal-text">${data.cellNumb}</p>
        <p class="modal-text">${data.streetNumb} ${data.streetName}, ${data.state} ${data.postcode}</p>
        <p class="modal-text">Birthday: ${data.dob}</p>
        `
    const buttons = createDiv(container, 'modal-btn-container');
    buttons.innerHTML = `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
        `;
    const prev = document.getElementById('modal-prev');
    const next = document.getElementById('modal-next');

    //eventListeners for the buttons
    document.getElementById("modal-close-btn").addEventListener('click', function(event) {
        body.removeChild(container);
    });

    prev.addEventListener('click', function(event) {
        body.removeChild(container);

        if(index >= 1) {
            createModal(employeeInfo[index - 1]);
        }
    });

    next.addEventListener('click', function(event) {
        body.removeChild(container);

        if(index <= 10) {
            createModal(employeeInfo[index + 1]);
        }
    });
}

// returns image html
function generateImage(data) {
    const html = `<img class="card-img" src='${data.img}' alt="profile picture">`;
    return html;
}

//returns basic employee info in html
function generateName(data) {
    const html = `
        <h3 id="name" class="card-name cap">${data.firstName} ${data.lastName}</h3>
        <p class="card-text">${data.email}</p>
        <p class="card-text cap">${data.city}, ${data.state}</p>
        `;  
    return html;
}

//create and append search bar form
const form = document.createElement("FORM");
document.getElementsByTagName('FORM').action = "#";
document.getElementsByTagName('FORM').method = "get";
form.innerHTML = `
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    `
searchDiv.appendChild(form);

//creates 12 employee div cards and puts info in an array of employee objects
for (let i = 0; i < 12; i++) {
    fetchData('https://randomuser.me/api/')
        .then(data => {
            employeeInfo.push({
                img: data.results[0].picture.thumbnail,
                firstName: data.results[0].name.first,
                lastName: data.results[0].name.last,
                email: data.results[0].email,
                city: data.results[0].location.city,
                state: data.results[0].location.state,
                cellNumb: data.results[0].cell,
                streetNumb: data.results[0].location.street.number,
                streetName: data.results[0].location.street.name,
                country: data.results[0].location.country,
                postcode: data.results[0].location.postcode,
                dob: data.results[0].dob.date,
                nat: data.results[0].nat,
                index: i
            });

            generateEmployees(employeeInfo[i]);
        })
}

//searches and matches search input with employee names
document.getElementById('search-submit').addEventListener('click', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    const searchList = [];
    for (let i = 0; i < employeeInfo.length; i++) {
        if (searchInput.value.length === 0) {
            document.querySelectorAll('.card')[i].style.display = '';
        } else if (employeeInfo[i].firstName.toLowerCase().includes(searchInput.value.toLowerCase()) || employeeInfo[i].lastName.toLowerCase().includes(searchInput.value.toLowerCase())) {
            document.querySelectorAll('.card')[i].style.display = '';
        } else {
            document.querySelectorAll('.card')[i].style.display = 'none';
        }
    }
});