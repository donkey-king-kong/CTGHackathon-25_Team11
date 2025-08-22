import { motion } from "framer-motion";
import { Users, Heart, Target, BookOpen, Award, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReachAbout() {
  const team = [
    {
      name: "Emily Chen",
      role: "Founder & Director",
      bio: "Former teacher with 10 years of experience in early childhood education",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2ca0f62?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Michael Wong",
      role: "Program Coordinator",
      bio: "Educational specialist focusing on English language development",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Sarah Liu",
      role: "Community Outreach",
      bio: "Connecting families and schools to build stronger communities",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every child and family with empathy and understanding"
    },
    {
      icon: Target,
      title: "Impact",
      description: "We focus on measurable outcomes that transform lives"
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in the power of collective action and partnership"
    },
    {
      icon: BookOpen,
      title: "Education",
      description: "We see education as the foundation for breaking cycles of poverty"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-reach-green/10 to-reach-orange/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-reach-green text-white mb-6 text-lg px-6 py-2">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-reach-green mb-8">
              Building a more equitable Hong Kong
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Project REACH was founded with a simple but powerful belief: every child deserves 
              the opportunity to reach their full potential, regardless of their family's economic circumstances.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-reach-green mb-8">
                Our Story
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  In 2019, our founder Emily Chen was teaching at a kindergarten in Sham Shui Po when she noticed 
                  a troubling pattern. Children from low-income families were consistently struggling with English, 
                  setting them up for academic challenges that would follow them throughout their educational journey.
                </p>
                
                <p>
                  While Hong Kong prides itself on being an international city, the reality is that quality English 
                  education remains out of reach for thousands of children living in poverty. Traditional charity 
                  models focus on primary and secondary education, leaving the critical kindergarten years overlooked.
                </p>
                
                <p>
                  That's when Project REACH was born – Hong Kong's first charity specifically targeting the English 
                  proficiency gap among underserved kindergarteners. We knew we had to tackle the issue from the starting line.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop"
                  alt="Children learning together"
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Stats overlay */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-reach-orange">2019</div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
              
              <div className="absolute -top-8 -right-8 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-reach-green">1,200+</div>
                <div className="text-sm text-gray-600">Children supported</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-reach-green/5 to-reach-orange/5">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-reach-green mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              These core principles guide everything we do, from program design to community engagement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 h-full bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <value.icon className="h-16 w-16 text-reach-green mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-reach-green mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-reach-green mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Passionate educators and advocates working to create lasting change in Hong Kong's education landscape
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-reach-green mb-2">{member.name}</h3>
                    <Badge className="bg-reach-orange/10 text-reach-orange mb-4">
                      {member.role}
                    </Badge>
                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-reach-green to-reach-orange">
        <div className="container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-16">
              Our Impact So Far
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1,200+</div>
                <div className="text-lg opacity-90">Children Supported</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">45</div>
                <div className="text-lg opacity-90">Partner Schools</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">87%</div>
                <div className="text-lg opacity-90">Improvement Rate</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">5</div>
                <div className="text-lg opacity-90">Years of Impact</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-reach-green mb-8">
              Join Our Mission
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Together, we can ensure that every child in Hong Kong has the opportunity to reach their full potential, 
              regardless of their family's economic circumstances.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-reach-orange hover:bg-reach-orange/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
                onClick={() => window.location.href = '/donate'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="inline mr-2 h-5 w-5" />
                Support Our Work
              </motion.button>
              
              <motion.button
                className="bg-white text-reach-green border-2 border-reach-green hover:bg-reach-green hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
                onClick={() => window.location.href = '/messages/new'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="inline mr-2 h-5 w-5" />
                Get Involved
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}