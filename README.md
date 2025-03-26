# Math AI LaTeX Processor

A web application that converts mathematical questions into LaTeX format using the Gemini API.

## Features

- Converts math questions to formatted LaTeX
- Displays both explanation and rendered LaTeX
- Secure API key management
- Responsive design

## Setup Instructions

1. **Get a Gemini API Key**:

   - Obtain an API key from [Google AI Studio](https://aistudio.google.com/)

2. **Configure the Application**:

   - Add your API key to `.env` file:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

3. **Run the Application**:
   - Open `index.html` in a web browser
   - Enter your API key when prompted

## Usage

1. Enter mathematical questions in the input box
2. View:
   - AI explanation
   - Generated LaTeX code
   - Rendered LaTeX output

## Technical Details

### API Integration

- Uses Gemini 2.0 Flash model
- Endpoint: `gemini-2.0-flash`
- Response parsing handles multiple formats

### Dependencies

- MathJax for LaTeX rendering
- Google's Generative AI API

### File Structure

- `index.html` - Main application interface
- `script.js` - Core application logic
- `styles.css` - Styling
- `.env` - API key configuration

## Troubleshooting

**LaTeX not rendering?**

- Check browser console for errors
- Verify MathJax is loading properly

**API errors?**

- Confirm your API key is valid
- Check network connectivity
- Verify you have access to Gemini API

## License

MIT License
