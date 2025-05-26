import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../lib/supabase';

interface NannyProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  experience_years: number;
  hourly_rate: number;
  specialties: string[];
  verified: boolean;
}

const NannyListPage: React.FC = () => {
  const [nannies, setNannies] = useState<NannyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNannies();
  }, []);

  const loadNannies = async () => {
    try {
      const { data, error } = await supabase
        .from('nanny_profiles')
        .select(`
          id,
          profiles:profiles (
            full_name,
            avatar_url
          ),
          bio,
          experience_years,
          hourly_rate,
          specialties,
          verified
        `)
        .eq('verified', true);

      if (error) throw error;

      setNannies(data || []);
    } catch (error) {
      console.error('Error loading nannies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Browse Nannies</h1>
        
        <div className="flex space-x-4 w-full md:w-auto">
          <Input
            placeholder="Search nannies..."
            leftAddon={<Search size={18} />}
            className="w-full md:w-64"
          />
          <Button variant="outline" leftIcon={<Filter size={18} />}>
            Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading nannies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nannies.map((nanny) => (
            <div key={nanny.id} className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="relative h-48">
                <img
                  src={nanny.avatar_url || 'https://via.placeholder.com/300'}
                  alt={nanny.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{nanny.full_name}</h3>
                
                <div className="mt-2 flex items-center text-gray-600">
                  <MapPin size={16} className="mr-1" />
                  <span>Kampala, Uganda</span>
                </div>
                
                <p className="mt-2 text-gray-600 line-clamp-2">{nanny.bio}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {nanny.specialties?.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-semibold text-primary-600">
                    UGX {nanny.hourly_rate}/hr
                  </div>
                  <Button
                    onClick={() => navigate(`/nannies/${nanny.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NannyListPage;