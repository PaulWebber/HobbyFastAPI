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
    console.log('renderFields: loaded fields', fields);
    const form = document.getElementById('itemFields');
    form.innerHTML = '';
    const hobbyId = getHobbyId();
    if (!fields.length) {
        form.innerHTML = '<em>No fields configured.</em>';
        return;
    }
    for (const field of fields) {
        let options = [];
        const row = document.createElement('div');
        row.className = 'field-row';
        const label = document.createElement('label');
        label.textContent = `${field.name}:`;
        row.appendChild(label);
        if (field.type === 'combo') {
            try {
                const res = await fetch(`/config/hobbies/${hobbyId}/fields/${encodeURIComponent(field.id)}/options`);
                options = await res.json();
            } catch {}
            const select = document.createElement('select');
            select.name = field.id;
            select.style.width = '100px'; // Match other fields
            select.style.boxSizing = 'border-box';
            select.style.height = '2em'; // Match height of other fields
            for (const opt of options) {
                const option = document.createElement('option');
                if (typeof opt === 'object' && opt !== null && 'id' in opt && 'value' in opt) {
                    option.value = opt.id;
                    option.textContent = opt.value;
                } else {
                    option.value = opt;
                    option.textContent = opt;
                }
                select.appendChild(option);
            }
            // Wrap select and button in a flex container
            const comboWrap = document.createElement('span');
            comboWrap.style.display = 'inline-flex';
            comboWrap.style.alignItems = 'center';
            comboWrap.appendChild(select);
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.textContent = '+';
            addBtn.title = 'Add Option';
            addBtn.style.marginLeft = '8px';
            addBtn.style.fontWeight = 'bold';
            addBtn.style.fontSize = '1.1em';
            addBtn.style.height = '2em';
            addBtn.style.width = '2em';
            addBtn.style.padding = '0';
            addBtn.style.lineHeight = '1em';
            addBtn.onclick = function() {
                window._addOptionFieldId = field.id;
                document.getElementById('addOptionInput').value = '';
                document.getElementById('addOptionModal').style.display = 'block';
                document.getElementById('addOptionInput').focus();
            };
            comboWrap.appendChild(addBtn);
            row.appendChild(label);
            row.appendChild(comboWrap);
        } else if (field.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = field.id;
            input.placeholder = field.name;
            row.appendChild(input);
        } else if (field.type === 'integer') {
            const input = document.createElement('input');
            input.type = 'number';
            input.name = field.id;
            input.placeholder = field.name;
            row.appendChild(input);
        } else if (field.type === 'checkbox') {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = field.id;
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
    const modal = document.getElementById('editFieldModal');
    const input = document.getElementById('editFieldName');
    const select = document.getElementById('editFieldType');
    input.value = field.name;
    select.value = field.type;
    modal.style.display = 'block';
    input.focus();
}

function closeEditFieldModal() {
    document.getElementById('editFieldModal').style.display = 'none';
    editFieldIndex = null;
    originalFieldName = null;
    originalFieldType = null;
}

document.addEventListener('DOMContentLoaded', function() {
    // Save button for Edit Field modal
    const saveEditFieldBtn = document.getElementById('saveEditFieldBtn');
    if (saveEditFieldBtn) {
        saveEditFieldBtn.onclick = async function() {
            const name = document.getElementById('editFieldName').value.trim();
            const type = document.getElementById('editFieldType').value;
            if (!name || !type || editFieldIndex === null) return;
            let fields = await loadFieldConfig();
            // Prevent duplicate field names (case-insensitive)
            if (fields.some((f, idx) => idx !== editFieldIndex && f.name.toLowerCase() === name.toLowerCase())) {
                showToast('Duplicate field name.');
                return;
            }
            fields[editFieldIndex] = { ...fields[editFieldIndex], name, type };
            await saveFieldConfig(fields);
            await renderFieldsList();
            await renderFields();
            closeEditFieldModal();
        };
    }

    // Cancel button for Edit Field modal
    const cancelEditFieldBtn = document.getElementById('cancelEditFieldBtn');
    if (cancelEditFieldBtn) {
        cancelEditFieldBtn.onclick = function() {
            closeEditFieldModal();
        };
    }
    renderFields();

    document.getElementById('saveItemBtn').onclick = async function() {
        const form = document.getElementById('itemFields');
        const fields = await loadFieldConfig();
        const hobbyId = getHobbyId();
        let item = {};
        for (const field of fields) {
            let val;
            if (field.type === 'combo') {
                const select = form.querySelector(`select[name='${field.id}']`);
                val = select ? select.value : '';
                item[field.id] = val;
            } else if (field.type === 'checkbox') {
                const input = form.querySelector(`input[name='${field.id}']`);
                val = input ? input.checked : false;
                item[field.id] = val;
            } else {
                const input = form.querySelector(`input[name='${field.id}']`);
                val = input ? input.value : '';
                if (field.type === 'integer') val = val ? parseInt(val) : '';
                item[field.id] = val;
            }
        }
        try {
            let response;
            if (typeof window.editingItemIndex === 'number' && window.editingItemIndex >= 0) {
                // Update existing item
                response = await fetch(`/config/hobbies/${hobbyId}/items/${window.editingItemIndex}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                window.editingItemIndex = null;
                document.getElementById('saveItemBtn').textContent = 'Save Item';
            } else {
                // Add new item
                response = await fetch(`/config/hobbies/${hobbyId}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                window.editingItemIndex = null;
            }
            if (!response.ok) {
                try {
                    const data = await response.json();
                    if (data.detail && data.detail.includes('already exists')) {
                        showToast('Duplicate item or option.');
                    } else {
                        showToast('Failed to save item.');
                    }
                } catch {
                    showToast('Failed to save item.');
                }
            }
        } catch (e) {
            showToast('Failed to save item.');
        }
        await renderFields();
        await renderItemList();
        if (form.reset) form.reset();
    };


    const configBtn = document.getElementById('configBtn');
    if (configBtn) {
        configBtn.onclick = function() {
            openConfigModal();
            renderFieldsList();
        };
    }

    document.getElementById('closeConfig').onclick = function() {
        closeConfigModal();
    };

    document.getElementById('addFieldBtn').onclick = async function() {
        const name = document.getElementById('fieldName').value.trim();
        const type = document.getElementById('fieldType').value;
        if (!name || !type) return;
        // Always fetch the latest fields from backend before adding
        let fields = await loadFieldConfig();
        // Only send fields with id (existing), plus the new one (no id)
        const newFields = [...fields, { name, type }];
        await saveFieldConfig(newFields);
        document.getElementById('fieldName').value = '';
        document.getElementById('fieldType').value = '';
        // After saving, reload the field list from backend to get correct UUIDs and all fields
        await renderFieldsList();
        await renderFields();
        closeConfigModal();
    }

    document.getElementById('cancelAddFieldBtn').onclick = function() {
        document.getElementById('fieldName').value = '';
        document.getElementById('fieldType').value = '';
        closeConfigModal();
    }
});




