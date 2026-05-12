# Dynamic URL Generation and Navigation System Design

## Project Overview
The graduation project consists of three class pages (J3, J4, P3) with links resolved relative to the current project URL:
- J3: `j3/`
- J4: `j4/`
- P3: `p3/`

Each page currently has:
1. Hardcoded certificate link: `https://lms.informatics.ru/pupil/download_center/`
2. No navigation between class pages
3. Static HTML files with shared JavaScript (`main.js`)

## Design Goals
1. **Dynamic Certificate Links**: Generate certificate URLs based on current page URL (while keeping the same destination)
2. **Class Navigation**: Add navigation between J3, J4, and P3 pages
3. **Maintainability**: Centralized configuration for easy updates
4. **Scalability**: Support for additional class pages in the future
5. **Environment Awareness**: Handle both local development and GitHub Pages deployment

## Architecture Overview

### Current Architecture
```
jun_graduation/
├── j3/index.html
├── j4/index.html
├── p3/index.html
├── js/main.js
├── css/
├── assets/
└── db/db_module.json
```

### Proposed Architecture
Add:
- `js/config.js` - Environment and URL configuration
- `js/navigation.js` - Navigation system logic
- Update `main.js` to use dynamic URL generation
- Update HTML files to include navigation components

## URL Detection Mechanism

### Detection Logic
The current class can be determined from:
1. **URL Path Analysis**: Extract class identifier from `window.location.pathname`
2. **HTML Data Attribute**: Use existing `data-class` attribute on buttons
3. **Directory Structure**: Infer from file location

**Recommended Approach**: URL path analysis for flexibility across environments.

```javascript
// Detection function
function detectCurrentClass() {
    const path = window.location.pathname;
    // Match patterns: /jun_graduation/j3/, /j3/, /j3/index.html
    const match = path.match(/\/(j3|j4|p3)(?:\/|$|index\.html)/);
    return match ? match[1] : 'j3'; // Default fallback
}
```

## Dynamic Certificate URL Generation

### Certificate URL Structure
The certificate URL remains constant: `https://lms.informatics.ru/pupil/download_center/`

**Dynamic Generation Approach**:
1. Store base URL in configuration
2. Generate link dynamically in JavaScript
3. Update DOM on page load or game completion

```javascript
// Configuration
const CERTIFICATE_BASE_URL = 'https://lms.informatics.ru/pupil/download_center/';

// Generation function
function generateCertificateUrl() {
    return CERTIFICATE_BASE_URL;
    // Future: could append query parameters if needed
    // return `${CERTIFICATE_BASE_URL}?class=${currentClass}`;
}
```

### Implementation Strategy
1. **Remove hardcoded links** from HTML
2. **Add placeholder elements** with IDs for JavaScript to populate
3. **Initialize on DOMContentLoaded** to set correct URLs

## Navigation System Design

### Navigation Requirements
1. **Between Class Pages**: J3 ↔ J4 ↔ P3
2. **Consistent Placement**: Header or footer navigation
3. **Visual Indicators**: Highlight current page
4. **Responsive Design**: Mobile-friendly navigation

### Navigation Structure
```
[ J3 ] [ J4 ] [ P3 ]
```

### Implementation Approaches

#### Option 1: JavaScript-Generated Navigation
- Generate navigation dynamically based on available classes
- Insert into each page via JavaScript
- Centralized configuration in `config.js`

#### Option 2: HTML Template with Includes
- Create navigation HTML template
- Use build process or JavaScript to include
- Simpler but less dynamic

#### Option 3: Server-Side Includes (Not applicable for GitHub Pages)
- Not feasible for static hosting

**Recommended**: Option 1 - JavaScript-generated navigation for maximum flexibility.

### Navigation Configuration
```javascript
// config.js
const CLASS_PAGES = [
    { id: 'j3', name: 'J3 Class', path: '/jun_graduation/j3/' },
    { id: 'j4', name: 'J4 Class', path: '/jun_graduation/j4/' },
    { id: 'p3', name: 'P3 Class', path: '/jun_graduation/p3/' }
];

// Environment-aware base paths
const BASE_PATHS = {
    development: '/jun_graduation/',
    production: '/jun_graduation/'
};
```

## Configuration Strategy

