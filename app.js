document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const autocompleteContainer = document.getElementById('autocomplete');
    const repoList = document.getElementById('repo-list');

    async function fetchRepos(query) {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
        const data = await response.json();
        return data.items;
    }

    function createAutocompleteItem(repo) {
        const item = document.createElement('div');
        item.classList.add('autocomplete-item');
        item.textContent = repo.name;
        item.addEventListener('click', function () {
            addRepoToList(repo);
            clearAutocomplete();
            searchInput.value = '';
        });
        return item;
    }

    function clearAutocomplete() {
        autocompleteContainer.innerHTML = '';
    }

    function addRepoToList(repo) {
        const repoItem = document.createElement('li');
        repoItem.classList.add('repo-item');
        const repoInfo = document.createElement('div');
        repoInfo.classList.add('repo-info');
        repoInfo.innerHTML = `
            <div>Name: ${repo.name}</div>
            <div>Owner: ${repo.owner.login}</div>
            <div>Stars: ${repo.stargazers_count}</div>
        `;

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-repo');
        removeButton.textContent = '✖';
        removeButton.addEventListener('click', function () {
            repoList.removeChild(repoItem);
        });

        repoItem.appendChild(repoInfo);
        repoItem.appendChild(removeButton);
        repoList.appendChild(repoItem);
    }

    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }

    const handleInput = debounce(async function () {
        const query = searchInput.value.trim();
        if (query === '') {
            clearAutocomplete();
            return;
        }

        const repos = await fetchRepos(query);
        clearAutocomplete();

        repos.forEach(repo => {
            const item = createAutocompleteItem(repo);
            autocompleteContainer.appendChild(item);
        });
    }, 300);

    searchInput.addEventListener('input', handleInput);
});
