import { Button } from "@/components/ui/button";

export default function Festival() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-[#ff5757] to-[#8c52ff] min-h-[500px] flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-6xl mx-4 p-8 md:p-12 shadow-2xl">
            {/* Sponsor Logos Row */}
            <div className="flex justify-center items-center gap-8 mb-8 flex-wrap">
              <img 
                src="/festival-assets/character-education-logo.png" 
                alt="Character Education Foundation" 
                className="h-16 md:h-20 object-contain"
              />
              <img 
                src="/festival-assets/hotung-mills-logo.png" 
                alt="Hotung Mills Foundation" 
                className="h-16 md:h-20 object-contain"
              />
              <img 
                src="/festival-assets/project-reach-logo.png" 
                alt="Project Reach" 
                className="h-16 md:h-20 object-contain"
              />
            </div>

            {/* Main Festival Content */}
            <div className="text-center">
              {/* Festival Logo */}
              <div className="mb-6">
                <img 
                  src="/festival-assets/festival-logo.png" 
                  alt="Children's Character Festival 2026" 
                  className="max-w-md mx-auto h-auto"
                />
              </div>

              {/* Date and Enrollment */}
              <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
                21 - 22 March 2026
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-red-500 mb-8">
                Enrolments open NOW
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* True Tales of Gratitude Section */}
      <section className="bg-gradient-to-br from-blue-100 to-purple-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content Column */}
              <div className="space-y-8">
                {/* English Section */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6 text-center lg:text-left">
                    TRUE TALES OF GRATITUDE
                  </h2>
                  
                  <div className="text-lg text-gray-700 leading-relaxed space-y-4">
                    <p>
                      Create your own true story based on acts of gratitude. You can draw it, 
                      write about it, or create it in any way you wish.
                    </p>
                    
                    <p>
                      We'd then love to hear you present it at the Children's Character Festival, 
                      where you can share your experience in front of an audience and receive 
                      comments from an adjudicator about your story and how you tell it.
                    </p>
                    
                    <p className="font-semibold">We hope you'll join us!</p>
                    
                    <ul className="list-disc list-inside space-y-2 mt-6">
                      <li>English and Cantonese language streams</li>
                      <li>Certificates and comments sheets for all participants</li>
                      <li>Champion, 1st Runner-Up, and 2nd Runner-Up trophies for each event</li>
                    </ul>
                  </div>
                </div>

                {/* Chinese Section */}
                <div className="border-t pt-8">
                  <h3 className="text-3xl font-bold text-blue-600 mb-6 text-center lg:text-left">
                    感恩真故事
                  </h3>
                  
                  <div className="text-lg text-gray-700 leading-relaxed space-y-4">
                    <p>
                      我們邀請3至10歲的兒童利用插圖、寫作或任何喜愛的媒介來創作以「感恩」為主題的真實故事。
                      在兒童品格節上，他們將展示自己的故事、與觀眾分享自身經歷。
                    </p>
                    
                    <p className="font-semibold">歡迎參加這個極具啟發意義的活動！</p>
                    
                    <ul className="list-disc list-inside space-y-2 mt-6">
                      <li>比賽設有英文及廣東話組別</li>
                      <li>所有參賽者均獲發證書和評語紙</li>
                      <li>每個項目的冠、亞、季軍將獲頒獎座</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="flex justify-center lg:justify-end">
                <img 
                  src="/festival-assets/child-photo.png" 
                  alt="Happy child participant" 
                  className="max-w-sm rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-4xl mx-auto p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join the Children's Character Festival 2026 and inspire others with your true tales of gratitude. 
              Registration is open for participants aged 3-10 years old.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                Register Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}