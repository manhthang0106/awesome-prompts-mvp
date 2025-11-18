// Dark mode functionality
function toggleDarkMode() {
    const body = document.body;
    const toggle = document.querySelector('.dark-mode-toggle');
    const sunIcon = toggle.querySelector('.sun-icon');
    const moonIcon = toggle.querySelector('.moon-icon');
    
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    
    localStorage.setItem('dark-mode', isDarkMode);
    sunIcon.style.display = isDarkMode ? 'none' : 'block';
    moonIcon.style.display = isDarkMode ? 'block' : 'none';
}

// Extract variables from prompt text
function extractVariables(text) {
    const variables = [];
    const regex = /\${([^:}]+)(?::([^}]*))?}/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        const [, variable, defaultValue] = match;
        variables.push({ name: variable.trim(), default: defaultValue ? defaultValue.trim() : '' });
    }
    
    return [...new Set(variables.map(v => JSON.stringify(v)))].map(v => JSON.parse(v));
}

// Create variable input form
function createVariableInputs(variables, container) {
    const form = document.createElement('div');
    form.className = 'variable-form';
    
    variables.forEach(variable => {
        const wrapper = document.createElement('div');
        wrapper.className = 'variable-input-wrapper';
        
        const label = document.createElement('label');
        label.textContent = variable.name;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'variable-input';
        input.placeholder = variable.default || `Enter ${variable.name}`;
        input.dataset.variable = variable.name;
        input.dataset.default = variable.default || '';
        
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        form.appendChild(wrapper);
    });
    
    container.appendChild(form);
    return form;
}

// Update prompt preview with variable values
function updatePromptPreview(promptText, form) {
    const variables = extractVariables(promptText);
    
    if (variables.length === 0) {
        return promptText;
    }
    
    let previewText = promptText;
    
    if (!form) {
        variables.forEach(variable => {
            const pattern = new RegExp(`\\$\\{${variable.name}[^}]*\\}`, 'g');
            const replacement = variable.default || `<b>${variable.name}</b>`;
            previewText = previewText.replace(pattern, replacement);
        });
    } else {
        const inputs = form.querySelectorAll('.variable-input');
        inputs.forEach(input => {
            const value = input.value.trim();
            const variable = input.dataset.variable;
            const defaultValue = input.dataset.default;
            const pattern = new RegExp(`\\$\\{${variable}[^}]*\\}`, 'g');
            
            const replacement = value || defaultValue || variable;
            previewText = previewText.replace(pattern, `<b>${replacement}</b>`);
        });
    }
    
    return previewText;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode
    const isDarkMode = localStorage.getItem('dark-mode');
    const toggle = document.querySelector('.dark-mode-toggle');
    const sunIcon = toggle.querySelector('.sun-icon');
    const moonIcon = toggle.querySelector('.moon-icon');
    
    if (isDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
    
    // Initialize language and tone selectors
    initializeLanguageAndTone();
    
    // Initialize audience selector
    const audienceSelect = document.getElementById('audienceSelect');
    const initialAudience = localStorage.getItem('audience') || 'everyone';
    audienceSelect.value = initialAudience;
    
    audienceSelect.addEventListener('change', (e) => {
        localStorage.setItem('audience', e.target.value);
        filterPrompts();
    });
    
    // Load prompts
    loadPrompts();
    
    // Initialize search
    initializeSearch();
    
    // Initialize platform selector
    initializePlatformSelector();
});

