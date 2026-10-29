import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import usePageMeta from "../hooks/usePageMeta";

const details = [
  { label: "Program", value: "Software Analysis and Development (3466048)" },
  { label: "Subject", value: "English" },
  { label: "Phase", value: "Phase 2 — Planning" },
  { label: "Project activity", value: "Project Activity 4" },
  { label: "Learning activity", value: "Blog — GA4-240202501-AA1-EV03" },
  { label: "Training center", value: "Centro Agropecuario La Granja — SENA, 2026" },
];

const About = () => {
  usePageMeta({
    title: "About Activity",
    description:
      "Academic information about the English course blog: program, competency, learning activity, apprentice, instructor, and training center.",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 py-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-primary mb-2">
            GA4-240202501-AA1-EV03
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-700">
            About <span className="text-primary/75">Activity</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-2xl">
            This page summarizes the academic activity behind this blog: the program, the
            competency to develop, the learning activity and the people involved.
          </p>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-5 sm:p-7 mb-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Competency</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Interacting in English—orally and in writing—within social and professional
            contexts, in accordance with the criteria established by the Common European
            Framework of Reference for Languages (240202501).
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {details.map((item) => (
            <div key={item.label} className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                {item.label}
              </p>
              <p className="text-sm sm:text-base font-medium text-gray-700">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Apprentice</p>
            <p className="text-sm sm:text-base font-medium text-gray-700">
              José Ricardo Peñarredonda Villadiego
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Instructor</p>
            <p className="text-sm sm:text-base font-medium text-gray-700">
              Joan Manuel Triana Urueña
            </p>
          </div>
        </section>

        <section className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-primary/5 border border-primary/15 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <img src={assets.sena_logo} alt="SENA" className="h-14 w-auto" />
            <div>
              <p className="font-medium text-gray-700">SENA — Centro Agropecuario La Granja</p>
              <p className="text-sm text-gray-500">Vocational training in English, 2026</p>
            </div>
          </div>
          <Link
            to="/blogs"
            className="shrink-0 px-6 py-2.5 rounded-full bg-primary text-white text-sm hover:bg-primary/90"
          >
            Explore the blog
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
