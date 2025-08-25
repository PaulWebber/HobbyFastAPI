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
    for (const field of fields) {
        let input = '';
        if (field.type === 'combo') {
            const hobbyId = getHobbyId();
            let options = [];
            try {
                const res = await fetch(`/config/hobbies/${hobbyId}/fields/${encodeURIComponent(field.name)}/options`);
                options = await res.json();
            } catch {}
            input = `<select name='${field.name}'><option value='' style='font-style:italic;'>Add New...</option>` +
                options.map(opt => `<option value='${opt}'>${opt}</option>`).join('') + '</select>';
        } else if (field.type === 'text') {
            input = `<input type='text' name='${field.name}' placeholder='${field.name}' />`;
        } else if (field.type === 'integer') {
            input = `<input type='number' name='${field.name}' placeholder='${field.name}' />`;
        } else if (field.type === 'checkbox') {
            input = `<input type='checkbox' name='${field.name}' />`;
        }
        const row = document.createElement('div');
        row.className = 'field-row';
        row.innerHTML = `<label>${field.name}:</label> ${input}`;
        form.appendChild(row);
        // Add event for Add New... on combo
        if (field.type === 'combo') {
            const select = row.querySelector('select');
            select.addEventListener('change', async function() {
                if (this.selectedIndex === 0) {
                    const newVal = prompt('Enter new option for ' + field.name + ':');
                    if (newVal) {
                        await fetch(`/config/hobbies/${hobbyId}/fields/${encodeURIComponent(field.name)}/options`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newVal)
                        });
                        await renderFields();
                    } else {
                        this.selectedIndex = 1;
                    }
                }
            });
        }
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
        .then(items => {
            const item = items[idx];
            const fields = loadFieldConfig();
            let newItem = {};
            for (const field of fields) {
                let val = prompt(`Edit ${field.name}:`, item[field.name]);
                if (field.type === 'checkbox') val = val === 'true' || val === true;
                if (field.type === 'integer') val = val ? parseInt(val) : '';
                newItem[field.name] = val;
            }
            fetch(`/config/hobbies/${hobbyId}/items/${idx}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            }).then(renderItemList);
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

async function renderFieldsList() {
    const fields = await loadFieldConfig();
    const ul = document.getElementById('fieldsList');
    ul.innerHTML = '';
    fields.forEach(f => {
        const li = document.createElement('li');
        li.textContent = `${f.name} (${f.type.charAt(0).toUpperCase() + f.type.slice(1)})`;
        ul.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderFields();
    renderFieldsList();
    document.getElementById('configBtn').onclick = openConfigModal;
    document.getElementById('closeConfig').onclick = closeConfigModal;
    document.getElementById('addFieldBtn').onclick = async function() {
        const name = document.getElementById('fieldName').value.trim();
        const type = document.getElementById('fieldType').value;
        if (!name || !type) return;
        let fields = await loadFieldConfig();
        fields.push({ name, type });
    await saveFieldConfig(fields);
    // Always reload fields from backend after saving to ensure UI is in sync
    await renderFields();
    await renderFieldsList();
        document.getElementById('fieldName').value = '';
        document.getElementById('fieldType').value = '';
    };
    document.getElementById('saveItemBtn').onclick = async function() {
        const hobbyId = getHobbyId();
        const fields = await loadFieldConfig();
        const form = document.getElementById('itemFields');
        const data = {};
        fields.forEach(field => {
            let val;
            if (field.type === 'checkbox') {
                val = form.querySelector(`[name='${field.name}']`).checked;
            } else {
                val = form.querySelector(`[name='${field.name}']`).value;
            }
            data[field.name] = val;
        });
        await fetch(`/config/hobbies/${hobbyId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        await renderItemList();
        form.reset();
    };
});
