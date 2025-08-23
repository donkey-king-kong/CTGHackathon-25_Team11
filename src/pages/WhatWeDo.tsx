import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Target, TrendingUp, Heart, AlertTriangle, Home, Utensils, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    {
      src: "/assets/kindergarten-1.jpg",  
      alt: "Students learning in classroom"
    },
    {
      src: "/assets/what-we-do-hero.png",
      alt: "Students learning in classroom"  
    },
    {
      src: "/assets/curriculum.jpg",
      alt: "Students learning in classroom"  
    },
    {
      src: "/assets/kindergarten-3.jpg",
      alt: "Students learning in classroom"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Navigation functions
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImage(index);
  };

  const [currentCurriculumImage, setCurrentCurriculumImage] = useState(0);

  const curriculumImages = [
    {
      src: "/assets/curriculum-1.jpg",
      alt: "Storybook-based learning"
    },
    {
      src: "/assets/curriculum-2.jpg", 
      alt: "English proficiency activities"
    },
    {
      src: "/assets/curriculum-3.jpg",
      alt: "K3 classroom sessions"
    },
    {
      src: "/assets/curriculum-4.jpg",
      alt: "Interactive learning materials"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCurriculumImage((prev) => (prev + 1) % curriculumImages.length);
    }, 5000); // Different timing from main carousel
  
    return () => clearInterval(timer);
  }, [curriculumImages.length]);
  
  // Add these navigation functions for curriculum carousel
  const nextCurriculumImage = () => {
    setCurrentCurriculumImage((prev) => (prev + 1) % curriculumImages.length);
  };

  const prevCurriculumImage = () => {
    setCurrentCurriculumImage((prev) => (prev - 1 + curriculumImages.length) % curriculumImages.length);
  };
  
  const goToCurriculumImage = (index) => {
    setCurrentCurriculumImage(index);
  };

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
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gradient-to-br from-reach-green/10 to-reach-orange/10 border-reach-green/20 shadow-xl rounded-lg overflow-hidden">
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Content Side - More Visual & Striking */}
                  <div className="space-y-6">
                    {/* Main Impact Number */}
                    <div className="text-center lg:text-left">
                      <div className="text-5xl lg:text-6xl font-bold text-reach-green mb-2 leading-none">
                        400+
                      </div>
                      <p className="text-lg font-semibold text-gray-800 mb-1">K3 Students Reached</p>
                      <p className="text-gray-600">across 6 kindergartens & community centers</p>
                    </div>

                    {/* Challenge Description */}
                    <div className="bg-white/80 p-6 rounded-xl shadow-md border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Turning the Tide</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-red-600 mr-4 min-w-16">80%</div>
                          <p className="text-gray-700">of students couldn't recognize all 26 alphabets</p>
                        </div>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-amber-600 mr-4 min-w-16">Low</div>
                          <p className="text-gray-700">vocabulary knowledge and sight word recognition</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Side */}
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      {/* Image Container */}
                      <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentImage * 100}%)` }}
                      >
                        {images.map((image, index) => (
                          <div key={index} className="w-full flex-shrink-0">
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-80 object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-4 space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            currentImage === index
                              ? 'bg-reach-green scale-110'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Image Counter */}
                    <div className="text-center mt-2 text-sm text-gray-500">
                      {currentImage + 1} of {images.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Content Side - Less Wordy */}
                  <div className="space-y-6">
                    {/* Main Description */}
                    <div className="text-center lg:text-left">
                      <div className="text-2xl font-bold text-reach-green mb-3">
                        Curriculum Developed by Columbia & Harvard Trained Educators 
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed">
                      <strong>Five key elements</strong> designed to prepare underserved K3 students for Primary 1 proficiency.
                      </p>
                    </div>
                    
                    {/* 5 Key Elements */}
                    <div className="bg-white/80 p-6 rounded-xl shadow-md">
                      <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-reach-green/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🔤</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Alphabet Recognition</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-reach-orange/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg">👁️</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Sight Word Acquisition</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">📚</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Vocabulary Acquisition</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🔊</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Phonemic Awareness</span>
                        </div>
                        <div className="flex items-center space-x-3 col-span-2 lg:col-span-1 xl:col-span-2 justify-center lg:justify-start xl:justify-start">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">👆</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Point-and-Read</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Curriculum Carousel Side */}
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      {/* Image Container */}
                      <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentCurriculumImage * 100}%)` }}
                      >
                        {curriculumImages.map((image, index) => (
                          <div key={index} className="w-full flex-shrink-0">
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-80 object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevCurriculumImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                        aria-label="Previous curriculum image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextCurriculumImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                        aria-label="Next curriculum image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-4 space-x-2">
                      {curriculumImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToCurriculumImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            currentCurriculumImage === index
                              ? 'bg-reach-green scale-110'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to curriculum image ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Image Counter */}
                    <div className="text-center mt-2 text-sm text-gray-500">
                      {currentCurriculumImage + 1} of {curriculumImages.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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