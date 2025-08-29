// items.js
// Handles the Hobby Item page field config UI and dynamic form rendering

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'integer', label: 'Integer' },
    { value: 'combo', label: 'Combo' },
    { value: 'checkbox', label: 'Check Box' }
];








function getHobbyId() {
    const match = window.location.pathname.match(/\/items\/(.+)$/);
    return match ? match[1] : null;
}

async function loadFieldConfig() {
    const hobbyId = getHobbyId();
    const res = await fetch(`/config/hobbies/${hobbyId}/fields`);
    return await res.json();
}

async function saveFieldConfig(fields) {
    const hobbyId = getHobbyId();
    await fetch(`/config/hobbies/${hobbyId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
    });
}

async function renderFields() {
    const fields = await loadFieldConfig();
    const form = document.getElementById('itemFields');
    form.innerHTML = '';
    const hobbyId = getHobbyId();
    for (const field of fields) {
        let options = [];
        const row = document.createElement('div');
        row.className = 'field-row';
        const label = document.createElement('label');
        label.textContent = `${field.name}:`;
        row.appendChild(label);
        if (field.type === 'combo') {
            try {
                const res = await fetch(`/config/hobbies/${hobbyId}/fields/${encodeURIComponent(field.name)}/options`);
                options = await res.json();
            } catch {}
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.textContent = 'Add Option';
            addBtn.style.marginLeft = '8px';
            addBtn.onclick = async function() {
                const newVal = prompt('Enter new option for ' + field.name + ':');
                if (newVal) {
                    await fetch(`/config/hobbies/${hobbyId}/fields/${encodeURIComponent(field.name)}/options`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newVal)
                    });
                    await renderFields();
                }
            };
            row.appendChild(addBtn);
            const select = document.createElement('select');
            select.name = field.name;
            for (const opt of options) {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                select.appendChild(option);
            }
            row.appendChild(select);
        } else if (field.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = field.name;
            input.placeholder = field.name;
            row.appendChild(input);
        } else if (field.type === 'integer') {
            const input = document.createElement('input');
            input.type = 'number';
            input.name = field.name;
            input.placeholder = field.name;
            row.appendChild(input);
        } else if (field.type === 'checkbox') {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = field.name;
            row.appendChild(input);
        }
        form.appendChild(row);
    }
    await renderItemList();
}

async function renderItemList() {
    const hobbyId = getHobbyId();
    const res = await fetch(`/config/hobbies/${hobbyId}/items`);
    const items = await res.json();
    const div = document.getElementById('itemList');
    if (!items.length) {
        div.innerHTML = '<em>No items yet.</em>';
        return;
    }
    div.innerHTML = '<h3>Items</h3>' + items.map((item, idx) =>
        `<div class='item-row'>
            <span>${Object.entries(item).map(([k,v]) => `<b>${k}</b>: ${v}`).join(' | ')}</span>
            <span class="actions">
                <button onclick="editItem(${idx})">Edit</button>
                <button onclick="deleteItem(${idx})">Delete</button>
            </span>
        </div>`
    ).join('');
}

window.editItem = function(idx) {
    const hobbyId = getHobbyId();
    fetch(`/config/hobbies/${hobbyId}/items`)
        .then(res => res.json())
        .then(async items => {
            const item = items[idx];
            const fields = await loadFieldConfig();
            const form = document.getElementById('itemFields');
            for (const field of fields) {
                if (field.type === 'combo') {
                    const select = form.querySelector(`select[name='${field.name}']`);
                    if (select) select.value = item[field.name] || '';
                } else if (field.type === 'checkbox') {
                    const input = form.querySelector(`input[name='${field.name}']`);
                    if (input) input.checked = !!item[field.name];
                } else {
                    const input = form.querySelector(`input[name='${field.name}']`);
                    if (input) input.value = item[field.name] || '';
                }
            }
            window.editingItemIndex = idx;
            document.getElementById('saveItemBtn').textContent = 'Update Item';
        });
};

window.deleteItem = function(idx) {
    const hobbyId = getHobbyId();
    if (confirm('Delete this item?')) {
        fetch(`/config/hobbies/${hobbyId}/items/${idx}`, { method: 'DELETE' })
            .then(renderItemList);
    }
};

function openConfigModal() {
    document.getElementById('configModal').style.display = 'block';
}

function closeConfigModal() {
    document.getElementById('configModal').style.display = 'none';
}


// Move these function declarations above DOMContentLoaded so they are defined before use
let editFieldIndex = null;
let originalFieldName = null;
let originalFieldType = null;

async function renderFieldsList() {
    const fields = await loadFieldConfig();
    const ul = document.getElementById('fieldsList');
    ul.innerHTML = '';
    fields.forEach((f, idx) => {
        const li = document.createElement('li');
        li.textContent = `${f.name} (${f.type.charAt(0).toUpperCase() + f.type.slice(1)})`;
        li.style.cursor = 'pointer';
        li.onclick = () => openEditFieldModal(idx, f);
        ul.appendChild(li);
    });
}

function openEditFieldModal(idx, field) {
    editFieldIndex = idx;
    originalFieldName = field.name;
    originalFieldType = field.type;
    document.getElementById('editFieldName').value = field.name;
    document.getElementById('editFieldType').value = field.type;
    document.getElementById('editFieldModal').style.display = 'block';
}

function closeEditFieldModal() {
    document.getElementById('editFieldModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('saveItemBtn').onclick = async function() {
        const form = document.getElementById('itemFields');
        const fields = await loadFieldConfig();
        const hobbyId = getHobbyId();
        let item = {};
        for (const field of fields) {
            let val;
            if (field.type === 'combo') {
                const select = form.querySelector(`select[name='${field.name}']`);
                val = select ? select.value : '';
            } else if (field.type === 'checkbox') {
                const input = form.querySelector(`input[name='${field.name}']`);
                val = input ? input.checked : false;
            } else {
                const input = form.querySelector(`input[name='${field.name}']`);
                val = input ? input.value : '';
                if (field.type === 'integer') val = val ? parseInt(val) : '';
            }
            item[field.name] = val;
        }
        if (window.editingItemIndex !== null) {
            // Update existing item
            await fetch(`/config/hobbies/${hobbyId}/items/${window.editingItemIndex}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            window.editingItemIndex = null;
            document.getElementById('saveItemBtn').textContent = 'Save Item';
        } else {
            // Add new item
            await fetch(`/config/hobbies/${hobbyId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        }
    await renderFields();
    await renderItemList();
    if (form.reset) form.reset();
    };

    document.getElementById('closeConfig').onclick = function() {
        closeConfigModal();
    };

    document.getElementById('addFieldBtn').onclick = async function() {
        const name = document.getElementById('fieldName').value.trim();
        const type = document.getElementById('fieldType').value;
        if (!name || !type) return;
        let fields = await loadFieldConfig();
        fields.push({ name, type });
        await saveFieldConfig(fields);
        document.getElementById('fieldName').value = '';
        document.getElementById('fieldType').value = '';
        await renderFieldsList();
        await renderFields();
    };
    // ...existing code...
    document.getElementById('configBtn').onclick = function() {
        openConfigModal();
        renderFieldsList();
    };
    document.getElementById('saveEditFieldBtn').onclick = async function() {
        const newName = document.getElementById('editFieldName').value.trim();
        const newType = document.getElementById('editFieldType').value;
        if (!newName || !newType || editFieldIndex === null) return;
        let fields = await loadFieldConfig();
        const hobbyId = getHobbyId();
        // If name or type changed, update combo_options.json if needed
        const oldField = fields[editFieldIndex];
        const wasCombo = oldField.type === 'combo';
        const isCombo = newType === 'combo';
        // Update field
        fields[editFieldIndex] = { name: newName, type: newType };
        await saveFieldConfig(fields);
        // If combo field name changed, update combo_options.json key
        if (wasCombo && (originalFieldName !== newName)) {
            await fetch(`/config/hobbies/${hobbyId}/fields/${encodeURIComponent(originalFieldName)}/options`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newName })
            });
        }
        await renderFields();
        await renderFieldsList();
        closeEditFieldModal();
        editFieldIndex = null;
        originalFieldName = null;
        originalFieldType = null;
    };

    document.getElementById('cancelEditFieldBtn').onclick = function() {
        closeEditFieldModal();
        editFieldIndex = null;
        originalFieldName = null;
        originalFieldType = null;
    };
});