### Environment Detection
```javascript
function getEnvironment() {
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        return 'development';
    }
    return 'production';
}
```

### Configuration File Structure
```javascript
// js/config.js
const CONFIG = {
    environment: getEnvironment(),
    basePath: getBasePath(),
    classes: ['j3', 'j4', 'p3'],
    certificateUrl: 'https://lms.informatics.ru/pupil/download_center/'
};

function getBasePath() {
    const env = getEnvironment();
    return env === 'development' ? '/jun_graduation/' : '/jun_graduation/';
}
```

## Implementation Steps

### Phase 1: Configuration and Detection
1. Create `js/config.js` with environment and URL configuration
2. Create `js/navigation.js` with navigation generation logic
3. Update `main.js` to use dynamic class detection

### Phase 2: Certificate Link Updates
1. Modify HTML files to remove hardcoded certificate links
2. Add ID to certificate link elements: `id="certificate-link"`
3. Update `main.js` to populate certificate links dynamically
4. Ensure links work in both game completion and direct access

### Phase 3: Navigation Implementation
1. Design navigation component HTML/CSS
2. Implement navigation generation in `navigation.js`
3. Add navigation container to each HTML file
4. Style navigation to match existing design

### Phase 4: Testing and Validation
1. Test local development environment
2. Test GitHub Pages deployment
3. Validate navigation between pages
4. Verify certificate links work correctly

## Detailed Implementation Plan

### Step 1: Create Configuration Module
File: `jun_graduation/js/config.js`
```javascript
/**
 * Configuration for dynamic URL generation and navigation
 */

// Environment detection
function getEnvironment() {
    const hostname = window.location.hostname;
    return (hostname === 'localhost' || hostname === '127.0.0.1') 
        ? 'development' 
        : 'production';
}

// Base path configuration
const CONFIG = {
    environment: getEnvironment(),
    basePath: '/jun_graduation/',
    
    // Available classes
    classes: [
        { id: 'j3', name: 'J3 Class', path: 'j3/' },
        { id: 'j4', name: 'J4 Class', path: 'j4/' },
        { id: 'p3', name: 'P3 Class', path: 'p3/' }
    ],
    
    // Certificate URL (remains constant)
    certificateUrl: 'https://lms.informatics.ru/pupil/download_center/',
    
    // Internal page URLs are generated relative to the current URL
};

// Export configuration
window.APP_CONFIG = CONFIG;
```

### Step 2: Create Navigation Module
File: `jun_graduation/js/navigation.js`
```javascript
/**
 * Navigation system for class pages
 */

function generateNavigation(currentClass) {
    const nav = document.createElement('nav');
    nav.className = 'class-navigation';
    
    const ul = document.createElement('ul');
    
    window.APP_CONFIG.classes.forEach(cls => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.href = new URL(`../${cls.id}/`, window.location.href).href;
        a.textContent = cls.name;
        
        if (cls.id === currentClass) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
        }
        
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    nav.appendChild(ul);
    return nav;
}

function initializeNavigation() {
    const currentClass = detectCurrentClass();
    const navContainer = document.getElementById('navigation-container');
    
    if (navContainer) {
        const navigation = generateNavigation(currentClass);
        navContainer.appendChild(navigation);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    initializeNavigation();
}
```

### Step 3: Update Main.js
File: `jun_graduation/js/main.js`
Add at the beginning:
```javascript
// Import configuration (ensure config.js is loaded first)
if (typeof window.APP_CONFIG === 'undefined') {
    console.warn('APP_CONFIG not found. Using defaults.');
    window.APP_CONFIG = {
        certificateUrl: 'https://lms.informatics.ru/pupil/download_center/'
    };
}

// Enhanced class detection
function detectCurrentClass() {
    // Try to get from button data-class first (existing approach)
    const btn = document.querySelector('button');
    if (btn && btn.dataset.class) {
        return btn.dataset.class;
    }
    
    // Fallback to URL detection
    const path = window.location.pathname;
    const match = path.match(/\/(j3|j4|p3)(?:\/|$|index\.html)/);
    return match ? match[1] : 'j3';
}

// Update the existing classCode variable
const classCode = detectCurrentClass();
```

