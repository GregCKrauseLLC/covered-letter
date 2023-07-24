"use client";

// Third party
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/base/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Image from "next/image";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Typography from "@mui/material/Typography";

// Local
import styles from "./CoverLetterGenerator.module.css";

export default function CoverLetterGenerator() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [step, setStep] = useState("input"); // ['input', 'loading', 'review']

  const handleRecaptchaResponse = (recaptchaToken: string) => {
    setStep("loading");

    fetch("/api/submit", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skills,
        jobDescription,
        recaptchaToken,
      }),
    })
      .then((response) => {
        response.json().then((json) => {
          if (response.ok) {
            if (json.success) {
              setCoverLetter(json.coverLetter.content);
              setStep("review");
            } else {
              alert(
                "There was a problem processing your request. Please try again later."
              );
              setStep("input");
            }
          } else if (json.error) {
            alert(
              `There was a problem processing your request. ${json.error}.`
            );
            setStep("input");
          } else {
            alert(
              "There was a problem processing your request. Please try again later."
            );
            setStep("input");
          }
        });
      })
      .catch((_err) => {
        alert(
          "There was a problem processing your request. Please try again later."
        );
        setStep("input");
      });
  };

  return (
    <>
      <Typography variant="h4" component="div">
        Cover Letter Generator
      </Typography>
      {step === "loading" ? (
        <div className={styles["loading-gif-wrapper"]}>
          <Image
            src="/loading.gif"
            alt="loading GIF"
            height={291}
            width={441}
          />
        </div>
      ) : step === "input" ? (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            recaptchaRef.current!.execute();
          }}
        >
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey="6LfUQEonAAAAAAZJq_iUBaLm2XiAWukPj9MWiMxC"
            onChange={(token) => {
              if (token) {
                handleRecaptchaResponse(token);
              } else {
                alert(
                  "There was a problem processing your request. Please try again later."
                );
              }
            }}
          />
          <FormControl className={styles["form-control"]}>
            <FormLabel>Your Skills</FormLabel>
            <TextareaAutosize
              className={styles.textarea}
              aria-label="skills"
              minRows={2}
              maxLength={512}
              placeholder="Critical thinking, time management, communication..."
              value={skills}
              onChange={(e) => {
                setSkills((e.target as HTMLElement).value);
              }}
            />
          </FormControl>
          <FormControl className={styles["form-control"]}>
            <FormLabel>Job Description</FormLabel>
            <TextareaAutosize
              className={styles.textarea}
              aria-label="job-description"
              minRows={16}
              maxLength={8192}
              placeholder="We are looking for a skilled worker who..."
              value={jobDescription}
              onChange={(e) => {
                setJobDescription((e.target as HTMLElement).value);
              }}
            />
            <Button className={`${styles["button"]} ${styles["button-primary"]}`} type="submit">
              Submit
            </Button>
            {coverLetter
              ? (
                <Button className={`${styles["button"]} ${styles["button-secondary"]}`} onClick={() => {setStep('review')}}>
                  See Last Cover Letter
                </Button>
              ) : (<></>)
            }
            <Typography
              variant="caption"
              component="div"
              className={styles["recaptcha-disclosure"]}
            >
              Protected by reCAPTCHA
              <Link
                className={styles["recaptcha-disclosure-link"]}
                href="https://policies.google.com/privacy"
              >
                {" "}
                - Privacy -{" "}
              </Link>
              <Link
                className={styles["recaptcha-disclosure-link"]}
                href="https://policies.google.com/terms"
              >
                Terms
              </Link>
            </Typography>
          </FormControl>
        </Box>
      ) : step === "review" ? (
        <Box component="form" noValidate autoComplete="off">
          <FormControl className={styles["form-control"]}>
            <FormLabel>Cover Letter</FormLabel>
            <TextareaAutosize
              className={styles.textarea}
              aria-label="cover letter"
              minRows={16}
              maxLength={8192}
              value={coverLetter}
              readOnly
            />
            <Button
              className={`${styles.button} ${styles["button-primary"]}`}
              onClick={() => {
                setStep("input");
              }}
            >
              Back
            </Button>
          </FormControl>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
