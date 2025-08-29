async function fetchHobbies() {
    const res = await fetch('/config/hobbies');
    const hobbies = await res.json();
    const list = document.getElementById('hobbyList');
    list.innerHTML = '';
    hobbies.forEach(hobby => {
        const li = document.createElement('li');
            li.innerHTML = `<span><button class='hobby-link' onclick=\"window.location.href='/items/${hobby.id}'\">${hobby.name}</button></span>
                <span class="actions">
                    <button onclick="editHobby('${hobby.id}', '${hobby.name.replace(/'/g, "&#39;")}' )">Edit</button>
                    <button onclick="deleteHobby('${hobby.id}')">Delete</button>
                </span>`;
        list.appendChild(li);
    });
}


function generateUUID() {
    // Simple UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.getElementById('addHobbyForm').onsubmit = async function(e) {
    e.preventDefault();
    const input = document.getElementById('hobbyName');
    const name = input.value;
    // Fetch current hobbies and check for duplicates (case-insensitive)
    const res = await fetch('/config/hobbies');
    const hobbies = await res.json();
    const exists = hobbies.some(h => h.name.toUpperCase() === name.toUpperCase());
    if (exists) {
        input.setCustomValidity('This hobby already exists.');
        input.reportValidity();
        setTimeout(() => input.setCustomValidity(''), 2000);
        return;
    }
    const id = generateUUID();
    await fetch('/config/hobbies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
    });
    this.reset();
    fetchHobbies();
};

window.editHobby = function(id, oldName) {
    const name = prompt('Edit hobby name:', oldName);
    if (name) {
        fetch(`/config/hobbies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name })
        }).then(fetchHobbies);
    }
};

window.deleteHobby = function(id) {
    if (confirm('Delete this hobby?')) {
        fetch(`/config/hobbies/${id}`, { method: 'DELETE' })
            .then(fetchHobbies);
    }
};

document.addEventListener('DOMContentLoaded', fetchHobbies);
