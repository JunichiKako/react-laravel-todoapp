document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-action="edit"]');
    if (editBtn) {
        const item = editBtn.closest('[data-todo]');
        item.querySelector('[data-mode="view"]').classList.add('hidden');
        const form = item.querySelector('[data-mode="edit"]');
        form.classList.remove('hidden');
        const input = form.querySelector('input[name="title"]');
        input.focus();
        input.select();
        return;
    }

    const cancelBtn = e.target.closest('[data-action="cancel"]');
    if (cancelBtn) {
        const item = cancelBtn.closest('[data-todo]');
        const form = item.querySelector('[data-mode="edit"]');
        const input = form.querySelector('input[name="title"]');
        input.value = input.defaultValue;
        form.classList.add('hidden');
        item.querySelector('[data-mode="view"]').classList.remove('hidden');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const form = e.target.closest('[data-mode="edit"]');
    if (!form || form.classList.contains('hidden')) return;
    form.querySelector('[data-action="cancel"]')?.click();
});