Update the `finishGame` function to use dynamic certificate URL:
```javascript
const finishGame = () => {
    document.querySelector('#game').classList.add('hidden');
    document.querySelector('.finish-wrap').classList.remove('hidden');
    document.querySelector('.finish-wrap').classList.add('open');
    
    // Update certificate link dynamically
    const certLink = document.querySelector('#certificate-link');
    if (certLink) {
        certLink.href = window.APP_CONFIG.certificateUrl;
    }
};
```

### Step 4: Update HTML Files
For each HTML file (j3/index.html, j4/index.html, p3/index.html):

1. **Add navigation container** (in header or before game section):
```html
<header>
    <div id="navigation-container"></div>
</header>
```

2. **Update certificate link** to have ID and remove hardcoded href:
```html
<p>За прохождение квеста ты получаешь диплом выпускника!<br>
Его можно найти <a id="certificate-link" href="https://lms.informatics.ru/pupil/download_center/" target="_blank">ЗДЕСЬ</a></p>
```

3. **Update script loading order**:
```html
<script src="../js/config.js"></script>
<script src="../js/navigation.js"></script>
<script src="../js/main.js"></script>
```

### Step 5: Add CSS for Navigation
File: `jun_graduation/css/style-main.css` (add to end):
```css
/* Navigation Styles */
.class-navigation {
    background-color: #f8f9fa;
    padding: 1rem;
    border-bottom: 2px solid #dee2e6;
    margin-bottom: 2rem;
}

.class-navigation ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.class-navigation a {
    text-decoration: none;
    color: #495057;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.class-navigation a:hover {
    background-color: #e9ecef;
    color: #212529;
}

.class-navigation a.active {
    background-color: #007bff;
    color: white;
}

.class-navigation a.active:hover {
    background-color: #0056b3;
}

/* Responsive navigation */
@media (max-width: 768px) {
    .class-navigation ul {
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }
    
    .class-navigation a {
        display: block;
        width: 200px;
        text-align: center;
    }
}
```

## Testing Approach

### Test Cases
1. **URL Detection**
   - Navigate to each class page
   - Verify correct class detection
   - Test with trailing slashes and index.html

2. **Certificate Links**
   - Complete game on each page
   - Verify certificate link points to correct URL
   - Test direct page access

3. **Navigation System**
   - Verify navigation appears on all pages
   - Test links between pages
   - Verify active page highlighting
   - Test responsive design

4. **Environment Handling**
   - Test locally (development)
   - Test on GitHub Pages (production)
   - Verify correct base paths

### Testing Methodology
1. **Manual Testing**: Navigate through all pages and features
2. **Console Verification**: Check JavaScript console for errors
3. **Link Validation**: Verify all links are functional
4. **Cross-browser Testing**: Test in Chrome, Firefox, Safari

## Deployment Considerations

### GitHub Pages
- Configuration uses relative paths that work with GitHub Pages
- Base path `/jun_graduation/` works for both environments
- No build process required - static files only

### Local Development
- Serve from `jun_graduation/` directory
- Use local server (e.g., `python -m http.server`)
- Test navigation and links locally

### Future Scalability
- Add new class pages by updating `CONFIG.classes`
- Support for additional languages or features
- Analytics integration for tracking navigation

## Risk Mitigation

### Potential Issues
1. **JavaScript Dependency**: Navigation requires JavaScript
   - Mitigation: Provide fallback or server-side option if critical
   
2. **URL Detection Failures**: Incorrect class detection
   - Mitigation: Multiple detection methods with fallbacks
   
3. **CSS Conflicts**: Navigation styles affecting existing design
   - Mitigation: Use specific CSS classes and test thoroughly

### Fallback Strategies
1. **Certificate Links**: Keep hardcoded as fallback if JavaScript fails
2. **Navigation**: Provide simple HTML navigation as fallback
3. **Class Detection**: Use HTML `data-*` attributes as primary source

## Conclusion

This design provides a maintainable, scalable solution for dynamic URL generation and navigation. The implementation separates concerns through configuration files, maintains backward compatibility, and works across both development and production environments.

The solution addresses all requirements:
1. ✅ Dynamic certificate links based on current URL
2. ✅ Navigation between class pages
3. ✅ Maintainable and scalable architecture
4. ✅ Environment-aware configuration

Next steps: Implement the solution in Code mode, then test thoroughly before deployment.
