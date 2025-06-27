"use client";

import { useState, useEffect } from 'react';
import { Code, Palette, Zap, Star, ArrowRight, Menu, X, Github, Linkedin, Mail } from 'lucide-react';

export default function FreelancerLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies like React, Next.js, and Node.js"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that convert visitors into customers and provide exceptional user experiences"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance Optimization",
      description: "Lightning-fast websites that rank higher in search engines and keep users engaged"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      content: "Absolutely incredible work! Delivered beyond expectations and on time.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      content: "Professional, creative, and a pleasure to work with. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Startup Founder",
      content: "Transformed our vision into a stunning reality. Amazing attention to detail.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-slate-800/95 backdrop-blur-sm rounded-lg mb-4 p-4">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-white hover:text-purple-400 transition-colors">Home</a>
                <a href="#services" className="text-white hover:text-purple-400 transition-colors">Services</a>
                <a href="#portfolio" className="text-white hover:text-purple-400 transition-colors">Portfolio</a>
                <a href="#testimonials" className="text-white hover:text-purple-400 transition-colors">Testimonials</a>
                <a href="#contact" className="text-white hover:text-purple-400 transition-colors">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-8">
                <Code className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 animate-fade-in">
              I Create
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                {' '}Digital Magic
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Full-stack developer & designer crafting exceptional digital experiences 
              that drive results and captivate audiences
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                View My Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              What I Do Best
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transforming ideas into powerful digital solutions with cutting-edge technology and creative design
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A showcase of recent work that demonstrates creativity, technical skill, and results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center text-white transform group-hover:scale-110 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">Project {item}</h3>
                    <p className="text-sm opacity-80">Click to view details</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Client Love
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't just take my word for it - hear what clients say about working together
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-purple-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Start Something Amazing?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Let's discuss your project and bring your vision to life. I'm just a message away!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Get In Touch
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-110">
              <Github className="w-8 h-8" />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-110">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-110">
              <Mail className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 YourName. Crafted with passion and code.
          </p>
        </div>
      </footer>
    </div>
  );
}