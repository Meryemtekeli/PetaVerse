import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVetServices, VetService } from "../../services/api/vetServicesApi";

const VeterinariansPage: React.FC = () => {
  const [services, setServices] = useState<VetService[]>([]);
  const [type, setType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getVetServices(type as any).then(setServices);
  }, [type]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Veteriner ve Pet Hizmetleri</h2>
      <div className="mb-4 flex gap-2">
        <select value={type} onChange={e => setType(e.target.value)} className="input w-48">
          <option value="">Tüm Hizmetler</option>
          <option value="vet">Veteriner</option>
          <option value="petshop">Pet Shop</option>
          <option value="groomer">Kuaför</option>
          <option value="trainer">Eğitmen</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Hizmet ara..."
          className="input flex-1"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map(service => (
          <Link key={service.id} to={`/services/${service.id}`} className="block bg-white rounded shadow p-4 hover:shadow-lg transition">
            <div className="font-bold text-lg mb-2">{service.name}</div>
            <div className="text-gray-600 mb-2">{service.type === 'vet' ? 'Veteriner' : service.type === 'petshop' ? 'Pet Shop' : service.type === 'groomer' ? 'Kuaför' : 'Eğitmen'}</div>
            <div className="text-sm text-gray-500 mb-2">{service.description}</div>
            <div className="text-sm text-gray-500 mb-2">{service.address}</div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">{'★'.repeat(Math.round(service.rating))}</span>
              <span className="text-sm text-gray-600">{service.rating} ({service.reviewCount} yorum)</span>
            </div>
          </Link>
        ))}
        {filteredServices.length === 0 && <div className="text-gray-500 col-span-2">Hizmet bulunamadı.</div>}
      </div>
    </div>
  );
};

export default VeterinariansPage; 