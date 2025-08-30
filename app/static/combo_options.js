// combo_options.js
// Handles the Combo Option management page

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

async function loadOptions(hobbyId, fieldId) {
    const res = await fetch(`/config/hobbies/${hobbyId}/fields/${fieldId}/options`);
    return await res.json();
}

async function renderOptions() {
    const hobbyId = getQueryParam('hobby');
    const fieldId = getQueryParam('field');
    const fieldName = decodeURIComponent(getQueryParam('fieldName') || '');
    document.getElementById('fieldTitle').textContent = fieldName;
    const options = await loadOptions(hobbyId, fieldId);
    const list = document.getElementById('optionsList');
    list.innerHTML = '';
    options.forEach((opt, idx) => {
        const row = document.createElement('div');
        row.className = 'option-row';
        const span = document.createElement('span');
        span.textContent = (typeof opt === 'object' && opt.value) ? opt.value : opt;
        row.appendChild(span);
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = async () => {
            const newVal = prompt('Edit option:', span.textContent);
            if (newVal && newVal !== span.textContent) {
                // Implement edit endpoint if needed
                await fetch(`/config/hobbies/${hobbyId}/fields/${fieldId}/options/${opt.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value: newVal })
                });
                await renderOptions();
            }
        };
        row.appendChild(editBtn);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = async () => {
            if (confirm('Delete this option?')) {
                await fetch(`/config/hobbies/${hobbyId}/fields/${fieldId}/options/${opt.id}`, { method: 'DELETE' });
                await renderOptions();
            }
        };
        row.appendChild(delBtn);
        list.appendChild(row);
    });
}

document.getElementById('addOptionBtn').onclick = async function() {
    const hobbyId = getQueryParam('hobby');
    const fieldId = getQueryParam('field');
    const input = document.getElementById('newOptionInput');
    const value = input.value.trim();
    if (!value) return;
    await fetch(`/config/hobbies/${hobbyId}/fields/${fieldId}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value)
    });
    input.value = '';
    await renderOptions();
};

document.getElementById('doneBtn').onclick = function() {
    window.history.back();
};

document.addEventListener('DOMContentLoaded', renderOptions);
