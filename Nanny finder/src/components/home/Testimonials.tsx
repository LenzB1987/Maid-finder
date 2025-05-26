import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rebecca Nakato',
    role: 'Working Mother',
    location: 'Kampala',
    quote: 'NannyConnect helped me find the perfect nanny for my twins. The platform made it easy to find someone with twin experience, and our nanny has become like family!',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'David Okello',
    role: 'Single Father',
    location: 'Entebbe',
    quote: 'As a single dad, finding reliable childcare was my top priority. The background checks and verified reviews gave me peace of mind when choosing a nanny.',
    image: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'Florence Auma',
    role: 'Professional Nanny',
    location: 'Jinja',
    quote: 'Registering as a nanny on this platform has connected me with wonderful families and steady employment. The platform makes it easy to showcase my experience.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-primary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600">
            Hear from parents and nannies who have found success using our platform to connect and build relationships.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-primary-600 mb-4">
                <Quote size={32} />
              </div>
              
              <p className="text-gray-700 italic mb-6">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-primary-600 rounded-lg shadow-lg p-8 mt-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to find your perfect nanny?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Join hundreds of Ugandan families who have found reliable, qualified childcare through NannyConnect.
          </p>
          <button className="bg-white text-primary-700 font-medium py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;