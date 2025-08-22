import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Target, TrendingUp, Heart, AlertTriangle, Home, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-reach-green">The Challenge We Face</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-red-200 shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-800">Hong Kong's Inequality Crisis</h3>
                    </div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Hong Kong is one of the most unequal cities in the world. We have <strong>40,000 
                      kindergarten students living below the poverty line.</strong>
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Home className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-600">
                          <strong>8,000</strong> children from families living in bedspace apartments, 
                          subdivided flats or rooftop huts
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Utensils className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-600">
                          <strong>5,000</strong> children aged 3-5 cannot even afford 3 meals a day
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <GraduationCap className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-600">
                          <strong>29 kindergartens</strong> closed down in 2025-2026 – the most in a decade
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <img 
                      src="/assets/subdivided-flats.jpg" 
                      alt="Subdivided flats in Hong Kong" 
                      className="rounded-lg shadow-lg w-full"
                    />
                    <p className="text-sm text-gray-500 mt-2">Subdivided flats where many families live</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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