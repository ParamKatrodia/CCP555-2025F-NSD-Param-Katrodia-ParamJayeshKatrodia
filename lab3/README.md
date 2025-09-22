# Lab 3 – CI/CD, ESLint, and Unit Testing  

This lab demonstrates:  
- Setting up **GitHub Actions CI** to run ESLint and Jest tests.  
- Writing unit tests for API responses and the Express app.  
- Configuring test users with **Basic Auth**.  
- Verifying CI failures and successes for both **ESLint** and **Unit Tests**.  
- Generating a **test coverage report** to validate the 404 handler in `app.js`.  

---

## Setup  

1. Install dependencies:
   ```bash
   npm install

2. Run ESLint:
   npm run lint

3. Run Unit Tests:
   npm test

4. Run Tests with Coverage:
   npm test -- --coverage

## GitHub Actions

This project includes a CI workflow in .github/workflows/ci.yml that runs:

npm run lint

npm test

The workflow ensures that commits pass linting and unit tests before merging.

## Test Coverage

Open the coverage report in your browser:

lab3/coverage/lcov-report/src/app.js.html


It shows which lines of app.js are covered (green) and which are not (red).   
