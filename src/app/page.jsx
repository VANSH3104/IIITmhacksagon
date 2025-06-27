'use client';

import { useState, useEffect } from 'react';
import {
  Code, Palette, Zap, Star, ArrowRight, Menu, X, Github, Linkedin, Mail, ShieldCheck,
  Rocket, Layers, Cpu, Globe, Smartphone, Database, BarChart2, Server, Clock, Award,
  Wallet, Shield, Users, Globe2, Lock, CheckCircle, TrendingUp, User, Briefcase, CpuIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroImg from './hero.png'; // or './hero.jpg' if that's your file

export default function DecentralizedFreelancePlatform() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0); // For presentation sections

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Presentation sections from PDF
  const presentationSections = [
    {
      title: "Problem Statement",
      subtitle: "The issues with centralized freelancing platforms",
      icon: <X className="w-8 h-8 text-red-400" />,
      content: [
        "Centralized platforms control everything - payments, disputes, account access",
        "High fees (20-30%) eating into freelancer earnings",
        "Payment delays and arbitrary account suspensions",
        "Lack of transparency in transactions and disputes",
        "Clients face issues with fake freelancers and biased dispute resolution"
      ],
      quote: "Imagine losing weeks of work because an algorithm flagged your account incorrectly. That's not fair!"
    },
    {
      title: "Our Solution",
      subtitle: "Decentralized freelancing powered by blockchain",
      icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
      content: [
        "Smart contracts automate payments when work is approved",
        "DAO-based dispute resolution (community voting)",
        "No platform fees - only minimal blockchain transaction costs",
        "True ownership of your profile and earnings",
        "Global access without restrictions"
      ],
      quote: "Payments are instant, disputes are fair, and no one can lock your funds!"
    },
    {
      title: "Technical Architecture",
      subtitle: "How we built it",
      icon: <CpuIcon className="w-8 h-8 text-blue-400" />,
      content: [
        "Frontend: React & Next.js for smooth user experience",
        "Blockchain: Ethereum & Polygon for smart contracts",
        "Authentication: Web3 wallets like MetaMask",
        "Smart contracts handle escrow and automatic payments",
        "IPFS for decentralized file storage",
        "The Graph for decentralized data querying"
      ],
      quote: "We've built a well-oiled freelancing engine with blockchain at its core!"
    },
    {
      title: "Future Vision",
      subtitle: "Where we're going next",
      icon: <Rocket className="w-8 h-8 text-purple-400" />,
      content: [
        "AI-powered smart matching between freelancers and clients",
        "Multi-chain support for more flexibility",
        "Community-driven feature voting and enhancements",
        "Expanded payment options including crypto and stablecoins",
        "Mobile app for on-the-go freelancing"
      ],
      quote: "This isn't just a platform - it's a movement towards borderless, fair work!"
    }
  ];

  const features = [
    { icon: <Wallet className="w-8 h-8" />, title: "Instant Payments", description: "Smart contracts release funds automatically when work is approved" },
    { icon: <Shield className="w-8 h-8" />, title: "No Account Bans", description: "True ownership of your profile and earnings" },
    { icon: <Users className="w-8 h-8" />, title: "DAO Dispute Resolution", description: "Community-driven fair decisions on conflicts" },
    { icon: <Globe2 className="w-8 h-8" />, title: "Global Access", description: "Work without geographical restrictions" },
    { icon: <Lock className="w-8 h-8" />, title: "Secure & Transparent", description: "All transactions recorded on blockchain" },
    { icon: <CheckCircle className="w-8 h-8" />, title: "Low Fees", description: "Layer 2 solutions keep costs minimal" },
  ];

  const techStack = [
    { name: "Ethereum & Polygon", description: "Smart contract platform", icon: <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">E</div> },
    { name: "IPFS", description: "Decentralized file storage", icon: <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">IPFS</div> },
    { name: "Next.js", description: "Frontend framework", icon: <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">N</div> },
    { name: "The Graph", description: "Decentralized querying", icon: <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">G</div> },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Developer",
      content: "Finally a platform where I get paid instantly without worrying about account freezes. The DAO dispute system is revolutionary!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      content: "Hiring through this platform saved us 20% in fees compared to traditional services. The smart contract escrow gives peace of mind.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "UI/UX Designer",
      content: "As an international freelancer, I no longer face payment restrictions. This is the future of freelance work!",
      rating: 4
    },
  ];

  const stats = [
    { value: "0%", label: "Platform Fees", icon: <TrendingUp className="w-6 h-6" /> },
    { value: "Instant", label: "Payments", icon: <Zap className="w-6 h-6" /> },
    { value: "100%", label: "Uptime", icon: <Server className="w-6 h-6" /> },
    { value: "Global", label: "Access", icon: <Globe className="w-6 h-6" /> },
  ];

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    animate: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.7, type: "spring" }
    })
  };

  const iconVariants = {
    rest: { rotate: 0, scale: 1 },
    hover: { rotate: [0, 15, -15, 0], scale: 1.2, transition: { duration: 0.6 } }
  };

  const testimonialVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // Button animation
  const buttonVariants = {
    rest: { scale: 1, boxShadow: "0 0 0px 0px #a78bfa" },
    hover: { scale: 1.08, boxShadow: "0 0 24px 4px #a78bfa" },
    tap: { scale: 0.96 }
  };

  // Image animation
  const imageVariants = {
    initial: { opacity: 0, scale: 0.95, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, delay: 0.2 } },
    hover: { scale: 1.04, rotate: 2 }
  };

  const heroImageVariants = {
    initial: { opacity: 0, scale: 0.9, rotate: -8, y: 40 },
    animate: { opacity: 1, scale: 1, rotate: 0, y: 0, transition: { duration: 1, delay: 0.2, type: "spring" } },
    hover: { scale: 1.06, rotate: 3, boxShadow: "0 8px 40px 0 rgba(168,85,247,0.25)", transition: { type: "spring", stiffness: 200 } }
  };

  const heroBgVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 0.2, scale: 1, transition: { duration: 1.2, delay: 0.1 } }
  };

  const heroTextVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2, type: "spring" } }
  };

  // Add this variant for floating animation
  const floatingImageVariants = {
    initial: { opacity: 0, scale: 0.9, y: 40, rotate: -6 },
    animate: {
      opacity: 1,
      scale: 1,
      y: [0, -16, 0, 16, 0], // floating up and down
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.08,
      rotate: 8,
      boxShadow: "0 8px 40px 0 rgba(168,85,247,0.35)",
      transition: { type: "spring", stiffness: 200 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`flex justify-between items-center px-6 py-4 sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-slate-900/95 backdrop-blur border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            DeFiLance
          </h1>
        </div>
        
        <div className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </div>
        
        <ul className={`hidden md:flex gap-8 items-center`}>
          <li className="relative group">
            <a href="#home" className="hover:text-purple-300 transition-colors duration-200">Home</a>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
          </li>
          <li className="relative group">
            <a href="#problem" className="hover:text-purple-300 transition-colors duration-200">Problem</a>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
          </li>
          <li className="relative group">
            <a href="#solution" className="hover:text-purple-300 transition-colors duration-200">Solution</a>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
          </li>
          <li className="relative group">
            <a href="#future" className="hover:text-purple-300 transition-colors duration-200">Future</a>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
          </li>
          <motion.button
            className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 0 24px 4px rgba(167, 139, 250, 0.5)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Launch App
          </motion.button>
        </ul>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-slate-900/95 backdrop-blur border-b border-white/10 z-40 px-6 py-4"
          >
            <ul className="flex flex-col gap-4">
              <li><a href="#home" className="block py-2 hover:text-purple-300" onClick={() => setIsMenuOpen(false)}>Home</a></li>
              <li><a href="#problem" className="block py-2 hover:text-purple-300" onClick={() => setIsMenuOpen(false)}>Problem</a></li>
              <li><a href="#solution" className="block py-2 hover:text-purple-300" onClick={() => setIsMenuOpen(false)}>Solution</a></li>
              <li><a href="#future" className="block py-2 hover:text-purple-300" onClick={() => setIsMenuOpen(false)}>Future</a></li>
              <li className="mt-2">
                <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-semibold">
                  Launch App
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative text-center pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
          variants={heroBgVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600 filter blur-3xl opacity-40 animate-pulse"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-pink-600 filter blur-3xl opacity-40 animate-pulse"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </motion.div>
        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6"
              variants={heroTextVariants}
              initial="initial"
              animate="animate"
              whileHover={{ textShadow: "0 2px 32px #a78bfa" }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                <motion.span
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
                >
                  Decentralized Freelancing
                </motion.span>
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7, type: "spring" }}
              >
                Powered by Blockchain
              </motion.span>
            </motion.h2>
            <motion.p
              className="max-w-2xl mx-auto text-lg text-white/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
            >
              Take back control of your freelance career. Instant payments, no middlemen, and true ownership of your work.
              Presented at Hacksagon 2025
            </motion.p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-semibold shadow-lg flex items-center justify-center gap-2"
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                transition={{ type: "spring", stiffness: 300 }}
                whileFocus="hover"
                animate="animate"
              >
                <motion.span
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  Join as Freelancer
                </motion.span>
                <ArrowRight className="inline w-4 h-4" />
              </motion.button>
              <motion.button
                className="px-8 py-3 bg-transparent border border-white/30 rounded-full font-semibold flex items-center justify-center gap-2"
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                transition={{ type: "spring", stiffness: 300 }}
                whileFocus="hover"
              >
                <motion.span
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  Hire Talent
                </motion.span>
                <ArrowRight className="inline w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <motion.div
            className="flex-1 flex justify-center"
            variants={floatingImageVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileFocus="hover"
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            whileTap={{ scale: 0.97, rotate: 0 }}
          >
            <motion.img
              src={heroImg}
              alt="Freelancer Hero"
              className="rounded-3xl shadow-2xl w-80 h-80 object-cover border-4 border-purple-500/30"
              style={{ willChange: "transform" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Presentation Sections */}
      <section id="problem" className="px-6 py-16 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-900/50 rounded-full text-sm mb-4">
              <User className="w-4 h-4" />
              <span>Member 1</span>
            </div>
            <motion.h3 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              The Problem With Centralized Platforms
            </motion.h3>
            <p className="text-white/70 max-w-2xl mx-auto">Why traditional freelancing platforms are broken</p>
          </motion.div>

          <div className="bg-slate-800/50 rounded-xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row gap-8">
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-purple-400 mb-4">
                  {presentationSections[0].icon}
                </div>
                <h4 className="text-2xl font-bold mb-4">{presentationSections[0].subtitle}</h4>
                <ul className="space-y-4 mb-6">
                  {presentationSections[0].content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-purple-400">
                  <p className="italic">"{presentationSections[0].quote}"</p>
                </div>
              </motion.div>
              <motion.div 
                className="md:w-1/2 bg-slate-900/50 rounded-lg p-6"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h5 className="text-xl font-bold mb-4">Traditional Platforms vs DeFiLance</h5>
                <div className="space-y-6">
                  {[
                    { title: "Fees", traditional: "20-30%", defilance: "0%" },
                    { title: "Payments", traditional: "Days/Weeks", defilance: "Instant" },
                    { title: "Account Control", traditional: "Platform can ban", defilance: "You own your account" },
                    { title: "Disputes", traditional: "Platform decides", defilance: "Community DAO" },
                  ].map((item, i) => (
                    <div key={i}>
                      <h6 className="text-sm text-white/50 mb-1">{item.title}</h6>
                      <div className="flex gap-4">
                        <div className="flex-1 bg-red-900/30 p-3 rounded-lg">
                          <p className="text-sm text-white/70 mb-1">Traditional</p>
                          <p className="font-bold text-red-400">{item.traditional}</p>
                        </div>
                        <div className="flex-1 bg-green-900/30 p-3 rounded-lg">
                          <p className="text-sm text-white/70 mb-1">DeFiLance</p>
                          <p className="font-bold text-green-400">{item.defilance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="px-6 py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-900/50 rounded-full text-sm mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Member 2</span>
            </div>
            <motion.h3 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Decentralized Solution
            </motion.h3>
            <p className="text-white/70 max-w-2xl mx-auto">How blockchain technology fixes freelancing</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              className="bg-slate-800/50 rounded-xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-green-400 mb-4">
                {presentationSections[1].icon}
              </div>
              <h4 className="text-2xl font-bold mb-4">{presentationSections[1].title}</h4>
              <ul className="space-y-3 mb-6">
                {presentationSections[1].content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-green-400">
                <p className="italic">"{presentationSections[1].quote}"</p>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-slate-800/50 rounded-xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-blue-400 mb-4">
                {presentationSections[2].icon}
              </div>
              <h4 className="text-2xl font-bold mb-4">{presentationSections[2].title}</h4>
              <p className="text-white/80 mb-4">{presentationSections[2].subtitle}</p>
              <ul className="space-y-3 mb-6">
                {presentationSections[2].content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Code className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-blue-400">
                <p className="italic">"{presentationSections[2].quote}"</p>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.h3 
            className="text-3xl font-bold text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Key Features
          </motion.h3>
          
          <motion.p 
            className="text-center text-white/80 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What makes our platform different and better
          </motion.p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/50 transition-all group border border-white/5 hover:border-purple-400/30"
                custom={i}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: "0 10px 30px -5px rgba(124, 58, 237, 0.3)" }}
              >
                <motion.div
                  className="text-purple-400 mb-4"
                  variants={iconVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  {feature.icon}
                </motion.div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Section */}
      <section id="future" className="px-6 py-16 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-900/50 rounded-full text-sm mb-4">
              <Rocket className="w-4 h-4" />
              <span>Member 4</span>
            </div>
            <motion.h3 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              The Future of Freelancing
            </motion.h3>
            <p className="text-white/70 max-w-2xl mx-auto">Where we're going next</p>
          </motion.div>

          <div className="bg-slate-900/50 rounded-xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row gap-8">
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-purple-400 mb-4">
                  {presentationSections[3].icon}
                </div>
                <h4 className="text-2xl font-bold mb-4">Our Vision</h4>
                <ul className="space-y-4 mb-6">
                  {presentationSections[3].content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-yellow-400">
                  <p className="italic">"{presentationSections[3].quote}"</p>
                </div>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h5 className="text-xl font-bold mb-4">Roadmap</h5>
                <div className="space-y-6">
                  {[
                    { quarter: "Q3 2025", items: ["AI matching beta", "Mobile app prototype"] },
                    { quarter: "Q4 2025", items: ["Multi-chain support", "Community governance"] },
                    { quarter: "Q1 2026", items: ["Advanced analytics", "Enterprise features"] },
                    { quarter: "Q2 2026", items: ["Global expansion", "100k+ users"] },
                  ].map((item, i) => (
                    <div key={i} className="relative pl-8 pb-6 border-l border-purple-400/30">
                      <div className="absolute left-0 w-4 h-4 rounded-full bg-purple-400 -translate-x-2"></div>
                      <h6 className="font-bold mb-2">{item.quarter}</h6>
                      <ul className="space-y-1">
                        {item.items.map((subitem, j) => (
                          <li key={j} className="text-sm text-white/80">{subitem}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-16 relative">
        <div className="max-w-4xl mx-auto">
          <motion.h3 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            What Our Users Say
          </motion.h3>
          
          <div className="relative h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                className="bg-slate-800 rounded-xl p-8 border border-white/10 absolute inset-0"
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 italic text-lg mb-6">"{testimonials[activeTestimonial].content}"</p>
                <div className="font-semibold text-lg">{testimonials[activeTestimonial].name}</div>
                <div className="text-white/50">{testimonials[activeTestimonial].role}</div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === activeTestimonial ? 'bg-purple-400 w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h3 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Experience Decentralized Freelancing?
          </motion.h3>
          
          <motion.p 
            className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join the revolution and take control of your freelance career today.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-semibold shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 24px 4px rgba(167, 139, 250, 0.5)"
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Sign Up Now
            </motion.button>
            
            <motion.button
              className="px-8 py-3 bg-transparent border border-white rounded-full font-semibold"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-slate-900 border-t border-white/10 px-6 py-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">DeFiLance</h3>
              </div>
              <p className="text-white/70 mb-4">
                The future of freelancing is decentralized, transparent, and fair.
              </p>
              <div className="flex gap-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.3, color: "#a78bfa" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Github className="w-5 h-5 cursor-pointer" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.3, color: "#a78bfa" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Linkedin className="w-5 h-5 cursor-pointer" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.3, color: "#a78bfa" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Mail className="w-5 h-5 cursor-pointer" />
                </motion.a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Features</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">How It Works</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Community</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-300 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-white/50">
            <p>© {new Date().getFullYear()} DeFiLance. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}