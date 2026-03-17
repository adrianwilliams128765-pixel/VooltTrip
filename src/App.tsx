/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Briefcase, 
  Scale, 
  Clock, 
  Menu, 
  X,
  Send,
  User,
  Bot,
  ChevronDown,
  Info
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// --- Types ---
interface Message {
  role: 'user' | 'bot';
  content: string;
}

// --- AI Service ---
const SYSTEM_INSTRUCTION = `You are VooltTrip AI, a professional visa and residence permit assistant. 
Your goal is to provide accurate, structured, and helpful information about visa processes.
Key points about VooltTrip:
1. We use a secure escrow-like payment model via a lawyer. Funds are held by a third-party lawyer.
2. If the visa is approved, funds are released to VooltTrip.
3. If the visa is rejected, the client gets a full refund.
4. We specialize in business visas but handle all types.
5. Be professional, reassuring, and clear.
6. If asked about specific documents, list them clearly.
7. If asked about timelines, explain they vary but give general expectations.
8. Always encourage users to "Get Started" when they seem ready.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- Components ---

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus('error');
    }
  };

  return (
    <div className="glass-card p-8 rounded-3xl border-slate-100">
      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
          <p className="text-slate-500 mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="text-neon-blue font-semibold hover:underline"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
              <input 
                required
                type="text" 
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neon-blue/20 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neon-blue/20 outline-none" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neon-blue/20 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
            <textarea 
              required
              rows={4} 
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neon-blue/20 outline-none resize-none" 
            />
          </div>
          <button 
            disabled={status === 'loading'}
            className="neon-button w-full py-4 mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
            {status === 'loading' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          </button>
          {status === 'error' && (
            <p className="text-red-500 text-xs text-center mt-2">Failed to send message. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'AI Assistant', href: '#ai-assistant' },
    { name: 'Services', href: '#services' },
    { name: 'Trust', href: '#trust' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`glass-nav transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-neon-blue rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.4)]">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Voolt<span className="text-neon-blue">Trip</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-slate-600 hover:text-neon-blue transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href='#contact'>
          <button className="neon-button text-sm">Get Started</button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-neon-blue"
                >
                  {link.name}
                </a>
              ))}
              <div className="px-3 pt-4">
                <button className="neon-button w-full">Get Started</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm your VooltTrip AI Assistant. How can I help you with your visa or residence permit today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });

      const result = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'bot', content: result.text || "I'm sorry, I couldn't process that. Please try again." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-150 max-w-2xl mx-auto border-neon-blue/20">
      <div className="bg-slate-900 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-neon-blue flex items-center justify-center shadow-[0_0_10px_rgba(0,210,255,0.5)]">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white font-semibold leading-tight">VooltTrip Assistant</h3>
          <p className="text-neon-blue text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
            Online & Ready to Help
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-neon-blue text-white rounded-tr-none' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
            }`}>
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about documents, eligibility, or process..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/20 focus:border-neon-blue transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-neon-blue text-white rounded-lg flex items-center justify-center hover:bg-neon-blue/80 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          AI can make mistakes. Verify important info with our legal team.
        </p>
      </div>
    </div>
  );
};

const SectionHeading = ({ title, subtitle, centered = true }: { title: string, subtitle: string, centered?: boolean }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <motion.span 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="text-neon-blue font-bold tracking-widest text-xs uppercase mb-3 block"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-3xl md:text-4xl font-bold text-slate-900"
    >
      {title}
    </motion.h2>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="grow">
        {/* Hero Section */}
        <section id="home" className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/20 rounded-full mb-8 shadow-sm"
            >
              <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Next-Gen Visa Solutions</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              Your Global Journey, <br />
              <span className="text-neon-blue drop-shadow-[0_0_15px_rgba(0,210,255,0.3)]">AI-Powered.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed"
            >
              VooltTrip simplifies complex visa applications with intelligent automation and a secure, lawyer-backed payment system. Professional, fast, and risk-free.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href='#ai-assistant'>
              <button className="neon-button px-8 py-4 text-lg flex items-center gap-2 group">
                Ask the AI Assistant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </a>
              <a href='#how-it-works'>
              <button className="px-8 py-4 text-lg font-semibold text-slate-700 hover:text-neon-blue transition-colors">
                Learn How It Works
              </button>
              </a>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://picsum.photos/seed/travel/800/800" 
                    alt="Travel" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl max-w-50">
                  <p className="text-3xl font-bold text-neon-blue mb-1">99%</p>
                  <p className="text-xs text-slate-500 font-medium">Success rate for business visa applications</p>
                </div>
              </motion.div>

              <div>
                <SectionHeading 
                  centered={false}
                  subtitle="About VooltTrip"
                  title="We Bridge the Gap Between Ambition and Destination"
                />
                <p className="text-slate-600 mb-6 leading-relaxed">
                  VooltTrip was born from a simple realization: the visa process is broken. Repetitive questions, manual delays, and lack of trust make it a nightmare for applicants.
                </p>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  We've built a self-contained client acquisition and communication system that automates the heavy lifting, allowing you to focus on your business while we handle the bureaucracy.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Briefcase, text: 'Business Focused' },
                    { icon: Shield, text: 'Lawyer Backed' },
                    { icon: MessageSquare, text: 'AI Driven' },
                    { icon: Clock, text: 'Instant Support' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-neon-blue">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading 
              subtitle="The Process"
              title="Four Simple Steps to Your Visa"
            />
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'AI Consultation', desc: 'Ask our assistant anything about your eligibility and requirements.' },
                { step: '02', title: 'Secure Deposit', desc: 'Funds are held securely by a third-party lawyer account.' },
                { step: '03', title: 'Expert Processing', desc: 'Our team and legal partners handle your entire application.' },
                { step: '04', title: 'Visa Approval', desc: 'Success! Funds are released only after your visa is granted.' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 rounded-3xl relative group hover:border-neon-blue/40 transition-all"
                >
                  <span className="text-5xl font-black text-slate-100 absolute top-4 right-4 group-hover:text-neon-blue/10 transition-colors">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed relative z-10">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Chatbot Section */}
        <section id="ai-assistant" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-neon-blue/10 rounded-full blur-[80px] -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionHeading 
                  centered={false}
                  subtitle="Core Feature"
                  title="Your Personal Visa Assistant — Available 24/7"
                />
                <div className="space-y-6">
                  {[
                    'Document requirements based on your situation',
                    'Step-by-step application guidance',
                    'Processing timelines & eligibility clarification',
                    'Payment and refund policies explained',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="text-neon-blue w-6 h-6 shrink-0 mt-0.5" />
                      <p className="text-slate-600 font-medium">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-neon-blue" />
                    Try asking:
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-500 italic">
                    <li>"What documents do I need as a business owner?"</li>
                    <li>"How long will my visa take?"</li>
                    <li>"What happens if my visa is rejected?"</li>
                  </ul>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <Chatbot />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-neon-blue font-bold tracking-widest text-xs uppercase mb-3 block">Our Expertise</span>
              <h2 className="text-3xl md:text-4xl font-bold">Tailored Visa Solutions</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Briefcase, title: 'Business Visas', desc: 'Complete assistance for entrepreneurs and business owners looking to expand globally.' },
                { icon: Globe, title: 'Residence Permits', desc: 'Long-term stay solutions for professionals, digital nomads, and families.' },
                { icon: Scale, title: 'Legal Consultation', desc: 'Direct access to immigration lawyers for complex cases and appeals.' },
              ].map((service, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-neon-blue/20 flex items-center justify-center text-neon-blue mb-6 group-hover:scale-110 transition-transform">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section id="trust" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card p-12 rounded-[40px] border-neon-blue/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Shield className="w-64 h-64" />
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <SectionHeading 
                    centered={false}
                    subtitle="Trust & Security"
                    title="Risk-Free Payment Model"
                  />
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    We've eliminated the fear of scams. Your funds are never sent directly to us until your visa is approved.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900">Visa Approved</p>
                        <p className="text-xs text-emerald-700">Funds released to VooltTrip</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <X className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-900">Visa Rejected</p>
                        <p className="text-xs text-blue-700">Full refund guaranteed by lawyer</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <h4 className="text-xl font-bold text-slate-900 mb-6">Why This Matters</h4>
                  <ul className="space-y-4">
                    {[
                      'Eliminates fear of financial loss',
                      'Builds instant credibility with new clients',
                      'Ensures our team is fully incentivized for your success',
                      'Transparent legal oversight of all transactions'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                        <div className="w-1.5 h-1.5 bg-neon-blue rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-[40px] p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,210,255,0.15),transparent_70%)]" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to Start Your Journey?</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                Join thousands of successful applicants who trusted VooltTrip for their global mobility needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <a href='#contact'>
                <button className="neon-button px-10 py-4 text-lg">Start Your Application</button>
                </a>
                <a href='#contact'>
                <button className="px-10 py-4 text-lg font-semibold text-white hover:text-neon-blue transition-colors">
                  Contact Sales
                </button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <SectionHeading 
                  centered={false}
                  subtitle="Get In Touch"
                  title="We're Here to Help"
                />
                <p className="text-slate-600 mb-10">
                  Have a specific question or need to escalate to a human consultant? Reach out to us through any of these channels.
                </p>
                <div className="space-y-6">
                  {[
                    { icon: Globe, title: 'Global Office', detail: '123 Tech Plaza, Innovation District' },
                    { icon: MessageSquare, title: 'Email Us', detail: 'support@voolttrip.com' },
                    { icon: Clock, title: 'Support Hours', detail: 'Mon - Fri, 9am - 6pm GMT' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-neon-blue">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Globe className="text-neon-blue w-6 h-6" />
              <span className="text-xl font-bold tracking-tight text-slate-900">Voolt<span className="text-neon-blue">Trip</span></span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-neon-blue transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neon-blue transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-neon-blue transition-colors">Legal Disclaimer</a>
            </div>
            <p className="text-sm text-slate-400">
              © 2026 VooltTrip AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
