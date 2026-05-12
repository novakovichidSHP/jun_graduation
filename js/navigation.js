/**
 * Навигационная система для выпускного квеста
 * Генерирует меню переключения между классами
 */

(function() {
    'use strict';

    // Константы для CSS классов
    const NAV_CONTAINER_ID = 'class-navigation';
    const NAV_LIST_CLASS = 'nav-list';
    const NAV_ITEM_CLASS = 'nav-item';
    const NAV_LINK_CLASS = 'nav-link';
    const NAV_LINK_ACTIVE_CLASS = 'active';
    const NAV_WRAPPER_CLASS = 'nav-wrapper';

    /**
     * Создает DOM-элемент навигации
     * @param {Array} navigationConfig - Конфигурация навигации из config.js
     * @returns {HTMLElement} Контейнер навигации
     */
    function createNavigation(navigationConfig) {
        // Создаем обертку
        const wrapper = document.createElement('div');
        wrapper.className = NAV_WRAPPER_CLASS;

        // Создаем заголовок
        const title = document.createElement('h2');
        title.textContent = 'Переключение между классами';
        title.style.textAlign = 'center';
        title.style.marginBottom = '1rem';
        title.style.fontSize = '1.2rem';
        title.style.color = '#333';
        wrapper.appendChild(title);

        // Создаем список
        const navList = document.createElement('ul');
        navList.className = NAV_LIST_CLASS;

        // Добавляем элементы навигации
        navigationConfig.forEach(cls => {
            const listItem = document.createElement('li');
            listItem.className = NAV_ITEM_CLASS;

            const link = document.createElement('a');
            link.href = cls.isCurrent ? window.location.href : cls.url;
            link.className = `${NAV_LINK_CLASS} ${cls.isCurrent ? NAV_LINK_ACTIVE_CLASS : ''}`;
            link.textContent = link.href;
            link.title = cls.title;

            if (cls.isCurrent) {
                link.setAttribute('aria-current', 'page');
                link.style.cursor = 'default';
            }

            listItem.appendChild(link);
            navList.appendChild(listItem);
        });

        wrapper.appendChild(navList);
        return wrapper;
    }

    /**
     * Вставляет навигацию в DOM
     */
    function insertNavigation() {
        // Проверяем, не добавлена ли уже навигация
        if (document.getElementById(NAV_CONTAINER_ID)) {
            console.warn('Навигация уже добавлена');
            return;
        }

        // Получаем конфигурацию
        const navigationConfig = window.getNavigationConfig ? window.getNavigationConfig() : [];
        if (!navigationConfig.length) {
            console.error('Конфигурация навигации не найдена');
            return;
        }

        // Создаем контейнер
        const container = document.createElement('div');
        container.id = NAV_CONTAINER_ID;
        container.style.margin = '1rem auto';
        container.style.maxWidth = '800px';
        container.style.padding = '0 1rem';

        // Создаем навигацию
        const navElement = createNavigation(navigationConfig);
        container.appendChild(navElement);

        // Вставляем перед игровым контейнером
        const gameElement = document.getElementById('game');
        if (gameElement && gameElement.parentNode) {
            gameElement.parentNode.insertBefore(container, gameElement);
        } else {
            // fallback: вставляем в начало body
            document.body.insertBefore(container, document.body.firstChild);
        }

        console.log('Навигация успешно добавлена');
    }

    /**
     * Инициализация навигации
     */
    function initNavigation() {
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', insertNavigation);
        } else {
            insertNavigation();
        }
    }

    // Экспорт функций для тестирования
    window.Navigation = {
        createNavigation,
        insertNavigation,
        initNavigation
    };

    // Автоматическая инициализация
    initNavigation();

})();
