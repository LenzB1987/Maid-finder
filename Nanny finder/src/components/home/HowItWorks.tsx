import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Star, Shield } from 'lucide-react';
import Button from '../ui/Button';

const steps = [
  {
    id: 1,
    title: 'Search for Nannies',
    description: 'Browse through hundreds of qualified nannies in your area and filter by experience, skills, and availability.',
    icon: <Search size={32} />,
    color: 'bg-primary-100 text-primary-700',
    link: '/nannies'
  },
  {
    id: 2,
    title: 'Schedule Interviews',
    description: 'Connect with potential nannies through our platform and schedule interviews to find the perfect match for your family.',
    icon: <Calendar size={32} />,
    color: 'bg-secondary-100 text-secondary-700',
    link: '/messages'
  },
  {
    id: 3,
    title: 'Verify Credentials',
    description: 'All our nannies go through a comprehensive background check and credential verification process for your peace of mind.',
    icon: <Shield size={32} />,
    color: 'bg-success-100 text-success-700',
    link: '/nannies'
  },
  {
    id: 4,
    title: 'Hire and Review',
    description: 'Once you\'ve found your ideal nanny, hire them through our secure platform and leave a review to help other families.',
    icon: <Star size={32} />,
    color: 'bg-accent-100 text-accent-700',
    link: '/bookings'
  },
];

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How NannyConnect Works</h2>
          <p className="text-lg text-gray-600">
            Finding the perfect nanny for your family is easy with our streamlined process. Follow these simple steps to connect with qualified childcare providers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center text-center group cursor-pointer"
              onClick={() => navigate(step.link)}
            >
              <div className="relative mb-8">
                <div className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                
                {step.id < steps.length && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200">
                    <div className="absolute top-0 left-0 h-full w-0 bg-primary-500 group-hover:w-full transition-all duration-500"></div>
                  </div>
                )}
                
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                  {step.id}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => navigate('/nannies')}
          >
            Start Your Search
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;