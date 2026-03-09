import { Wind, ShieldCheck, Wrench, Phone, Mail, MapPin, Award, Users, Clock, ChevronDown, Globe, Lightbulb, CheckCircle, UserCheck, ArrowRight, Facebook, Instagram, Twitter, Linkedin, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import logoImage from 'figma:asset/2e9a0ba31fa0b8545a79838e0b349429712612a3.png';
import { useState, useEffect } from 'react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Clean Air Starts with Prodigy",
      description: "Advanced ventilation engineered for everyday spaces.",
      image: "https://images.unsplash.com/photo-1503518646760-43090c4b8d55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwdmVudGlsYXRpb24lMjBzeXN0ZW18ZW58MXx8fHwxNzcyOTIwMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Efficient Ventilation Solutions",
      description: "Innovative products designed to improve air quality.",
      image: "https://images.unsplash.com/photo-1769006708689-afe6f69b4f76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZW50aWxhdGlvbiUyMGZhbiUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzI5MjI0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Smart Air Control",
      description: "Comfortable and energy-efficient ventilation for your spaces.",
      image: "https://images.unsplash.com/photo-1758545814875-c2f0a0c89943?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXIlMjBjb25kaXRpb25pbmclMjB1bml0fGVufDF8fHx8MTc3MjgwMzE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Prodigy Logo" className="w-12 h-12" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">PRODIGY</span>
              <span className="text-sm text-gray-600">Ventilation Systems</span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#home" className="text-primary transition-colors">Home</a>
            
            <div className="relative group">
              <button className="hover:text-primary transition-colors flex items-center gap-1">
                Technical Support
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white border shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#" className="block px-4 py-2 hover:bg-gray-50">Fan Selector Tool</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-50">ESP Calculator</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-50">Airflow Calculator</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-50 text-primary">Download Catalogue</a>
              </div>
            </div>

            <div className="relative group">
              <button className="hover:text-primary transition-colors flex items-center gap-1">
                Products
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white border shadow-lg rounded-lg py-2 min-w-[400px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div>
                    <div className="font-semibold text-primary mb-2">Commercial</div>
                    <a href="#" className="block px-2 py-1 hover:bg-gray-50 text-sm">In-Line Duct Fan</a>
                    <a href="#" className="block px-2 py-1 hover:bg-gray-50 text-sm">Cabinet Fan</a>
                  </div>
                  <div>
                    <div className="font-semibold text-primary mb-2">Residential</div>
                    <a href="#" className="block px-2 py-1 hover:bg-gray-50 text-sm">In-Line Duct Fan</a>
                    <a href="#" className="block px-2 py-1 hover:bg-gray-50 text-sm">Window Fan</a>
                  </div>
                </div>
              </div>
            </div>

            <a href="#about" className="hover:text-primary transition-colors">About Us</a>
          </nav>
          <Button className="bg-primary hover:bg-primary/90">Get Quote</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-slider">
        <div className="relative h-[600px] flex items-center justify-center bg-gray-900">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].image})`,
              opacity: 0.4
            }}
          />
          <div className="container mx-auto px-4 relative z-10 text-center text-white h-[600px] flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-6xl mb-6">{slides[currentSlide].title}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              {slides[currentSlide].description}
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View Products <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
            <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white" onClick={prevSlide}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white" onClick={nextSlide}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-lg">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-lg">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-lg">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-6">About Prodigy Ventilation Systems</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Prodigy Ventilation Systems is a leading manufacturer of advanced ventilation fans and fresh air systems, proudly headquartered in Fujairah, United Arab Emirates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-7 h-7 text-primary" />
                  <h3 className="text-2xl">Global Standards</h3>
                </div>
                <p className="text-gray-600">
                  Our products are internationally certified to meet the highest benchmarks, including CCC, CE, SAA, and CVC, ensuring compliance, safety, and reliability across global markets.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-7 h-7 text-primary" />
                  <h3 className="text-2xl">Innovation</h3>
                </div>
                <p className="text-gray-600">
                  Since its establishment, Prodigy has been driven by innovation—continuously expanding its product range, refining designs, and developing utility models that keep pace with evolving industry needs.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-7 h-7 text-primary" />
                  <h3 className="text-2xl">Quality-First</h3>
                </div>
                <p className="text-gray-600">
                  At Prodigy, we believe quality is everyone's responsibility. Guided by our "quality-first" philosophy, we focus on excellence in every detail, earning the trust and recognition of our clients.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="w-7 h-7 text-primary" />
                  <h3 className="text-2xl">Tailored Solutions</h3>
                </div>
                <p className="text-gray-600">
                  We provide professional, personalized, and complete ventilation solutions, carefully designed to meet the unique requirements of every client and project.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive ventilation solutions tailored to your needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wind className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Industrial Ventilation</h3>
                <p className="text-gray-600 mb-4">
                  High-capacity ventilation systems for factories, warehouses, and industrial facilities.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Custom system design</li>
                  <li>• Energy-efficient solutions</li>
                  <li>• Compliance with regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Commercial HVAC</h3>
                <p className="text-gray-600 mb-4">
                  Complete HVAC solutions for offices, retail spaces, and commercial buildings.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Climate control systems</li>
                  <li>• Air quality management</li>
                  <li>• Preventive maintenance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Maintenance & Repair</h3>
                <p className="text-gray-600 mb-4">
                  Professional maintenance and repair services to keep your systems running smoothly.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Regular inspections</li>
                  <li>• Emergency repairs</li>
                  <li>• System upgrades</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl mb-6">Why Choose Us</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Expert Team</h3>
                    <p className="text-gray-600">
                      Our certified technicians bring decades of combined experience to every project.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Quality Guarantee</h3>
                    <p className="text-gray-600">
                      We stand behind our work with comprehensive warranties and quality assurance.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Industry Leading</h3>
                    <p className="text-gray-600">
                      Recognized for excellence with multiple industry awards and certifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1647022528152-52ed9338611d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIVkFDJTIwYWlyJTIwY29uZGl0aW9uaW5nfGVufDF8fHx8MTc3MjkyMDMwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="HVAC system"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">
              Ready to improve your air quality? Contact us today for a free consultation
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <form className="space-y-6">
                <div>
                  <Input placeholder="Your Name" className="bg-input-background" />
                </div>
                <div>
                  <Input type="email" placeholder="Your Email" className="bg-input-background" />
                </div>
                <div>
                  <Input placeholder="Phone Number" className="bg-input-background" />
                </div>
                <div>
                  <Textarea placeholder="Your Message" rows={5} className="bg-input-background" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-gray-600">+971 50 313 4010</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600">info@prodigysystems.ae</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-gray-600">
                        Fujairah<br />
                        United Arab Emirates
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="mb-2">Business Hours</h4>
                <div className="text-gray-600 space-y-1">
                  <div>Monday - Friday: 8:00 AM - 6:00 PM</div>
                  <div>Saturday: 9:00 AM - 4:00 PM</div>
                  <div>Sunday: Closed</div>
                  <div className="text-primary font-medium pt-2">24/7 Emergency Service Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImage} alt="Prodigy Logo" className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold">PRODIGY</span>
                  <span className="text-xs text-gray-400">Ventilation Systems</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Professional ventilation solutions for a healthier environment.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Industrial Ventilation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Commercial HVAC</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Maintenance & Repair</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">System Design</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Certifications</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@prodigysystems.ae" className="hover:text-primary transition-colors">info@prodigysystems.ae</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +971 50 313 4010
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span>Fujairah, United Arab Emirates</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Prodigy Ventilation Systems. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}