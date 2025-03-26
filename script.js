// Store API key
let GEMINI_API_KEY = '';

// Function to set API key
function setApiKey(key) {
    GEMINI_API_KEY = key;
    localStorage.setItem('gemini_api_key', key);
    document.getElementById('apiKeyForm').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

// Function to call Gemini API
async function callGeminiAPI(question) {
    if (!GEMINI_API_KEY) {
        return {
            text: 'Please set your API key first.',
            latex: ''
        };
    }

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Please convert this mathematical question into LaTeX format and provide an explanation. 

Question: ${question}

Your response MUST be formatted exactly like this:
Explanation: [clear explanation here]

LaTeX Code: 
\\[
[valid LaTeX code here]
\\]

Include both the explanation and LaTeX code in your response.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 8192
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;
        
        // Robust parsing of response
        let explanation = '';
        let latexCode = '';

        // First try strict pattern matching
        const explanationMatch = responseText.match(/Explanation:\s*(.*?)(?=LaTeX Code:|$)/s);
        const latexMatch = responseText.match(/LaTeX Code:\s*\\\[([\s\S]*?)\\\]/s);

        if (explanationMatch) explanation = explanationMatch[1].trim();
        if (latexMatch) latexCode = `\\[${latexMatch[1].trim()}\\]`;

        // Fallback patterns if strict matching fails
        if (!latexCode) {
            const fallbackLatexMatch = responseText.match(/\\\[([\s\S]*?)\\\]/);
            if (fallbackLatexMatch) latexCode = fallbackLatexMatch[0];
        }

        // Final fallback - use entire response if no LaTeX found
        if (!latexCode) {
            explanation = responseText;
        }

        return {
            text: explanation,
            latex: latexCode
        };
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return {
            text: `Error: ${error.message}`,
            latex: ''
        };
    }
}

// Function to process the user's question
async function processQuestion() {
    const userInput = document.getElementById('userInput').value.trim();
    
    if (!userInput) {
        alert('Please enter a mathematical question');
        return;
    }

    // Show loading state
    const aiResponseElement = document.getElementById('aiResponse');
    const latexCodeElement = document.getElementById('latexCode');
    const renderedLatexElement = document.getElementById('renderedLatex');
    
    aiResponseElement.textContent = 'Processing...';
    latexCodeElement.textContent = '';
    renderedLatexElement.textContent = '';

    try {
        // Get the response from Gemini
        const response = await callGeminiAPI(userInput);

        // Display the AI response
        aiResponseElement.textContent = response.text;

        // Display the LaTeX code
        latexCodeElement.textContent = response.latex;

        // Display the rendered LaTeX
        renderedLatexElement.innerHTML = response.latex;

        // Trigger MathJax to reprocess the page
        if (window.MathJax && response.latex) {
            MathJax.typesetPromise([renderedLatexElement]).catch((err) => {
                console.error('MathJax error:', err);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        aiResponseElement.textContent = 'An error occurred while processing your request.';
    }
}

// Check for saved API key on page load
window.onload = function() {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        setApiKey(savedKey);
    }
};

// Add event listener for Enter key in textarea
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        processQuestion();
    }
});
