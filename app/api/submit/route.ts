// Prevents cache attempts
// Useful during Docker builds where running access to running DB may be limited
export const dynamic = "force-dynamic";

// Third party
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import moment from "moment";

// Configuration
const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const OPEN_AI_API_TIMEOUT = process.env.OPEN_AI_API_TIMEOUT || "70000"; // Milliseconds
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const MAX_SKILLS_LENGTH = process.env.MAX_SKILLS_LENGTH || "256";
const MAX_JOB_DESCRIPTION_TOKENS =
  process.env.MAX_JOB_DESCRIPTION_TOKENS || "4096";
const MAX_RESPONSE_TOKENS = process.env.MAX_RESPONSE_TOKENS || "1024";
const SYSTEM_MESSAGE = `
  You will be provided with a list of a given job applicant's skills, and with a description of the job they are applying for.

  Your job is to generate a cover letter for the applicant tailored to the job description and the skills the applicant possesses.

  Only skills that are provided should be listed in the cover letter. Skills listed in the job description that are not found in the applicant's skills should not be included in the cover letter.

  Lastly, no contact information should be included in the cover letter. The letter should start with "Dear Hiring Manager," and end with a valediction.
`;

const formDataIsValid = ({
  skills,
  jobDescription,
}: {
  skills: string;
  jobDescription: string;
}) => {
  const requiredFields = {
    skills,
    jobDescription,
  };

  // Ensure required fields have defined values
  if (
    Object.values(requiredFields).some(
      (fieldVal) => typeof fieldVal == "undefined" || fieldVal === ""
    )
  ) {
    return false;
  }

  return true;
};

export async function POST(request: Request) {
  const requestedAt = moment();

  const formData = await request.json();

  if (!formDataIsValid(formData)) {
    return NextResponse.json(
      { error: "Invalid form data provided" },
      { status: 400 }
    );
  }

  if (typeof formData.recaptchaToken == "undefined") {
    return NextResponse.json(
      { error: "No ReCAPTCHA token provided" },
      { status: 400 }
    );
  }

  const formDataTruncated = {
    skills: formData.skills.substring(0, MAX_SKILLS_LENGTH),
    jobDescription: formData.jobDescription.substring(
      0,
      MAX_JOB_DESCRIPTION_TOKENS
    ),
  };

  // Verify reCAPTCHA token
  try {
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${formData.recaptchaToken}`,
      {
        method: "POST",
        cache: "no-cache",
      }
    );

    if (recaptchaResponse.ok) {
      const recaptchaJSON = await recaptchaResponse.json();

      if (recaptchaJSON.success) {
        if (recaptchaJSON.score >= 0.85) {
          try {
            const openAIConfiguration = new Configuration({
              apiKey: OPEN_AI_API_KEY,
            });
            const openai = new OpenAIApi(openAIConfiguration);

            const openAIResponse = await openai.createChatCompletion(
              {
                model: "gpt-3.5-turbo",
                messages: [
                  { role: "system", content: SYSTEM_MESSAGE },
                  {
                    role: "user",
                    content: `Skills: ${formDataTruncated.skills}\n\nJob Description: ${formDataTruncated.jobDescription}`,
                  },
                ],
                temperature: 1,
                max_tokens: parseInt(MAX_RESPONSE_TOKENS),
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
              },
              {
                timeout: parseInt(OPEN_AI_API_TIMEOUT),
              }
            );

            if (
              openAIResponse.statusText === "OK" &&
              openAIResponse.data.choices[0].message
            ) {
              return NextResponse.json(
                {
                  success: "Successful HTTP code from Open AI service",
                  coverLetter: openAIResponse.data.choices[0].message,
                },
                { status: 200 }
              );
            } else if (openAIResponse.status === 429) {
              console.error(
                `${requestedAt} - Open AI service rate limit reached: ${openAIResponse.status}`
              );
              return NextResponse.json(
                {
                  error: "Open AI service rate limit reached",
                },
                { status: 500 }
              );
            } else if (openAIResponse.status === 503) {
              console.error(
                `${requestedAt} - Open AI service currently overloaded: ${openAIResponse.status}`
              );
              return NextResponse.json(
                {
                  error: "Open AI service currently overloaded",
                },
                { status: 500 }
              );
            } else {
              console.error(
                `${requestedAt} - Non-successful HTTP code from Open AI service: ${openAIResponse.status}`
              );
              return NextResponse.json(
                {
                  error: "Non-successful HTTP code from Open AI service",
                },
                { status: 500 }
              );
            }
          } catch (openAIErr) {
            console.error(
              `${requestedAt} - Internal exception during Open AI request: ${openAIErr}`
            );
            return NextResponse.json(
              {
                error: "Internal exception during Open AI request",
              },
              { status: 500 }
            );
          }
        } else {
          console.warn(
            `${requestedAt} - Failed recaptcha verification: score too low ${recaptchaJSON.score}}`
          );
          return NextResponse.json(
            { error: "Failed recaptcha verification" },
            { status: 401 }
          );
        }
      } else {
        console.warn(
          `${requestedAt} - Failed recaptcha verification: ${recaptchaJSON["error-codes"]}`
        );
        return NextResponse.json(
          { error: "Failed recaptcha verification" },
          { status: 401 }
        );
      }
    } else {
      console.error(
        `${requestedAt} - Non-successful HTTP code from recaptcha service: ${recaptchaResponse.status}`
      );
      return NextResponse.json(
        { error: "Non-successful HTTP code from recaptcha service" },
        { status: 500 }
      );
    }
  } catch (recaptchaErr) {
    console.error(
      `${requestedAt} - Internal exception during recaptcha verification: ${recaptchaErr}`
    );
    return NextResponse.json(
      { error: "Internal exception during recaptcha verification" },
      { status: 500 }
    );
  }
}
