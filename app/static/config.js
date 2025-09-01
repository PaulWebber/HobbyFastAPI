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
    showModal({
        title: 'Edit hobby name',
        value: oldName,
        input: true,
        confirmText: 'Save',
        cancelText: 'Cancel',
        onConfirm: async (name) => {
            if (name) {
                try {
                    const res = await fetch(`/config/hobbies/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, name })
                    });
                    if (!res.ok) {
                        const data = await res.json();
                        if (data.detail && data.detail.includes('already exists')) {
                            // Find the modal input and set validity
                            const inputBox = document.getElementById('modalInput');
                            if (inputBox) {
                                inputBox.setCustomValidity('Cannot rename because that Hobby already exists.');
                                inputBox.reportValidity();
                                setTimeout(() => inputBox.setCustomValidity(''), 2000);
                            }
                            return;
                        }
                    }
                    fetchHobbies();
                } catch (e) {
                    showModal({
                        title: 'Error',
                        value: 'An error occurred.',
                        input: false,
                        confirmText: 'OK',
                        onConfirm: () => {}
                    });
                }
            }
        },
        onCancel: () => {}
    });
};

window.deleteHobby = function(id) {
    if (confirm('Delete this hobby?')) {
        fetch(`/config/hobbies/${id}`, { method: 'DELETE' })
            .then(fetchHobbies);
    }
};

document.addEventListener('DOMContentLoaded', fetchHobbies);
