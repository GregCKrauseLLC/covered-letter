"use client";

// Third party
import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/base/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Link from 'next/link';
import ReCAPTCHA from "react-google-recaptcha";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Typography from "@mui/material/Typography";

// Local
import styles from "./CoverLetterGenerator.module.css";

export default function CoverLetterGenerator() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  return (
    <>
      <Typography variant="h4" component="div">
        Cover Letter Generator
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          if (recaptchaRef.current) {
            recaptchaRef.current.execute();
          }
        }}
      >
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey="6LfUQEonAAAAAAZJq_iUBaLm2XiAWukPj9MWiMxC"
          onChange={() => alert('Nice!')}
        />
        <FormControl className={styles["form-control"]}>
          <FormLabel>Your Skills</FormLabel>
          <TextareaAutosize
            className={styles.textarea}
            aria-label="skills"
            minRows={2}
            placeholder="Critical thinking, time management, communication..."
          />
        </FormControl>
        <FormControl className={styles["form-control"]}>
          <FormLabel>Job Description</FormLabel>
          <TextareaAutosize
            className={styles.textarea}
            aria-label="job-description"
            minRows={16}
            placeholder="We are looking for a skilled worker who..."
          />
        <Button className={styles.button} type="submit">Submit</Button>
        <Typography variant="caption" component="div" className={styles["recaptcha-disclosure"]}>
          Protected by reCAPTCHA
          <Link className={styles["recaptcha-disclosure-link"]} href="https://policies.google.com/privacy"> - Privacy - </Link>
          <Link className={styles["recaptcha-disclosure-link"]} href="https://policies.google.com/terms">Terms</Link>
        </Typography>
        </FormControl>
      </Box>
    </>
  );
}
