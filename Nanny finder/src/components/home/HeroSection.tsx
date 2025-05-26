import React from 'react';
import { Search, MapPin, Calendar, Shield } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-700 to-primary-900 pt-16 pb-24 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-400"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 rounded-full bg-accent-500"></div>
        <div className="absolute -bottom-40 right-20 w-72 h-72 rounded-full bg-secondary-500"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Trusted Nannies in Uganda
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-lg">
              Connect with experienced, vetted childcare providers who match your family's needs, schedule, and values.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button size="lg">
                Find a Nanny
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white">
                Register as a Nanny
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center">
                <Shield className="mr-2 text-primary-300" size={20} />
                <span className="text-primary-100">Background Checked</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 text-primary-300" size={20} />
                <span className="text-primary-100">Flexible Scheduling</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-primary-300" size={20} />
                <span className="text-primary-100">All Uganda Regions</span>
              </div>
            </div>
          </div>
          
          <div className="relative bg-white rounded-lg shadow-xl p-6 animate-slideDown">
            <h2 className="text-gray-900 text-xl font-semibold mb-4">Find Your Perfect Nanny</h2>
            
            <form className="space-y-4">
              <Input 
                label="Location"
                placeholder="Enter your city or district"
                leftAddon={<MapPin size={18} />}
                fullWidth
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Service Type"
                  placeholder="Select service"
                  fullWidth
                />
                
                <Input 
                  label="Experience"
                  placeholder="Any experience"
                  fullWidth
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Start Date"
                  type="date"
                  fullWidth
                />
                
                <Input 
                  label="Working Hours"
                  placeholder="Full-time/Part-time"
                  fullWidth
                />
              </div>
              
              <Button 
                leftIcon={<Search size={18} />}
                size="lg"
                fullWidth
                className="mt-2"
              >
                Search Nannies
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              Over 500+ qualified nannies available across Uganda
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;