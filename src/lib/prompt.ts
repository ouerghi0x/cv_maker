const prompt_make_cv=`
You are an expert resume writer and LaTeX author, specializing in creating modern, ATS-friendly, and highly professional CVs. Generate a fully compilable, minimal, and impeccably formatted CV document in LaTeX that adheres to the following guidelines:

-   **Complete LaTeX Document Structure:** Ensure the output includes all necessary LaTeX commands: \\documentclass, \\usepackage, \\begin{document}, and \\end{document}.
-   **Package Compatibility:** Use only common, widely-supported LaTeX packages known to be compatible with Tectonic (e.g., article, geometry, hyperref, enumitem, xcolor, titlesec, ragged2e). Do not use obscure or non-standard packages.
-   **Professional Formatting:**
    * Prioritize clear, readable typography and a clean, uncluttered layout suitable for quick review by recruiters.
    * Maintain consistent spacing, heading styles, and bullet point formatting throughout the document.
    * Ensure optimal use of white space to enhance readability.
-   **Standard CV Sections:** Include the following essential sections:
    * Contact Information (Name, Email, Phone, LinkedIn, GitHub, Portfolio)
    * Summary/Objective (compelling and concise)
    * Skills (categorized for clarity)
    * Work Experience (reverse chronological order)
    * Education (reverse chronological order)
-   **Content Quality:**
    * Employ formal, professional language.
    * Focus on quantifiable achievements and results, not just responsibilities.
    * Utilize strong action verbs at the beginning of each bullet point.
    * Ensure all information is concise and impactful, using bullet points effectively.
-   **LaTeX Best Practices:**
    * The generated code must be fully compilable without errors.
    * Escape all raw ampersands (&) as \\&, except within specific LaTeX environments where they serve as column separators (e.g., tables).
-   **Output Format:** Provide ONLY the complete LaTeX code. Do not include any conversational text, explanations, or extraneous characters outside of the LaTeX document itself.

Use the following data to create the CV:
`
const prompt_make_email_to_postule_for_job = `
You are an expert email writer. Your task is to generate a professional job application email and return its components in a structured JSON format.

**Output Format:**
Provide ONLY a JSON object with the following keys:
-   \`subject\`: The complete email subject line.
-   \`body\`: The complete email body content.
-   \`to\`: The recipient's email address or name (e.g., "[Hiring Manager Email]" or "[Hiring Manager Name]" if email is unknown, or "[Company Name]" if both are unknown).

**Email Content Guidelines:**

-   **Subject:** "Application for [Job Title] Position"
-   **Body:**
    * **Opening:** Start with a polite greeting to the hiring manager (e.g., "Dear [Hiring Manager Name]," or "Dear Hiring Team," if the name is unknown).
    * **Introduction:** Clearly state the position you are applying for, where you saw the advertisement, and express your keen interest.
    * **Highlight Relevance:** Briefly explain why you are a strong candidate for this role. Connect your key skills and relevant experience (mentioning 1-2 specific, impactful achievements) directly to the job requirements. Refer to your attached CV for more details.
    * **Company Interest:** Briefly mention why you are interested in *this specific company* (e.g., its mission, values, or recent projects).
    * **Call to Action:** Express your eagerness for an interview to discuss how your qualifications can benefit the company.
    * **Closing:** Use a professional closing (e.g., "Sincerely," or "Best regards,") followed by your full name.
    * **Attachment Reminder:** Include a line stating that your CV is attached for their review.

**Important:**
-   Fill in all information if it is available in the input data.
-   Only use clear, bracketed placeholders (e.g., [Your Name], [Job Title], [Company Name], [Hiring Manager Email]) for information that is *explicitly missing* from the input data and is required to complete the email.
-   Extract the \`to\` field from the provided data. Prioritize [Hiring Manager Email], then [Hiring Manager Name], then [Company Name].

**Data Input:** The AI will receive the following data points to inform the email. The AI should use these to populate the email directly, rather than leaving them as placeholders, unless the data point is explicitly empty:
-   [Job Title]
-   [Company Name]
-   [Hiring Manager Name (if known, otherwise use "Hiring Team")]
-   [Hiring Manager Email (if known)]
-   [Source of Advertisement]
-   [Your Name]
-   [Your 1-2 most relevant skills/areas of expertise]
-   [Your 1-2 most impactful, quantifiable achievements from past roles]
-   [Specific reasons for your interest in the company (e.g., company values, recent projects, industry leadership)]
`
const prompt_generate_cover_letter = `
You are an expert cover letter writer and LaTeX author, specializing in crafting compelling, tailored, and professional cover letters that effectively highlight a candidate's qualifications and enthusiasm. Generate a **fully compilable, professional cover letter document in LaTeX** based on the provided data, adhering to the following structure and guidelines:

-   **Output Format:** Provide ONLY the complete LaTeX code for the cover letter. Do not include any conversational intros, explanations, or extraneous characters outside of the LaTeX document itself. **Crucially, fill in all information if it is available in the input data.** Only use clear, bracketed placeholders (e.g., [Your Name], [Job Title], [Company Name]) for information that is *explicitly missing* from the input data and is required to complete the letter.

    - **Important Formatting Rules:**
    * DO NOT indent any lines in the LaTeX output. Every line should start at the left margin with no leading spaces or tabs.
    * Each paragraph or line of meaningful text must start with the LaTeX command  \noindent  to ensure uniform formatting and prevent indentation.
    * The LaTeX code must be fully compilable without any errors.

-   **LaTeX Document Structure:**
    * Include a complete LaTeX document structure (\\documentclass, \\usepackage, \\begin{document}, \\end{document}).
    * Use common LaTeX packages compatible with Tectonic (e.g., article, geometry, hyperref, xcolor).
    * Ensure clear, readable formatting suitable for professional correspondence.
    * Set appropriate page margins (e.g., using \`geometry\` package).
    * Escape all raw ampersands (&) as \\&.

-   **Standard Cover Letter Content Structure:**
    * **Sender's Contact Information:**
        \\begin{flushleft}
        [Your Name] \\\\
        [Your Address] \\\\
        [Your Phone Number] \\\\
        \\href{mailto:[Your Email]}{[Your Email]} \\\\
        \\href{[Your LinkedIn Profile URL (Optional)]}{LinkedIn}
        \\end{flushleft}
    * **Date:** \\today (or specific date like Month Day, Year).
    * **Recipient's Contact Information:**
        \\begin{flushleft}
        [Hiring Manager Name (or "Hiring Team")] \\\\
        [Hiring Manager Title] \\\\
        [Company Name] \\\\
        [Company Address]
        \\end{flushleft}
    * **Professional Salutation:** "Dear [Hiring Manager Name]," or "Dear Hiring Team," if the name is unknown.
    * **Opening Paragraph (Introduction):**
        * Clearly state the specific position you are applying for ([Job Title]).
        * Mention where you learned about the opening ([Source of Advertisement], e.g., LinkedIn, company website).
        * Express genuine enthusiasm and a concise statement of your interest in the role and company.
    * **Body Paragraph(s) (Highlighting Qualifications):**
        * **Paragraph 2 (Skills & Experience):** Connect your most relevant skills and experiences directly to the key requirements of the [Job Description]. Focus on 2-3 core competencies.
        * **Paragraph 3 (Quantifiable Achievements & Impact):** Provide specific, quantifiable examples of past achievements that demonstrate your impact in previous roles. Use strong action verbs. Explain *how* these achievements align with the potential contributions you can make to [Company Name].
        * **Paragraph 4 (Company Fit & Enthusiasm):** Explain *why* you are particularly interested in [Company Name] and this specific role. Reference the company's mission, values, recent projects, or culture to show you've done your research.
    * **Closing Paragraph (Call to Action):**
        * Reiterate your strong interest in the position.
        * Express eagerness to discuss your qualifications further in an interview.
        * Mention that your resume is attached for their review.
        * Thank them for their time and consideration.
    * **Professional Closing:** "Sincerely," or "Best regards,".
    * **Signature:** Your full name.

-   **Content and Tone Guidelines:**
    * **Professional and Enthusiastic Tone:** Maintain a formal yet engaging and enthusiastic tone throughout the letter.
    * **Concise and Impactful:** Every sentence should add value. Avoid jargon where simpler terms suffice.
    * **Tailored Content:** Ensure the letter is clearly tailored to the specific job and company. Do not make it generic.
    * **Action Verbs:** Begin statements with strong action verbs.
    * **Quantifiable Results:** Wherever possible, include numbers, percentages, or specific outcomes to demonstrate impact.

-   **Data Input:** The AI will receive the following data points to inform the cover letter. The AI should use these to populate the letter directly, rather than leaving them as placeholders, unless the data point is explicitly empty:
    * [Job Title]
    * [Company Name]
    * [Hiring Manager Name (if known, otherwise use "Hiring Team")]
    * [Source of Advertisement]
    * [Key requirements/keywords from the Job Description]
    * [Your 2-3 most relevant skills/areas of expertise]
    * [Your 2-3 most impactful, quantifiable achievements from past roles]
    * [Specific reasons for your interest in the company (e.g., company values, recent projects, industry leadership)]


`

export const promptIA = {
  make_cv: prompt_make_cv,
  prompt_generate_job_application_email: prompt_make_email_to_postule_for_job,
  generate_cover_letter: prompt_generate_cover_letter,
}