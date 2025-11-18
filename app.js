const modals = document.querySelectorAll('.modal');
const addBtn =document.getElementById('add-worker-btn');
const closemodal =document.querySelectorAll('.close-Modal-btn');
const addForum  = document.getElementById('addForum');
const detailsmodal = document.getElementById('details-model');
const workerForm = addForum.querySelector('form');
const unassignedList = document.getElementById('unassigned-list');
const rooms = document.querySelectorAll('.room');
const countSpan = document.getElementById('unassigned-count');
const expContainer = document.querySelector('.exp-container');
const expItem = document.querySelector('.exp-item');
const addExpBtn = document.getElementById('add-exp-btn');
const previewimg = document.getElementById('previewimg');
const imgUrl =document.getElementById('img-url');



const zonePermissions = {
    "conference": ["Manager", "Réceptionnistes", "Techniciens IT", "Agents de sécurité", "Nettoyage", "Autres rôles"],
    "personnel": ["Manager", "Réceptionnistes", "Techniciens IT", "Agents de sécurité", "Nettoyage", "Autres rôles"],
    "servers": ["Techniciens IT", "Manager", "Nettoyage"],
    "security": ["Agents de sécurité", "Manager", "Nettoyage"],
    "Réception": ["Réceptionnistes", "Manager", "Nettoyage", "Autres rôles"],
    "archive": ["Manager", "Réceptionnistes", "Techniciens IT", "Agents de sécurité"]
};

let workersData = JSON.parse(localStorage.getItem('workSphereData')) || [];

addExpBtn.addEventListener('click', addExperienceField);

function addExperienceField() {
    const cloneExp = expItem.cloneNode(true);

    const inputs = cloneExp.querySelectorAll('input');
    inputs.forEach(input => input.value = '');

    const currentCount = expContainer.querySelectorAll('.exp-item').length + 1;
    cloneExp.querySelector('h4').textContent = `Expérience ${currentCount}`;

    const deleteBtn = cloneExp.querySelector('.remove-exp-btn');
    deleteBtn.classList.remove('hidden');
    deleteBtn.addEventListener('click', function() {
        this.closest('.exp-item').remove();
    });

    expContainer.appendChild(cloneExp);
}

modals.forEach((mdl)=>{
    mdl.addEventListener('click',(e)=>{
        if(e.target.classList.contains('modal')){
            mdl.classList.add('hidden');
        }
    })
})

addBtn.addEventListener('click',()=>{
        addForum.classList.remove('hidden');
})
closemodal.forEach((closemdl)=>{
    closemdl.addEventListener('click',(e)=>{
        const parentModal = closemdl.closest('.modal');
        if (parentModal) {
            parentModal.classList.add('hidden');
        }
    })
})

imgUrl.addEventListener('change',e =>{
    previewimg.src = e.target.value;
})

function isAllowed(role,zone){
    return zonePermissions[zone].includes(role);
}
function validateForm(formData) {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;

    if (!nameRegex.test(formData.fullname)) {
        alert('Nom invalide (2-50 caractères, lettres uniquement)');
        return false;
    }

    if (!emailRegex.test(formData.email)) {
        alert('Email invalide');
        return false;
    }

    if (!phoneRegex.test(formData.phone)) {
        alert('Numéro de téléphone invalide');
        return false;
    }

    return true;
}

workerForm.addEventListener('submit', e => {
    e.preventDefault();

    const experiences = [];
    const expItems = expContainer.querySelectorAll('.exp-item');
    
    expItems.forEach(item => {
        experiences.push({
            title: item.querySelector('.exp-title').value,
            company: item.querySelector('.exp-company').value,
            startDate: item.querySelector('.exp-start').value,
            endDate: item.querySelector('.exp-end').value
        });
    });

    const worker = {
        id: Date.now(),
        fullname: workerForm.querySelector('input[type="text"]').value,
        role: workerForm.querySelector('#Role').value,
        photo: imgUrl.value || 'img/Profil.jpg',
        email: workerForm.querySelector('input[type="email"]').value,
        phone: workerForm.querySelector('input[type="phone"]').value,
        experiences: experiences,
        zone: null
    };

    if (!validateForm(worker)) return;

    
        workersData.push(worker);

    addForum.classList.add('hidden');

    localStorage.setItem('workSphereData',JSON.stringify(workersData));
});
