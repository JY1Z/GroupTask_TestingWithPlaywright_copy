# testing-ilry.fi-with-playwright-ssanjz
## Project Participants
- Santtu Saaranen
- Armas Nevolainen
- Jiayue Zheng  
  
## How to Use This Project
This Playwright testing project contains four automated test cases for the website: [https://www.ilry.fi/en/](https://www.ilry.fi/en/)   
The tests cover:
- Reduced motion settings support
- Visual regression of the main menu
- Accessibility of all navigation links
- Searching for salary information for engineers graduating in 2025
### 1. Install dependencies  
```bash
npm install
```  
### 2. Run the test suite (in headless Firefox)
This will execute all tests in tests/ using headless mode with Firefox only, as required.  
```bash
npm test
```
### 3. View test results
After the tests finish, Playwright will generate a detailed HTML report. To open it:  
```bash
 npx playwright show-report
```
### 4. Visual regression snapshots (Git LFS)  
If cloning the repo, make sure to enable Git LFS to fetch the .png snapshots:  
```bash
git lfs install
```
