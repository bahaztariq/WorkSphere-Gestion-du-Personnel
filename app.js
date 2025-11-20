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
const zonelimit ={
    "conference":6,
    "personnel": 6,
    "servers": 3,
    "security": 3,
    "Réception": 10,
    "archive":2
}

let workersData = JSON.parse(localStorage.getItem('workSphereData')) || [];
DisplayStaff(workersData);

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
    previewimg.src = e.target.value || '../img/Profil.jpg';
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
    workerForm.reset();
    localStorage.setItem('workSphereData',JSON.stringify(workersData));
    DisplayStaff(workersData);
});

function DisplayStaff(workersData) {

    unassignedList.innerHTML = '';
    workersData.forEach(staff => {
        const stafItem = document.createElement('div');
        stafItem.draggable='true';
        stafItem.addEventListener('click',()=>{
            detailsmodal.classList.remove('hidden');
            showData(staff);
        })
        stafItem.classList.add('Member','w-full','shadow-md', 'rounded-lg', 'flex', 'justify-between', 'bg-gray-200');
        stafItem.innerHTML = `
                                <div class="flex">
                                    <img src="${staff.photo}" alt="staff image" class="rounded-full w-8 h-8 m-2 md:m-3 md:w-14 md:h-14 object-cover">
                                    <h3 class="font-bold text-[.8rem] md:text-lg mt-1 md:mt-3 md:ml-4">${staff.fullname} <br> <span class="md:text-[.8rem] text-gray-400">${staff.role}</span></h3>
                                </div>
                                <div class="flex">
                                    <button class="mr-3 text-yellow-600 text-[.7rem] md:text-[1.2rem] font-bold cursor-pointer">Edit</button>
                                </div>`
                            ;
        unassignedList.appendChild(stafItem);
    })
}

const Members = document.querySelectorAll(".Member")

Members.forEach(Member => {
    Member.addEventListener("dragstart", e => {
        Member.classList.add("dragging");
    })

    Member.addEventListener("dragend", e => {
        Member.classList.remove("dragging");
    })
})

rooms.forEach(room => {
    room.addEventListener("dragover", e => {
        const draggable = document.querySelector(".dragging");
        room.appendChild(draggable)
    })
})

unassignedList.addEventListener("dragover", e => {
        const draggable = document.querySelector(".dragging");
        unassignedList.appendChild(draggable);
})


function showData(staff){
    
     const img = detailsmodal.querySelector('img')
     const name = detailsmodal.querySelector('.name');
     const email = detailsmodal.querySelector('.email');
     const role = detailsmodal.querySelector('.role');
     const phone = detailsmodal.querySelector('.phone');
     const Experience= detailsmodal.querySelector('.Experience');
     Experience.innerHTML =``;
     name.textContent = staff.fullname;
     email.textContent =staff.email;
     role.textContent = staff.role;
     phone.textContent =staff.phone;
     img.src = staff.photo || '../img/Profil.jpg'
     staff.experiences.forEach(exp =>{
         Experience.innerHTML += `<div>
                                 <p>Title: <span>${exp.title}</span></p>
                                  <p>Company: <span>${exp.company}</span></p>
                                  <p>start date: <span>${exp.startDate}</span></p>
                                  <p>End date: <span>${exp.endDate}</span></p>
                                 </div>
         `;
     })
}

const addroombtn = document.querySelectorAll('.add-room-btn');
const addmodal =document.getElementById('add-modal')


addroombtn.forEach(btn =>{
    btn.addEventListener('click',e => {
        const roomName = btn.getAttribute('room-name')
        const room = btn.parentElement.querySelector('.room');
        console.log(room)
        addmodal.classList.remove('hidden');
        showWorker(roomName,room);
    })
})

const assigncontainer=document.querySelector('.assign');

function showWorker(roomName,room){
    assigncontainer.innerHTML=``;
    const CanAssigned = workersData.filter(w => zonePermissions[roomName].includes(w.role));
    CanAssigned.forEach(staff=>{
        const stafItem = document.createElement('div');
        stafItem.draggable='true';
        stafItem.addEventListener('click',()=>{
            room.appendChild(stafItem)
            workersData = workersData.filter(w => w.id !== staff.id);
            DisplayStaff(workersData);
            stafItem.innerHTML =`
                                <div class="relative flex flex-col justify-center items-center p-1">
                                    <img src="${staff.photo}" alt="staff image" class="rounded-full w-6 h-6  md:w-14 md:h-14 object-cover">
                                    <h3 class="font-bold text-sm text-center ">${staff.fullname} <br> <span class="md:text-xs text-gray-400 text-center">${staff.role}</span></h3>
                                    <button class="absolute top-1 right-1 cursor-pointer">&times;</button>
                                </div>
                                `;
        })
        stafItem.classList.add('Member','shadow-md', 'rounded-lg', 'flex', 'justify-between', 'bg-gray-200');
        stafItem.innerHTML = `
                                <div class="flex">
                                    <img src="${staff.photo}" alt="staff image" class="rounded-full w-8 h-8 m-2 md:m-3 md:w-14 md:h-14 object-cover">
                                    <h3 class="font-bold text-[.8rem] md:text-lg mt-1 md:mt-3 md:ml-4">${staff.fullname} <br> <span class="md:text-[.8rem] text-gray-400">${staff.role}</span></h3>
                                </div>
                                <div class="flex">
                                    <button class="mr-3 text-yellow-600 text-[.7rem] md:text-[1.2rem] font-bold cursor-pointer">Edit</button>
                                </div>`
                            ;
        assigncontainer.appendChild(stafItem);
    })
}