function initializeLanguageAndTone() {
    const languageSelect = document.getElementById('languageSelect');
    const customLanguage = document.getElementById('customLanguage');
    const toneSelect = document.getElementById('toneSelect');
    const customTone = document.getElementById('customTone');
    
    const savedLanguage = localStorage.getItem('selected-language');
    const savedCustomLanguage = localStorage.getItem('custom-language');
    const savedTone = localStorage.getItem('selected-tone');
    const savedCustomTone = localStorage.getItem('custom-tone');
    
    if (savedLanguage) {
        languageSelect.value = savedLanguage;
        if (savedLanguage === 'custom' && savedCustomLanguage) {
            customLanguage.value = savedCustomLanguage;
            customLanguage.style.display = 'inline-block';
        }
    }
    
    if (savedTone) {
        toneSelect.value = savedTone;
        if (savedTone === 'custom' && savedCustomTone) {
            customTone.value = savedCustomTone;
            customTone.style.display = 'inline-block';
        }
    }
    
    languageSelect.addEventListener('change', (e) => {
        const isCustom = e.target.value === 'custom';
        customLanguage.style.display = isCustom ? 'inline-block' : 'none';
        localStorage.setItem('selected-language', e.target.value);
        if (!isCustom) {
            customLanguage.value = '';
            localStorage.removeItem('custom-language');
        }
    });
    
    customLanguage.addEventListener('input', (e) => {
        localStorage.setItem('custom-language', e.target.value);
    });
    
    toneSelect.addEventListener('change', (e) => {
        const isCustom = e.target.value === 'custom';
        customTone.style.display = isCustom ? 'inline-block' : 'none';
        localStorage.setItem('selected-tone', e.target.value);
        if (!isCustom) {
            customTone.value = '';
            localStorage.removeItem('custom-tone');
        }
    });
    
    customTone.addEventListener('input', (e) => {
        localStorage.setItem('custom-tone', e.target.value);
    });
}

function initializePlatformSelector() {
    const platformTags = document.querySelectorAll('.platform-tag');
    const selectedPlatform = localStorage.getItem('selected-platform') || 'chatgpt';
    
    platformTags.forEach(tag => {
        if (tag.dataset.platform === selectedPlatform) {
            tag.classList.add('active');
        }
        
        tag.addEventListener('click', () => {
            platformTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            localStorage.setItem('selected-platform', tag.dataset.platform);
        });
    });
}

