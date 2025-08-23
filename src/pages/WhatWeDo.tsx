import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Target, TrendingUp, Heart, AlertTriangle, Home, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import React, { useState, useEffect } from 'react';


const CountingNumber = ({ target, duration = 2000, suffix = "" }) => {
  const [current, setCurrent] = useState(0);
  const ref = React.useRef();
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        setCurrent(prev => {
          if (prev < target) {
            return Math.min(prev + increment, target);
          }
          clearInterval(timer);
          return target;
        });
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="font-bold text-3xl text-red-600">
      {Math.floor(current).toLocaleString()}{suffix}
    </span>
  );
};


export default function WhatWeDo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-reach-green/5 to-reach-orange/5">
      {/* Hero Section with Image */}
      <section className="relative py-24 bg-gradient-to-r from-reach-green to-reach-orange overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center text-white max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">What We Do</h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Tackling Hong Kong's inequality gap at its core through targeted interventions 
              for underserved kindergarten students
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* The Problem Section */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-reach-green">The Challenge We Face</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-xl rounded-lg">
              <div className="p-8">
                <div className="grid md:grid-cols-1 gap-8 items-center">
                  <div>
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-800">Hong Kong's Inequality Crisis</h3>
                    </div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Hong Kong is one of the most unequal cities in the world. We have{' '}
                      <strong>40,000 kindergarten students living below the poverty line.</strong>
                    </p>
                    <p className="text-gray-600 mb-6 italic">
                      For these children, it's no longer about "winning at the starting line".
                    </p>
                    
                    {/* Three statistics side by side */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <motion.div 
                        className="bg-orange-100 p-4 rounded-lg text-center border border-orange-200"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Home className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <div className="font-bold text-orange-600 text-xl mb-1">
                          <CountingNumber target={8000} />
                        </div>
                        <p className="text-xs text-gray-600 leading-tight">
                          children from families in bedspace apartments, subdivided flats or rooftop huts
                        </p>
                      </motion.div>

                      <motion.div 
                        className="bg-orange-100 p-4 rounded-lg text-center border border-orange-200"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Utensils className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <div className="font-bold text-orange-600 text-xl mb-1">
                          <CountingNumber target={5000} />
                        </div>
                        <p className="text-xs text-gray-600 leading-tight">
                          children aged 3-5 cannot even afford 3 meals a day
                        </p>
                      </motion.div>

                      <motion.div 
                        className="bg-orange-100 p-4 rounded-lg text-center border border-orange-200"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <GraduationCap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <div className="font-bold text-orange-600 text-xl mb-1">
                          <CountingNumber target={29} />
                        </div>
                        <p className="text-xs text-gray-600 leading-tight">
                          kindergartens closed in 2025-2026 — the most in a decade
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Kindergarten Crisis Section with Visual */}
            <motion.div 
              className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <GraduationCap className="h-6 w-6 text-green-600 mr-3" />
                <h4 className="text-xl font-bold text-green-800">Why Kindergartens Are Struggling</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold text-lg">$</span>
                </div>
                  <h5 className="font-semibold text-gray-800 mb-2">Undersubsidized</h5>
                  <p className="text-xs text-gray-600">
                    Less support than primary/secondary schools
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold text-lg">!</span>
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-2">Lack of Funding</h5>
                  <p className="text-xs text-gray-600">
                    Limited support from NGOs & private sectors
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold text-lg">×</span>
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-2">Can't Help</h5>
                  <p className="text-xs text-gray-600">
                    Unable to offer resources for students in need
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>  
        </motion.section>

        {/* Our Track Record */}
        <motion.section 
          className="mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-reach-green">Our Track Record</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-reach-green/10 to-reach-orange/10 border-reach-green/20 shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Project Reach has worked with close to <strong>400 K3 kindergarten students</strong> from 
                      6 kindergartens and community centers in the past.
                    </p>
                    <div className="bg-white/60 p-6 rounded-lg border border-reach-orange/20">
                      <div className="text-3xl font-bold text-reach-orange mb-2">Less than 20%</div>
                      <p className="text-gray-700">
                        of our students could recognise all 26 alphabets when they first joined our programme. 
                        They were significantly behind in vocabulary knowledge and sight words recognition.
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/60 p-6 rounded-lg">
                      <div className="text-4xl mb-4">📚</div>
                      <p className="text-gray-700 font-medium">
                        "For these children, it's no longer about 'winning at the starting line'."
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Our Curriculum */}
        <motion.section 
          className="mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-reach-green">Our Proprietary Curriculum</h2>
          <div className="max-w-6xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                  <div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Developed by <strong>Columbia and Harvard-trained educators</strong>, our curriculum 
                      comprises five key elements to prepare underserved children for Primary 1 proficiency requirements.
                    </p>
                    <div className="bg-gradient-to-r from-reach-green/10 to-reach-orange/10 p-6 rounded-lg">
                      <h4 className="font-bold text-reach-green mb-3">Key Features:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Based on renowned storybooks worldwide</li>
                        <li>• Minimum 20 hours of weekly premium English programmes</li>
                        <li>• Targets K3 students from poorest districts</li>
                        <li>• Designed to bridge English proficiency gaps</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-center">
                    <img 
                      src="/assets/curriculum.jpg" 
                      alt="Our curriculum in action" 
                      className="rounded-lg shadow-lg w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Our Project Interventions */}
        <motion.section 
          className="mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-reach-green">Our Project Interventions</h2>
          <div className="max-w-6xl mx-auto">
            <p className="text-xl text-center text-gray-600 mb-12">
              Project REACH aims to tackle Hong Kong's inequality gap at its core through 3 interventions:
            </p>
            
            <div className="space-y-8">
              {/* Intervention 1 */}
              <Card className="bg-gradient-to-r from-reach-green/10 to-reach-orange/10 border-reach-green/20 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-reach-green text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-reach-green mb-4">EMPOWERING STUDENTS</h3>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        We provide a minimum of <strong>20 hours of weekly, premium English programmes</strong> targeting 
                        to bridge the English proficiency gaps of K3 kindergarten students coming from some 
                        of the poorest districts in Hong Kong. Our curriculum is designed based on renowned 
                        storybooks worldwide.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intervention 2 */}
              <Card className="bg-gradient-to-r from-reach-orange/10 to-reach-green/10 border-reach-orange/20 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-reach-orange text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-reach-orange mb-4">EMPOWERING PARENTS</h3>
                      <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Students are given home learning booklets for them to practise at home after each 
                        class. Detailed written instructions with videos are provided to parents each week on 
                        how to help their children complete the home learning booklets.
                      </p>
                      <div className="bg-white/60 p-4 rounded-lg">
                        <p className="text-gray-700">
                          Parents are requested to submit completed work to Project REACH for grading. Our 
                          previous programmes have increased <strong>parent-children interaction by &gt;3,000 hours.</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intervention 3 */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-600 mb-4">EMPOWERING KINDERGARTENS WITH DATA AND TECHNOLOGY</h3>
                      <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        All participating students will utilise the Project Reach learning app, a 
                        proprietary platform created and owned by Project Reach, to complete 
                        their pre-and post-programme assessments.
                      </p>
                      <div className="bg-white/60 p-4 rounded-lg">
                        <p className="text-gray-700">
                          The app will provide immediate feedback to students, and all learning data 
                          will be collected, analysed, and shared with our kindergarten partners.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* The Impact */}
        <motion.section 
          className="mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-reach-green">The Impact We're Making</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Breaking the Vicious Cycle</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Without proper interventions, these children would forever be fallen behind, 
                    both academically and developmentally, as early as they enter Primary 1. 
                    Many of them would never catch up.
                  </p>
                </div>
                
                <div className="bg-white/60 p-6 rounded-lg mb-8">
                  <p className="text-lg text-gray-700 font-medium text-center">
                    "It is a vicious cycle. It exponentially increases the inequality gap in Hong Kong. 
                    These children deserve the rights to be led to that starting line so that they can 
                    be given equal opportunities to lead a better life."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-reach-green/10 to-reach-orange/10 border-reach-green/20 shadow-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-reach-green mb-6">Join Our Mission</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Help us give these children the equal opportunities they deserve. 
                Together, we can break the cycle of educational inequality in Hong Kong.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate">
                  <Button size="lg" className="bg-reach-orange hover:bg-reach-orange/90 text-white text-lg px-8 py-4">
                    💝 Support Our Work
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button variant="outline" size="lg" className="border-reach-green text-reach-green hover:bg-reach-green/10 text-lg px-8 py-4">
                    📬 Read Thank You Messages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}