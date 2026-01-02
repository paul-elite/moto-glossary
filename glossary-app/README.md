# Glossary Application

This project is a simple glossary application built with React and TypeScript. It allows users to create, view, and manage glossary entries, each consisting of a title, description, and rules.

## Features

- **Add Glossary Items**: Users can add new glossary entries through a form.
- **View Glossary List**: All added glossary entries are displayed in a list format.
- **Persistent Storage**: Glossary items are saved in JSON format in local storage, ensuring data persistence across sessions.

## Project Structure

```
glossary-app
├── src
│   ├── components
│   │   ├── GlossaryList.tsx        # Component to display a list of glossary items
│   │   ├── GlossaryItem.tsx        # Component for a single glossary entry
│   │   └── GlossaryItemForm.tsx    # Form for adding new glossary items
│   ├── pages
│   │   └── index.tsx                # Main entry point for the application
│   ├── styles
│   │   └── globals.css              # Global CSS styles
│   ├── utils
│   │   └── storage.ts               # Utility functions for local storage
│   ├── types
│   │   └── index.ts                 # TypeScript types and interfaces
│   ├── App.tsx                      # Main application component
│   └── index.tsx                    # Entry point for the React application
├── public
│   └── index.html                   # Main HTML file
├── package.json                     # npm configuration file
├── tsconfig.json                    # TypeScript configuration file
└── README.md                        # Project documentation
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd glossary-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.