async function loadPrompts() {
    try {
        const response = await fetch('prompts.csv');
        const csvText = await response.text();
        const prompts = parseCSV(csvText);
        createPromptCards(prompts);
        updatePromptCount(prompts.length, prompts.length);
    } catch (error) {
        console.error('Error loading prompts:', error);
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1)
        .map(line => {
            const values = line.match(/(".*?"|[^,\s]+)(?=\s*,|\s*$)/g) || [];
            const entry = {};
            
            headers.forEach((header, index) => {
                let value = values[index] ? values[index].replace(/"/g, '').trim() : '';
                if (header === 'for_devs') {
                    value = value.toUpperCase() === 'TRUE';
                }
                entry[header] = value;
            });
            
            return entry;
        })
        .filter(entry => entry.act && entry.prompt);
}

function createPromptCards(prompts) {
    const container = document.querySelector('.container-lg.markdown-body');
    const promptsGrid = document.createElement('div');
    promptsGrid.className = 'prompts-grid';
    
    const audience = document.getElementById('audienceSelect').value;
    
    prompts.forEach(prompt => {
        if (audience === 'developers' && !prompt.for_devs) {
            return;
        }
        
        const card = document.createElement('div');
        card.className = 'prompt-card';
        
        card.innerHTML = `
            <div class="prompt-title">
                ${prompt.act}
                <div class="action-buttons">
                    <button class="chat-button" title="Open in AI Chat">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                    <button class="copy-button" title="Copy prompt">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <p class="prompt-content">${updatePromptPreview(prompt.prompt)}</p>
            <a href="https://github.com/f" class="contributor-badge" target="_blank" rel="noopener">@f</a>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.copy-button') && !e.target.closest('.chat-button') && !e.target.closest('.contributor-badge')) {
                showModal(prompt.act, prompt.prompt);
            }
        });
        
        const copyButton = card.querySelector('.copy-button');
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            copyPrompt(copyButton, prompt.prompt);
        });
        
        const chatButton = card.querySelector('.chat-button');
        chatButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openInChat(prompt.prompt);
        });
        
        promptsGrid.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(promptsGrid);
}

function showModal(title, content) {
    let modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;
    
    const modalTitle = modalOverlay.querySelector('.modal-title');
    const modalContent = modalOverlay.querySelector('.modal-content');
    const modalCopyButton = modalOverlay.querySelector('.modal-copy-button');
    const modalClose = modalOverlay.querySelector('.modal-close');
    const modalChatButton = modalOverlay.querySelector('.modal-chat-button');
    
    modalTitle.textContent = title;
    
    const variables = extractVariables(content);
    
    if (variables.length > 0) {
        const variableContainer = document.createElement('div');
        variableContainer.className = 'variable-container';
        const form = createVariableInputs(variables, variableContainer);
        
        const previewText = updatePromptPreview(content, form);
        modalContent.innerHTML = previewText;
        
        form.addEventListener('input', () => {
            const previewText = updatePromptPreview(content, form);
            modalContent.innerHTML = previewText;
            modalChatButton.dataset.content = previewText;
        });
        
        modalContent.parentElement.insertBefore(variableContainer, modalContent);
    } else {
        modalContent.textContent = content;
    }
    
    modalChatButton.dataset.content = content;
    
    modalCopyButton.onclick = () => copyPrompt(modalCopyButton, content);
    modalClose.onclick = hideModal;
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) hideModal();
    };
    
    modalOverlay.style.display = 'flex';
}

function hideModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.style.display = 'none';
        const variableContainer = modalOverlay.querySelector('.variable-container');
        if (variableContainer) {
            variableContainer.remove();
        }
    }
}

function openModalChat() {
    const modalChatButton = document.querySelector('.modal-chat-button');
    if (modalChatButton) {
        const content = modalChatButton.dataset.content;
        openInChat(content);
    }
}

async function copyPrompt(button, promptText) {
    try {
        const finalText = buildPrompt(promptText);
        await navigator.clipboard.writeText(finalText);
        
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

function openInChat(promptText) {
    const finalText = buildPrompt(promptText);
    const platform = document.querySelector('.platform-tag.active');
    if (!platform) return;
    
    const baseUrl = platform.dataset.url;
    let url;
    
    switch (platform.dataset.platform) {
        case 'chatgpt':
            url = `${baseUrl}?prompt=${encodeURIComponent(finalText)}`;
            break;
        case 'claude':
            url = `${baseUrl}?q=${encodeURIComponent(finalText)}`;
            break;
        case 'github-copilot':
            url = `${baseUrl}?prompt=${encodeURIComponent(finalText)}`;
            break;
        case 'grok':
            url = `${baseUrl}&q=${encodeURIComponent(finalText)}`;
            break;
        case 'perplexity':
            url = `${baseUrl}/search?q=${encodeURIComponent(finalText)}`;
            break;
        case 'mistral':
            url = `${baseUrl}?q=${encodeURIComponent(finalText)}`;
            break;
        default:
            url = `${baseUrl}?q=${encodeURIComponent(finalText)}`;
    }
    
    window.open(url, '_blank');
}

function buildPrompt(promptText) {
    let finalText = promptText;
    
    const variables = extractVariables(promptText);
    variables.forEach(variable => {
        const pattern = new RegExp(`\\$\\{${variable.name}[^}]*\\}`, 'g');
        finalText = finalText.replace(pattern, variable.default || variable.name);
    });
    
    const languageSelect = document.getElementById('languageSelect');
    const customLanguage = document.getElementById('customLanguage');
    const toneSelect = document.getElementById('toneSelect');
    const customTone = document.getElementById('customTone');
    const audienceSelect = document.getElementById('audienceSelect');
    
    const language = languageSelect.value === 'custom' ? customLanguage.value : languageSelect.value;
    const tone = toneSelect.value === 'custom' ? customTone.value : toneSelect.value;
    const audience = audienceSelect.value;
    
    finalText += ` Reply in ${language} using ${tone} tone for ${audience}.`;
    
    return finalText;
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (!searchTerm) {
            searchResults.innerHTML = '';
            return;
        }
        
        const response = await fetch('prompts.csv');
        const csvText = await response.text();
        const prompts = parseCSV(csvText);
        
        const filtered = prompts.filter(p => 
            p.act.toLowerCase().includes(searchTerm) || 
            p.prompt.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(filtered);
    });
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    
    results.forEach(result => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.textContent = result.act;
        li.addEventListener('click', () => showModal(result.act, result.prompt));
        searchResults.appendChild(li);
    });
}

function updatePromptCount(filtered, total) {
    const promptCount = document.getElementById('promptCount');
    const countLabel = document.querySelector('.count-label');
    
    promptCount.textContent = filtered;
    if (filtered < total) {
        countLabel.textContent = `Found ${filtered} of ${total}`;
    } else {
        countLabel.textContent = 'All Prompts';
    }
}

function filterPrompts() {
    loadPrompts();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideModal();
    }
});
