// -------- Navbar ----------------- //

const lista = document.getElementById("lista")
const länkar = document.getElementById("länkar")

lista.addEventListener("click", () => {  /* När hamburgermenyn klickas på så.. */
    länkar.classList.toggle("active") /* ... öppnas och stängs menylistan */
})

// ------ Kod för att POST ska fungera med formuläret genom en REST API JSON server ------------ //

let postButton = document.querySelector('#postButton')
postButton.addEventListener('click', fetchData)

function fetchData() {
    let formData = {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        mail: document.querySelector('#mail').value,
        message: document.querySelector('#message').value
    };

    fetch('http://localhost:8000/form', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => console.log('Success', data))
    .catch(error => console.error('Error:', error));
}

// ----- Kod för att DELETE ska fungera med formuäret samt att hämta JSON data med fetch som sedan visar upp objekt från databasen på sidan ----- //

function FormDelete() {
  fetch("./db.json") // Hämtar datan från databas filen
    .then((res) => res.json())
    .then((data) => displayData(data.form))
    .catch((error) => console.error('Error fetching data:', error));
}

function displayData(data) {
  const table = document.getElementById('data-table') //Hämtar tabellen i HTML

  data.forEach((item) => {
    const row = document.createElement('tr')

    // Skapar table rows för vajre värde som tas in från databasen (i detta fall för och efternamn, mail och meddelande)
    for (const key in item) {
      const td = document.createElement('td')
      td.classList.add("td-form")
      td.textContent = item[key]
      row.appendChild(td)
    }

    table.appendChild(row) // Lägger till row till Tabellen i HTML

    row.addEventListener('click', () => { // När row klickas på så tas table row bort från sidan (och JSON databasen)

      table.removeChild(row) // Tar bort Table Row från HTML så att den slutar vara synlig utan att behöva ladda om sidan

      const url = `http://localhost:8000/form/${item.id}`; // Fetch DELETE som tar bort Table Row från databas baserat på ID:n på den table row man klickar på
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Fel när raden skulle raderas: ${response.status}`);
          }
          console.log('Rad raderad');
        })
        .catch((error) => console.error('Fel när raden skulle raders: ', error));
    });
  });
}

FormDelete();
