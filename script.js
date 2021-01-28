const entryInfo = document.querySelectorAll('.book-entry');
const submitEntryBtn = document.querySelector('#submit-entry');
const readYesNoSlider = document.querySelector('#read');
const readYesNoTxt = document.querySelector('#yes-no');
const modal = document.querySelector('#myModal');
const modalDelete = document.querySelector('#delete-modal');
const addBookBtn = document.querySelector('#add-book-popup');
const span = document.getElementsByClassName('close')[0];
const entryError = document.querySelector('#incomplete-entry');
const deleteCheckTxt = document.querySelector('#delete-check');
const confirmDeleteBtn = document.querySelector('#confirm-delete');
const cancelDeleteBtn = document.querySelector('#cancel-delete');

let myLibrary = [];

const theSapiens = new Book("Sapiens", "Yuval Noah Harari", "512", "Read")
myLibrary.push(theSapiens);

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    for (let i = 0; i < entryInfo.length - 1; i++) {
        entryInfo[i].value = "";
    }
    entryError.textContent = "";
    modal.style.display = "none";
}

function addBookToLibrary() {
    // Make sure no fields are empty.
    for (let i = 0; i < entryInfo.length - 1; i++) {
        if (entryInfo[i].value == "") {
            entryError.style.color = "red";
            entryError.textContent = "Complete all fields before submitting";
            return;
        }
    }
    let isRead = entryInfo[3].value == 0 ? "Not read" : "Read";
    Book.prototype = new Book(entryInfo[0].value, entryInfo[1].value,
        entryInfo[2].value, isRead);
    myLibrary.push(Book.prototype);

    closeModal();
    generateTable();
}

function confirmDeleteBook(e) {
    deleteCheckTxt.textContent = `Are you sure you want to delete "${e.path[2].cells[0].textContent}" by ${e.path[2].cells[1].textContent}?`;
    modalDelete.style.display = "block";
}

function deleteBook(e) {

    bookToRemove = myLibrary[e.path[2].rowIndex - 1];
    myLibrary.splice(bookToRemove, 1);
    modalDelete.style.display = "none";
    generateTable();
}

function updateRead(e) {
    currentRead = myLibrary[e.path[2].rowIndex - 1].read;
    myLibrary[e.path[2].rowIndex - 1].read = currentRead == "Not read" ? "Read" : "Not read";
    generateTable();
}

let table = document.querySelector('table');
let tableKeys = Object.keys(myLibrary[0]);

const tbody = document.querySelector('#tbody');

function generateTable() {
    // Empty current grid
    while (tbody.lastElementChild) {
        tbody.removeChild(tbody.lastElementChild);
    }
    // Loop through each book in the library
    for (let element of myLibrary) {
        let row = tbody.insertRow();

        // Loop through each information of the book
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }

        // Add an update read button
        let cell = row.insertCell();
        let readUpdate = document.createElement('input');
        readUpdate.type = "range";
        readUpdate.class = "read-status"
        readUpdate.min = "0";
        readUpdate.max = "1";
        readUpdate.value = element.read == "Not read" ? "0" : "1";
        cell.appendChild(readUpdate);
        readUpdate.addEventListener('change', updateRead);

        // Add a delete button for each book
        let delCell = row.insertCell();
        let deleteBtn = document.createElement('button');
        let deleteTxt = document.createTextNode('Delete');
        deleteBtn.appendChild(deleteTxt);
        delCell.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', confirmDeleteBook);
    }
}

// Event listeners
span.addEventListener('click', closeModal);
addBookBtn.addEventListener('click', openModal);
confirmDeleteBtn.addEventListener('click', deleteBook);
cancelDeleteBtn.addEventListener('click', () => {
    modalDelete.style.display = "none";
});
submitEntryBtn.addEventListener('click', addBookToLibrary);
readYesNoSlider.addEventListener('change', () => readYesNoTxt.textContent = readYesNoTxt.textContent == "No" ? "Yes" : "No");

generateTable();