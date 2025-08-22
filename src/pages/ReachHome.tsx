import { motion } from "framer-motion";
import { ArrowRight, Users, Heart, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReachHeader } from "@/components/ReachHeader";
import { VideoShowcase } from "@/components/sections/VideoShowcase";

export default function ReachHome() {
  return (
    <div className="min-h-screen">
      <ReachHeader />
      {/* Hero Section - Classroom Image with Overlay */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://reach.org.hk/_assets/media/bccd049f097f1b6c3fa333cefd16ff30.jpg')",
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          {/* REACH Logo - Circular */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <div className="relative inline-block">
              <div className="w-48 h-48 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-reach-green text-2xl font-bold mb-1">PROJECT</div>
                  <div className="text-6xl font-black bg-gradient-to-r from-reach-green to-reach-orange bg-clip-text text-transparent">
                    REACH
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 text-yellow-400 text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ⭐
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 text-blue-400 text-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📚
              </motion.div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Hong Kong's first charity targeting the
              <br />
              <span className="text-reach-orange">English proficiency gap</span> among
              <br />
              underserved kindergarteners
            </h1>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-reach-green hover:bg-reach-green/90 text-white px-8 py-4 text-lg rounded-full"
              onClick={() => window.open('https://www.facebook.com/projectreachhk/', '_blank')}
            >
              Check out what's new
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              className="bg-reach-orange hover:bg-reach-orange/90 text-white px-8 py-4 text-lg rounded-full"
              onClick={() => window.location.href = '/donate'}
            >
              Support our work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-sm mb-2">Scroll to learn more</div>
          <div className="w-6 h-10 border-2 border-white rounded-full mx-auto">
            <div className="w-1 h-3 bg-white rounded-full mx-auto mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* Festival Banner - Children's Character Festival 2026 */}
      <section className="py-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
        <div className="container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-4">🎭</div>
            <Badge className="bg-white text-purple-600 text-lg px-6 py-2 mb-4">
              兒童品格節 • Children's Character Festival
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">21 - 22 March 2026</h2>
            <p className="text-xl mb-8 opacity-90">Open for enrolments NOW</p>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full"
            >
              Click to learn more
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-reach-green mb-8">
                Our Vision
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Hong Kong is one of the most unequal cities, with <strong>40,000 kindergarten students living in poverty</strong>.
                </p>
                
                <p>
                  Underfunded kindergartens receive far less support than primary or secondary schools, with <strong>29 closures in 2025-2026</strong>, the highest in a decade.
                </p>
                
                <p>
                  <strong>Project Reach</strong> is the first initiative to address inequality by tackling the English proficiency gap among underserved kindergarten students transitioning to Primary 1.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <Card className="text-center p-6 bg-reach-green/5 border-reach-green/20">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-reach-green">40,000</div>
                    <div className="text-sm text-gray-600">Children in poverty</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center p-6 bg-reach-orange/5 border-reach-orange/20">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-reach-orange">29</div>
                    <div className="text-sm text-gray-600">School closures</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Image/Video */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://reach.org.hk/_assets/media/81c2667e5a8118c922269e0fb3add7a1.jpg"
                  alt="Children learning"
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Floating quote */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-xs"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="text-reach-green font-semibold italic">
                  "We need to tackle the issue from the starting line."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-reach-green/5 to-reach-orange/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-reach-green mb-8">
              Our MISSION
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 md:p-12 bg-white shadow-xl border-0">
                <CardContent className="p-0">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Project Reach aims to become part of the kindergarten curriculum for schools in need across Hong Kong. We strive to create the first database tracking English proficiency of underserved K3 students to improve programmes and raise awareness of early childhood poverty. Additionally, we aim to secure funding from primary schools to continue supporting students as they transition into Primary 1.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mission Goals */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <BookOpen className="h-16 w-16 text-reach-green mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-reach-green mb-3">Curriculum Integration</h3>
                    <p className="text-gray-600">Become part of kindergarten curriculum for schools in need</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <Target className="h-16 w-16 text-reach-orange mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-reach-orange mb-3">Data Tracking</h3>
                    <p className="text-gray-600">Create first database tracking English proficiency of K3 students</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <Heart className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-purple-500 mb-3">Continued Support</h3>
                    <p className="text-gray-600">Secure funding to support students transitioning to Primary 1</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-reach-green to-reach-orange">
        <div className="container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              Join us in making a difference
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              Help us tackle inequality from the starting line. Every contribution supports underserved kindergarten students in Hong Kong.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-reach-green hover:bg-gray-100 px-8 py-4 text-lg rounded-full"
                onClick={() => window.open('https://www.facebook.com/projectreachhk', '_blank')}
              >
                <Users className="mr-2 h-5 w-5" />
                What's New
              </Button>
              
              <Button 
                size="lg" 
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white px-8 py-4 text-lg rounded-full backdrop-blur-sm"
                onClick={() => window.location.href = '/donate'}
              >
                <Heart className="mr-2 h-5 w-5" />
                How can I help
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}