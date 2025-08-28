import React, { useEffect, useRef, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../Auth/Images/dashboardvideo.mp4";
import videoSrc from "../Auth/Images/Image2.mp4";

// ---- Utilities: load Lordicon script once so <lord-icon> works ----
const useLordicon = () => {
  useEffect(() => {
    if (!customElements.get("lord-icon")) {
      const script = document.createElement("script");
      script.src = "https://cdn.lordicon.com/lordicon.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
};

// ---- Custom Count-Up Hook ----
const useCountUp = (end, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startVal = 0;
    const increment = end / (duration / 30);

    const interval = setInterval(() => {
      startVal += increment;
      if (startVal >= end) {
        clearInterval(interval);
        setCount(end);
      } else {
        setCount(Math.ceil(startVal));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [end, duration, start]);

  return count;
};

// ---- Data ----
const features = [
  { title: "Integrated Sessions", description: "Host and join live sessions directly in the platform with video, chat, and screen sharing capabilities.", icon: "https://cdn.lordicon.com/ugllxeyl.json" },
  { title: "Community-Driven", description: "Connect with passionate learners and expert volunteers from around the world.", icon: "https://cdn.lordicon.com/axoniyxp.json" },
  { title: "Flexible Scheduling", description: "Create and discover sessions that fit your schedule, from quick tutorials to comprehensive courses.", icon: "https://cdn.lordicon.com/cfoaotmk.json" },
  { title: "Real-time Chat", description: "Engage with tutors and fellow learners through integrated messaging and discussion forums.", icon: "https://cdn.lordicon.com/jdgfsfzr.json" },
  { title: "Feedback System", description: "Rate sessions and provide feedback to help improve the learning experience for everyone.", icon: "https://cdn.lordicon.com/cvwrvyjv.json" },
  { title: "Safe Environment", description: "Verified tutors and moderated content ensure a safe and productive learning environment.", icon: "https://cdn.lordicon.com/sjoccsdj.json" },
  { title: "Global Access", description: "Break down geographical barriers and access quality education from anywhere in the world.", icon: "https://cdn.lordicon.com/rzgcaxjz.json" },
  { title: "Instant Notifications", description: "Stay updated with class schedules, announcements, and important messages in real-time.", icon: "https://cdn.lordicon.com/apmrcxtj.json" },
];

const steps = [
  { id: 1, title: "Sign Up", desc: "Create your profile as either a tutor or learner" },
  { id: 2, title: "Schedule Sessions", desc: "Tutors create sessions, learners book their interests" },
  { id: 3, title: "Learn Together", desc: "Join live sessions with integrated video and tools" },
  { id: 4, title: "Share Feedback", desc: "Rate sessions and build community trust" },
];

// ---- Motion Variants (smooth spring animations) ----
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 15 }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const LandingPage = () => {
  useLordicon();

  const heroRef = useRef();
  const howItWorksRef = useRef();
  const [startCount, setStartCount] = useState(false);

  const learners = useCountUp(500, 2000, startCount);
  const tutors = useCountUp(150, 2000, startCount);
  const sessions = useCountUp(1000, 2000, startCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStartCount(true); },
      { threshold: 0.3 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => { if (heroRef.current) observer.unobserve(heroRef.current); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((step, index) => {
            const arrow = document.getElementById(`arrow-${step.id}`);
            if (arrow) {
              setTimeout(() => {
                arrow.classList.remove("scale-x-0");
                arrow.classList.add("scale-x-100");
              }, index * 700);
            }
          });
        }
      },
      { threshold: 0.4 }
    );

    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    return () => { if (howItWorksRef.current) observer.unobserve(howItWorksRef.current); };
  }, []);

  return (
    <div className="font-sans bg-white text-black">
      {/* Navbar */}
      <header className="flex justify-between items-center py-4 px-8 shadow-md bg-white sticky top-0 z-50 h-16">
        <div className="text-3xl font-bold text-blue-700">LearnLoop</div>
        <nav className="hidden md:flex space-x-8 font-medium text-gray-800">
          <ScrollLink to="features" smooth duration={600} className="relative cursor-pointer hover:text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300">Features</ScrollLink>
          <ScrollLink to="how-it-works" smooth duration={600} className="relative cursor-pointer hover:text-green-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-green-600 after:transition-all after:duration-300">How it Works</ScrollLink>
          <ScrollLink to="community" smooth duration={600} className="relative cursor-pointer hover:text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300">Community</ScrollLink>
          <ScrollLink to="about" smooth duration={600} className="relative cursor-pointer hover:text-green-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-green-600 after:transition-all after:duration-300">About</ScrollLink>
        </nav>
        <Link to="/login" className="text-green-700 font-semibold hover:underline">Log In</Link>
      </header>

      {/* Hero Section */}
      <motion.section ref={heroRef} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp} className="h-[calc(100vh-64px)] flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 bg-white">
        <div className="md:w-1/2 text-center md:text-left space-y-8">
          <h1 className="text-7xl font-extrabold leading-tight text-black">
            <span className="inline-block">Learn</span>{" "}
            <span className="inline-block">without</span>{" "}<br />
            <span className="inline-block">limits</span>
          </h1>
          <p className="text-xl text-gray-700">Connect with skilled volunteers and access free learning opportunities.</p>
          <div className="flex justify-center md:justify-start">
            <Link to="/login" className="bg-black  text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-gray-700 transition">Explore Now</Link>
          </div>

          {/* Stats */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <motion.div variants={fadeIn}><div className="text-3xl font-bold text-blue-600">{learners}+</div><div className="text-sm">Active Learners</div></motion.div>
            <motion.div variants={fadeIn}><div className="text-3xl font-bold text-green-600">{tutors}+</div><div className="text-sm">Expert Tutors</div></motion.div>
            <motion.div variants={fadeIn}><div className="text-3xl font-bold text-yellow-500">{sessions}+</div><div className="text-sm">Sessions Completed</div></motion.div>
          </motion.div>
        </div>

        <motion.div variants={fadeIn} className="md:w-1/2 flex justify-center mb-12 md:mb-0">
          <div className="relative w-[400px] h-[400px]">
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-600 z-0 -translate-x-4 -translate-y-4"></div>
            <video src={heroImg} autoPlay muted loop playsInline className="relative z-10 w-[380px] h-[380px] object-cover rounded-full shadow-xl" />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section id="features" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp} className="px-8 md:px-20 py-12 bg-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div key={i} variants={fadeInUp} className="bg-gradient-to-tr from-green-50 via-white to-green-100 border border-gray-500 hover:border-green-400 shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300" whileHover={{ scale: 1.05 }}>
              <lord-icon src={feature.icon} trigger="hover" style={{ width: "80px", height: "80px" }}></lord-icon>
              <h3 className="text-lg font-bold mt-4">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section id="how-it-works" ref={howItWorksRef} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp} className="px-8 md:px-20 py-16 text-center">
        <h2 className="text-7xl md:text-5xl font-bold text-gray-800 mb-10">How Learn Loop Works</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Simple steps to start your peer-to-peer learning journey</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <motion.div variants={fadeIn} className="w-full md:w-1/2 flex justify-center">
            <video src={videoSrc} autoPlay loop muted className="w-full max-w-full " />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} className="w-full md:w-1/2 flex flex-col md:flex-row justify-center gap-10">
            {steps.map((step, idx, arr) => (
              <motion.div key={step.id} variants={fadeInUp} className="relative flex flex-col items-center transition hover:scale-105">
                <div className="w-28 h-28 bg-white border-4 border-green-700 rounded-full flex flex-col justify-center items-center shadow-md">
                  <div className="text-green-700 font-bold text-xl mb-1">0{step.id}</div>
                  <div className="text-sm font-semibold text-gray-700">{step.title}</div>
                </div>
                <p className="text-gray-600 mt-4 text-sm max-w-[120px]">{step.desc}</p>
                {idx < arr.length - 1 && (
                  <div id={`arrow-${step.id}`} className="absolute hidden md:block top-[56px] right-[-80px] w-20 h-1 bg-blue-500 transition-transform duration-700 origin-left transform scale-x-0"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeIn} className="bg-gray-100 text-gray-700 px-8 md:px-20 py-12 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Learn Loop</h2>
            <p className="text-sm">Peer Learning Platform<br />Connecting learners and tutors worldwide to create a more equitable education system through free peer-to-peer learning.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Platform</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/explore" className="hover:text-green-700">Browse Sessions</Link></li>
              <li><Link to="/become-tutor" className="hover:text-green-700">Become a Tutor</Link></li>
              <li><Link to="/start-learning" className="hover:text-green-700">Start Learning</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/help" className="hover:text-green-700">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-green-700">Safety Guidelines</Link></li>
              <li><Link to="/terms" className="hover:text-green-700">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-green-700">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Connect</h3>
            <p className="text-sm mb-4">Follow us for updates and join our growing community of learners and educators.</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="hover:text-blue-500">🐦</a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-500">📸</a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-700">💼</a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-sm text-center text-gray-500">
          © 2024 Learn Loop. Made with ❤️ for education equality.<br></br>

          <span className="block mt-2 text-xs">Free • Open • Community-Driven</span>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
