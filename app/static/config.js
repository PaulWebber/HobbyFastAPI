// Modal dialog utility
function showModal({title, value, input=false, onConfirm, onCancel, confirmText='OK', cancelText='Cancel'}) {
    let overlay = document.getElementById('modalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'modalOverlay';
        overlay.style = 'display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:1000;align-items:center;justify-content:center;';
        overlay.innerHTML = `<div id="modalDialog" style="background:#fff;padding:24px 16px;border-radius:8px;min-width:300px;max-width:90vw;box-shadow:0 2px 16px #0002;">
            <div id="modalTitle" style="font-weight:bold;margin-bottom:12px;"></div>
            <input type="text" id="modalInput" style="width:100%;margin-bottom:12px;display:none;">
            <div id="modalButtons"></div>
        </div>`;
        document.body.appendChild(overlay);
    }
    const dialog = document.getElementById('modalDialog');
    document.getElementById('modalTitle').textContent = title;
    const inputBox = document.getElementById('modalInput');
    inputBox.style.display = input ? '' : 'none';
    inputBox.value = value || '';
    const btns = document.getElementById('modalButtons');
    btns.innerHTML = '';
    if (onConfirm) {
        const ok = document.createElement('button');
        ok.textContent = confirmText;
        ok.onclick = () => {
            overlay.style.display = 'none';
            onConfirm(input ? inputBox.value : undefined);
        };
        btns.appendChild(ok);
    }
    if (onCancel) {
        const cancel = document.createElement('button');
        cancel.textContent = cancelText;
        cancel.onclick = () => {
            overlay.style.display = 'none';
            onCancel();
        };
        btns.appendChild(cancel);
    }
    overlay.style.display = 'flex';
    if (input) inputBox.focus();
}
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
        onConfirm: (name) => {
            if (name) {
                fetch(`/config/hobbies/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, name })
                }).then(fetchHobbies);
            }
        },
        onCancel: () => {}
    });
};

window.deleteHobby = function(id) {
    showModal({
        title: 'Delete this hobby?',
        value: '',
        input: false,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => {
            fetch(`/config/hobbies/${id}`, { method: 'DELETE' })
                .then(fetchHobbies);
        },
        onCancel: () => {}
    });
};

document.addEventListener('DOMContentLoaded', fetchHobbies);
