// combo_options.js
// Handles the Combo Option management page


function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function showModal({title, value, input=false, onConfirm, onCancel, confirmText='OK', cancelText='Cancel'}) {
    const overlay = document.getElementById('modalOverlay');
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
        editBtn.onclick = () => {
            showModal({
                title: 'Edit option',
                value: span.textContent,
                input: true,
                confirmText: 'Save',
                cancelText: 'Cancel',
                onConfirm: async (newVal) => {
                    if (newVal && newVal !== span.textContent) {
                        await fetch(`/config/hobbies/${hobbyId}/fields/${fieldId}/options/${opt.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ value: newVal })
                        });
                        await renderOptions();
                    }
                },
                onCancel: () => {}
            });
        };
        row.appendChild(editBtn);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => {
            showModal({
                title: 'Delete this option?',
                value: '',
                input: false,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                onConfirm: async () => {
                    await fetch(`/config/hobbies/${hobbyId}/fields/${fieldId}/options/${opt.id}`, { method: 'DELETE' });
                    await renderOptions();
                },
                onCancel: () => {}
            });
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
