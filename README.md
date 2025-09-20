# Menu Test Suite

This repository contains automated Playwright tests for verifying the **website navigation menu**. The suite is designed to ensure the menu is functionally correct, responsive, accessible, performant, and consistent with expected data.

---

## What is tested

The test coverage is organised into **five suites**, with each targeting:

1. **Functional correctness**
   - Top-level links navigate correctly.
   - Submenus expand and collapse as expected.
   - Submenu items are visible and navigate correctly.

2. **Responsive behaviour**
   - Tests across desktop, tablet and mobile viewports.
   - Burger menu behaviour verified on non-desktop devices.
   - Navigation remains consistent across viewports.

3. **Data consistency**
   - Menu labels and URLs match the expected structure (`menuData.ts`).
   - Checks both top-level and submenu items.

4. **Accessibility**
   - Navigation landmarks (`role="navigation"`, ARIA labels).
   - `aria-expanded` updates correctly when submenus toggle.
   - Keyboard navigation (`Enter`, `ArrowDown`, `Escape`) works as expected.

5. **Performance**
   - Submenu opening times are measured.
   - Submenus must open within the defined threshold (currently **< 3s**).

---

## Why This Approach

I chose this layered approach because:  

- **Functional tests** ensure the menu behaves correctly for all users.
- **Responsive tests** validate behaviour across different devices, a key requirement for customers.
- **Data consistency tests** catch mismatches between menu labels and destination URLs.
- **Accessibility tests** ensure the site is usable for all customers, including screen reader and keyboard users.
- **Performance tests** enforce usability standards by validating acceptable interaction speed.

I've also had only brief encounters with playwright and jest before today and enjoyed the challenge.

---

## Prerequisites

Before running the tests, ensure the following are installed:

1. Node.js
2. Dependencies (Playwright + tools)
   - Install dependencies with:
   ```
   npm install 
   ```
3. Playwright Browsers
   - Playwright requires browser binaries (Chromium, Firefox, WebKit). Install them with:
    ```
    npx playwright install
    ```

---

## How to Run the Tests

### 1. Run all tests
```
npx playwright test
```

### 2. Run a specific suite
```
npx playwright test tests/menu-functional.spec.ts
```

### 3. Run tests with UI (for debugging)
```
npx playwright test --headed
```

### 4. Run tests with Playwright UI (for debugging)
```
npx playwright test --ui
```
