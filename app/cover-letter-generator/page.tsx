// Local
import ResponsiveDrawer from "../../components/responsive-drawer/ResponsiveDrawer";
import CoverLetterGenerator from "../../components/cover-letter-generator/CoverLetterGenerator";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={"main"}>
      <ResponsiveDrawer currentTab={"Cover Letter Generator"}>
        <CoverLetterGenerator />
      </ResponsiveDrawer>
    </main>
  );
}
