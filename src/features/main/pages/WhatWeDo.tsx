import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
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
      alt: "Worksheet"
    },
    {
      src: "/assets/curriculum-2.jpg", 
      alt: "Reading"
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

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* The Problem Section */}
        <motion.section 
          className="mb-16 sm:mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-reach-green leading-tight">The Challenge We Face</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-xl rounded-lg">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid md:grid-cols-1 gap-6 sm:gap-8 items-center">
                  <div>
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mr-3 flex-shrink-0" />
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">Hong Kong's Inequality Crisis</h3>
                    </div>
                    <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                      Hong Kong is one of the most unequal cities in the world. We have{' '}
                      <strong>40,000 kindergarten students living below the poverty line.</strong>
                    </p>
                    <p className="text-gray-600 mb-4 sm:mb-6 italic text-sm sm:text-base leading-tight">
                      For these children, it's no longer about "winning at the starting line".
                    </p>
                    
                    {/* Three statistics side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                      <motion.div 
                        className="bg-orange-100 p-3 sm:p-4 rounded-lg text-center border border-orange-200"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Home className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2" />
                        <div className="font-bold text-orange-600 text-lg sm:text-xl mb-1">
                          <CountingNumber target={8000} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-tight px-1">
                          children from families in bedspace apartments, subdivided flats or rooftop huts
                        </p>
                      </motion.div>

                      <motion.div 
                        className="bg-orange-100 p-3 sm:p-4 rounded-lg text-center border border-orange-200"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Utensils className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2" />
                        <div className="font-bold text-orange-600 text-lg sm:text-xl mb-1">
                          <CountingNumber target={5000} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-tight px-1">
                          children aged 3-5 cannot even afford 3 meals a day
                        </p>
                      </motion.div>

                      <motion.div 
                        className="bg-orange-100 p-3 sm:p-4 rounded-lg text-center border border-orange-200 sm:col-span-2 lg:col-span-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2" />
                        <div className="font-bold text-orange-600 text-lg sm:text-xl mb-1">
                          <CountingNumber target={29} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-tight px-1">
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
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <GraduationCap className="h-6 w-6 text-green-600 mr-3" />
                <h4 className="text-xl font-bold text-green-800">Why Kindergartens Are Struggling</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <motion.div 
                  className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold text-base sm:text-lg">$</span>
                </div>
                  <h5 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Undersubsidized</h5>
                  <p className="text-xs text-gray-600 leading-tight">
                    Less support than primary/secondary schools
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold text-base sm:text-lg">!</span>
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Lack of Funding</h5>
                  <p className="text-xs text-gray-600 leading-tight">
                    Limited support from NGOs & private sectors
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold text-base sm:text-lg">×</span>
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Can't Help</h5>
                  <p className="text-xs text-gray-600 leading-tight">
                    Unable to offer resources for students in need
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>  
        </motion.section>

        {/* Our Track Record */}
        <motion.section 
          className="mb-16 sm:mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-reach-green leading-tight">Our Track Record</h2>
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <div className="bg-gradient-to-br from-reach-green/10 to-reach-orange/10 border-reach-green/20 shadow-xl rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  {/* Content Side - More Visual & Striking */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Main Impact Number */}
                    <div className="text-center lg:text-left">
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-reach-green mb-2 leading-none">
                        400+
                      </div>
                      <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 leading-tight">K3 Students Reached</p>
                      <p className="text-sm sm:text-base text-gray-600 leading-tight">across 6 kindergartens & community centers</p>
                    </div>

                    {/* Challenge Description */}
                    <div className="bg-white/80 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 leading-tight">Turning the Tide</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="text-xl sm:text-2xl font-bold text-red-600 mr-3 min-w-12 sm:min-w-16">80%</div>
                          <p className="text-sm sm:text-base text-gray-700 leading-tight">of students couldn't recognize all 26 alphabets</p>
                        </div>
                        <div className="flex items-center">
                          <div className="text-xl sm:text-2xl font-bold text-amber-600 mr-3 min-w-12 sm:min-w-16">Low</div>
                          <p className="text-sm sm:text-base text-gray-700 leading-tight">vocabulary knowledge and sight word recognition</p>
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
          className="mb-16 sm:mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-reach-green leading-tight">Our Proprietary Curriculum</h2>
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  {/* Content Side - Less Wordy */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Main Description */}
                    <div className="text-center lg:text-left">
                      <div className="text-xl sm:text-2xl font-bold text-reach-green mb-3 leading-tight">
                        Curriculum Developed by Columbia & Harvard Trained Educators 
                      </div>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      <strong>Five key elements</strong> designed to prepare underserved K3 students for Primary 1 proficiency.
                      </p>
                    </div>
                    
                    {/* 5 Key Elements */}
                    <div className="bg-white/80 p-4 sm:p-6 rounded-xl shadow-md">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-reach-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-base sm:text-lg">🔤</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Alphabet Recognition</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-reach-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-base sm:text-lg">👁️</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Sight Word Acquisition</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-base sm:text-lg">📚</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Vocabulary Acquisition</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-base sm:text-lg">🔊</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Phonemic Awareness</span>
                        </div>
                        <div className="flex items-center space-x-3 col-span-1 sm:col-span-2 justify-center sm:justify-start">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-base sm:text-lg">👆</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Point-and-Read</span>
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
          className="mb-16 sm:mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-reach-green leading-tight">Our Project Interventions</h2>
          <div className="max-w-6xl mx-auto">
            <p className="text-lg sm:text-xl text-center text-gray-600 mb-8 sm:mb-12 leading-tight">
              Three targeted interventions to bridge Hong Kong's inequality gap:
            </p>
            
            <div className="space-y-6 sm:space-y-8">
              {/* Intervention 1 */}
              <Card className="bg-gradient-to-r from-reach-green/10 to-reach-orange/10 border-reach-green/20 shadow-lg">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="bg-reach-green text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0 mx-auto sm:mx-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-reach-green mb-3 sm:mb-4 leading-tight text-center sm:text-left">EMPOWERING STUDENTS</h3>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                        <strong>20+ hours weekly</strong> of premium English programmes for K3 students 
                        from Hong Kong's poorest districts. Our storybook-based curriculum bridges 
                        critical English proficiency gaps.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intervention 2 */}
              <Card className="bg-gradient-to-r from-reach-orange/10 to-reach-green/10 border-reach-orange/20 shadow-lg">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="bg-reach-orange text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0 mx-auto sm:mx-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-reach-orange mb-3 sm:mb-4 leading-tight text-center sm:text-left">EMPOWERING PARENTS</h3>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
                        Home learning booklets with detailed instructions and video guides help parents 
                        support their children's progress between classes.
                      </p>
                      <div className="bg-white/60 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-700 text-sm sm:text-base leading-tight">
                          Parents submit completed work for grading, increasing  
                          <strong> parent-child interaction by 3,000+ hours.</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intervention 3 */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0 mx-auto sm:mx-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mb-3 sm:mb-4 leading-tight text-center sm:text-left">EMPOWERING KINDERGARTENS WITH DATA</h3>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
                        Our proprietary learning app handles pre- and post-programme assessments, 
                        providing instant student feedback.
                      </p>
                      <div className="bg-white/60 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-700 text-sm sm:text-base leading-tight">
                          Learning data is analyzed and shared with kindergarten partners to 
                          drive continuous improvement.
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
          className="mb-16 sm:mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-reach-green leading-tight">The Impact We're Making</h2>
          <div className="max-w-6xl mx-auto">
            <p className="text-lg sm:text-xl text-center text-gray-600 mb-8 sm:mb-12 leading-tight">
              Breaking the Cycle
            </p>
            {/* Visual Cycle Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* Without Intervention */}
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-3 sm:mb-4 leading-tight">Without Intervention</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-700 leading-tight">Academic gaps widen</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-700 leading-tight">Fall behind by Primary 1</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-600 rounded-full flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-700 leading-tight">Many never catch up</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-700 rounded-full flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-700 font-semibold leading-tight">Inequality gap grows</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* With Project REACH */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-reach-green rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-reach-green mb-3 sm:mb-4 leading-tight">With Project REACH</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-700 leading-tight">Bridge proficiency gaps early</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-700 leading-tight">Ready for Primary 1</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-700 leading-tight">Equal opportunities</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-700 font-semibold leading-tight">Better life outcomes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-reach-green mb-4 sm:mb-6 leading-tight">Join Our Mission</h2>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8">
                Help us give these children the equal opportunities they deserve. 
                Together, we can break the cycle of educational inequality in Hong Kong.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/donate">
                  <Button size="lg" className="bg-reach-orange hover:bg-reach-orange/90 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                    💝 Support Our Work
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button variant="outline" size="lg" className="border-reach-green text-reach-green hover:bg-reach-green/10 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                    📬 Read Thank You Messages
                  </Button>
                </Link>
                <a href="https://www.facebook.com/projectreachhk" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="border-blue-500 text-blue-500 hover:bg-blue-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                    📱 What's New
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}