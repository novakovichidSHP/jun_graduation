/**
 * Конфигурация навигации между классами
 * Используется для генерации навигационного меню
 */

const CLASSES_CONFIG = [
    {
        id: 'j3',
        name: 'J3',
        title: 'Класс J3',
        isCurrent: false
    },
    {
        id: 'j4',
        name: 'J4',
        title: 'Класс J4',
        isCurrent: false
    },
    {
        id: 'p3',
        name: 'P3',
        title: 'Класс P3',
        isCurrent: false
    }
];

/**
 * Базовый URL для скачивания сертификатов
 */
const CERTIFICATE_BASE_URL = 'https://lms.informatics.ru/pupil/download_center/';

/**
 * Генерирует URL сертификата на основе текущего класса
 * @returns {string} URL для скачивания сертификата
 */
function generateCertificateUrl() {
    // В будущем можно добавить параметры класса, если потребуется
    // const currentClass = getCurrentClassId();
    // return `${CERTIFICATE_BASE_URL}?class=${currentClass}`;
    return CERTIFICATE_BASE_URL;
}

/**
 * Определяет текущий класс на основе URL страницы
 * @returns {string} ID текущего класса (j3, j4, p3)
 */
function getCurrentClassId() {
    const path = window.location.pathname;
    if (path.includes('/j3/')) return 'j3';
    if (path.includes('/j4/')) return 'j4';
    if (path.includes('/p3/')) return 'p3';
    // fallback для локального тестирования
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('class') || 'j3';
}

/**
 * Генерирует URL страницы класса относительно текущего URL
 * @param {string} classId - ID класса (j3, j4, p3)
 * @returns {string} URL страницы класса
 */
function generateClassUrl(classId) {
    return new URL(`../${classId}/`, window.location.href).href;
}

/**
 * Возвращает конфигурацию с пометкой текущего класса
 * @returns {Array} Обновленный массив конфигурации
 */
function getNavigationConfig() {
    const currentClassId = getCurrentClassId();
    return CLASSES_CONFIG.map(cls => ({
        ...cls,
        url: generateClassUrl(cls.id),
        isCurrent: cls.id === currentClassId
    }));
}

/**
 * Обновляет ссылку на сертификат в DOM
 */
function updateCertificateLink() {
    const link = document.getElementById('certificate-link');
    if (link) {
        link.href = generateCertificateUrl();
        // Для отладки можно добавить data-атрибут с классом
        link.setAttribute('data-class', getCurrentClassId());
    }
}

// Инициализация после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCertificateLink);
} else {
    updateCertificateLink();
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CLASSES_CONFIG, getCurrentClassId, generateClassUrl, getNavigationConfig, CERTIFICATE_BASE_URL, generateCertificateUrl, updateCertificateLink };
}
