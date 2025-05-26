import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Award, Heart, Shield } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';

interface NannyProfile {
  id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
  bio: string;
  experience_years: number;
  hourly_rate: number;
  availability: string[];
  specialties: string[];
  background_check: boolean;
  verified: boolean;
}

const NannyCard: React.FC<{
  nanny: NannyProfile;
  highlighted?: boolean;
}> = ({ nanny, highlighted = false }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg relative group",
        highlighted ? "border-2 border-primary-500 transform -translate-y-2" : ""
      )}
    >
      {highlighted && (
        <div className="absolute top-3 right-3 z-10 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Top Rated
        </div>
      )}
      
      <div className="relative h-64 overflow-hidden">
        <img 
          src={nanny.profiles.avatar_url || 'https://via.placeholder.com/300'} 
          alt={nanny.profiles.full_name} 
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <button className="absolute top-3 left-3 bg-white/70 hover:bg-white p-2 rounded-full text-gray-600 hover:text-accent-500 transition-colors">
          <Heart size={20} />
        </button>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{nanny.profiles.full_name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin size={14} className="mr-1" />
              <span>Kampala, Uganda</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {nanny.specialties?.map((specialty, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {specialty}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
          <div className="flex items-center text-gray-600">
            <Clock size={14} className="mr-1" />
            <span>{nanny.availability?.[0] || 'Flexible'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Award size={14} className="mr-1 text-primary-600" />
            <span>{nanny.experience_years} years exp</span>
          </div>
          
          {nanny.verified && (
            <div className="flex items-center text-success-600">
              <Shield size={14} className="mr-1" />
              <span>Verified</span>
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <Button 
            fullWidth
            onClick={() => navigate(`/nannies/${nanny.id}`)}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeaturedNannies: React.FC = () => {
  const navigate = useNavigate();
  const [nannies, setNannies] = useState<NannyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedNannies();
  }, []);

  const loadFeaturedNannies = async () => {
    try {
      const { data, error } = await supabase
        .from('nanny_profiles')
        .select(`
          id,
          profiles (
            full_name,
            avatar_url
          ),
          bio,
          experience_years,
          hourly_rate,
          availability,
          specialties,
          background_check,
          verified
        `)
        .eq('verified', true)
        .limit(4);

      if (error) throw error;
      setNannies(data || []);
    } catch (error) {
      console.error('Error loading featured nannies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Featured Nannies</h2>
          <p className="text-lg text-gray-600">
            Browse through our highest-rated childcare professionals, each thoroughly vetted and ready to provide exceptional care for your children.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {nannies.map((nanny, index) => (
            <NannyCard 
              key={nanny.id} 
              nanny={nanny} 
              highlighted={index === 2} 
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => navigate('/nannies')}
          >
            Browse All Nannies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNannies;