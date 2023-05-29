const modal = document.querySelector('#modal');
const closeBtn = document.querySelector('.modal .close');
const modalMessage = document.querySelector('.modal .modal-body .end-message');
const reloadBtn = document.querySelector('#reloadBtn');

closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

reloadBtn.addEventListener('click', function() {
  location.reload();
});


function openModal(message) {
    modal.style.display = 'block';
    modalMessage.textContent = message;
}


export {openModal}