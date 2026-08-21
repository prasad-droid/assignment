# Project README

## Setup Instructions

1. Clone the repository

   ```bash
   git clone https://github.com/prasad-droid/assignment.git
   cd <project-folder>
   ```
2. Install dependencies

   ```bash
   npm install
   ```

   If the project uses another package manager, use the appropriate command instead, for example:

   ```bash
   yarn install
   ```
3. Configure environment variables
   Create a `.env` file in the project root and add the required values, for example:

   ```env
   PORT=3000
   DATABASE_URL="INSERT DATABASE URL"
   ```
4. Start the application

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm run build
   npm start
   ```
5. Verify the app
   Open the local URL in a browser, typically:

   ```text
   http://localhost:3000
   ```

## Approach

This project was built using a simple, maintainable structure:

- Clear separation between frontend/backend logic where applicable
- Database-driven storage for persistent data
- Validation and error handling for user input
- Modular code organization to keep features easier to extend
- Focus on functionality first, while keeping the setup straightforward for evaluation

The main goal was to implement the required features reliably, keep the application easy to run locally, and structure the code in a way that is understandable and maintainable.

## Question

If you had 3 more days to develop this application, what would you improve or add, and why?:

- Advanced search/filtering
- Export to PDF/CSV
- Role-based admin controls
- Automated tests for all edge cases
- UI polish and responsive design improvements
- Email notifications / reminder system
- Deployment configuration for cloud hosting

These items were either outside the current scope or were deferred to keep the project focused on the core requirements.

## Notes

- Update the database credentials and env values to match your local environment.
- If the project uses a different framework or language, adjust the installation and startup commands accordingly.
- If you are submitting this for an assignment, include the final app URL or screenshots when required.
