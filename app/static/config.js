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
        showToast('This hobby already exists.');
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

let _editHobbyId = null;
let _editHobbyOldName = '';
window.editHobby = function(id, oldName) {
    _editHobbyId = id;
    _editHobbyOldName = oldName;
    const modal = document.getElementById('editHobbyModal');
    const input = document.getElementById('editHobbyInput');
    input.value = oldName;
    modal.style.display = 'block';
    input.focus();
};

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    const modal = document.getElementById('editHobbyModal');
    const input = document.getElementById('editHobbyInput');
    const saveBtn = document.getElementById('saveEditHobbyBtn');
    const cancelBtn = document.getElementById('cancelEditHobbyBtn');
    if (saveBtn && input && modal) {
        saveBtn.onclick = async function() {
            const name = input.value.trim();
            if (!name || name === _editHobbyOldName) {
                modal.style.display = 'none';
                return;
            }
            try {
                const res = await fetch(`/config/hobbies/${_editHobbyId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: _editHobbyId, name })
                });
                if (!res.ok) {
                    const data = await res.json();
                    if (data.detail && data.detail.includes('already exists')) {
                        showToast('Cannot rename because that Hobby already exists.');
                        return;
                    } else {
                        showToast('Failed to rename hobby.');
                        return;
                    }
                }
                modal.style.display = 'none';
                fetchHobbies();
            } catch (e) {
                showToast('An error occurred.');
            }
        };
    }
    if (cancelBtn && modal) {
        cancelBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
});

let _deleteHobbyId = null;
let _deleteHobbyName = '';
window.deleteHobby = function(id) {
    // Find hobby name for modal
    const hobby = Array.from(document.querySelectorAll('#hobbyList .hobby-link'))
        .map(btn => ({
            id: btn.getAttribute('onclick').match(/\/(?:items|fields)\/(.*?)'/)?.[1],
            name: btn.textContent
        }))
        .find(h => h.id === id);
    _deleteHobbyId = id;
    _deleteHobbyName = hobby ? hobby.name : '';
    const modal = document.getElementById('deleteHobbyModal');
    const title = document.getElementById('deleteHobbyModalTitle');
    title.textContent = `Are you sure you want to delete ${_deleteHobbyName}?`;
    modal.style.display = 'block';
};

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    const deleteModal = document.getElementById('deleteHobbyModal');
    const confirmBtn = document.getElementById('confirmDeleteHobbyBtn');
    const cancelBtn = document.getElementById('cancelDeleteHobbyBtn');
    if (confirmBtn && deleteModal) {
        confirmBtn.onclick = async function() {
            if (_deleteHobbyId) {
                try {
                    const res = await fetch(`/config/hobbies/${_deleteHobbyId}`, { method: 'DELETE' });
                    if (!res.ok) {
                        showToast('Failed to delete hobby.');
                    } else {
                        fetchHobbies();
                    }
                } catch {
                    showToast('Failed to delete hobby.');
                }
            }
            deleteModal.style.display = 'none';
            _deleteHobbyId = null;
            _deleteHobbyName = '';
        };
    }
    if (cancelBtn && deleteModal) {
        cancelBtn.onclick = function() {
            deleteModal.style.display = 'none';
            _deleteHobbyId = null;
            _deleteHobbyName = '';
        };
    }
});

document.addEventListener('DOMContentLoaded', fetchHobbies);
